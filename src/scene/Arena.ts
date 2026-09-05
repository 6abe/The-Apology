import { ArtContract } from './ArtContract';
import { Clips } from './Clips';
import type { Sample } from './Input';
import type { SpriteSpec } from './SpriteSpec';

export type Phase =
  | { readonly name: 'idle' }
  | { readonly name: 'walk'; age: number }
  | { readonly name: 'attack'; age: number; landed: boolean }
  | { readonly name: 'hit'; age: number }
  | { readonly name: 'dead'; age: number };

export type Actor = {
  readonly id: string;
  readonly kind: 'scout' | 'brute';
  x: number;
  y: number;
  hp: number;
  readonly maxHp: number;
  phase: Phase;
  cooldown: number;
};

export type Prop = {
  readonly id: string;
  readonly spec: SpriteSpec;
  readonly x: number;
  readonly y: number;
  readonly radius: number;
};

export type SpriteView = {
  readonly key: string;
  readonly spec: SpriteSpec;
  readonly at: readonly [number, number];
  readonly z: number;
};

export type ArenaView = {
  readonly hud: string;
  readonly outcome: 'play' | 'win' | 'dead';
  readonly floor: SpriteView;
  readonly props: readonly SpriteView[];
  readonly actors: readonly SpriteView[];
};

const SPEED = 4.2;
const DRONE_SPEED = 1.7;
const REACH = 1.35;
const DRONE_REACH = 0.95;
const BODY = 0.45;
const HALF = 6.5;
const GRACE = 1.1;

export class Arena {
  private actors: Actor[];

  private readonly props: Prop[];

  private outcome: 'play' | 'win' | 'dead' = 'play';

  private loggedWin = false;

  private age = 0;

  private constructor(actors: Actor[], props: Prop[]) {
    this.actors = actors;
    this.props = props;
  }

  static spawn(): Arena {
    return new Arena(
      [
        Arena.actor('player', 'scout', 4, -3.5, 4),
        Arena.actor('drone-a', 'brute', -4, 3.5, 1, 0),
        Arena.actor('drone-b', 'brute', -3, 4.4, 1, 0.45),
      ],
      [
        { id: 'crate', spec: Clips.crate, x: 2.4, y: 1.6, radius: 0.55 },
        { id: 'ammo', spec: Clips.ammo, x: -2.2, y: -1.4, radius: 0.55 },
        { id: 'hazard', spec: Clips.hazard, x: 0.2, y: 2.6, radius: 0.5 },
      ],
    );
  }

  tick(dt: number, input: Sample): void {
    this.age += dt;
    const player = this.player();
    if (player.phase.name === 'dead') {
      player.phase = { name: 'dead', age: player.phase.age + dt };
      if (player.phase.age > 1.6) {
        const next = Arena.spawn();
        this.actors = next.actors;
        this.outcome = 'play';
        this.loggedWin = false;
        this.age = 0;
      }
      return;
    }
    this.tickActor(player, dt, input);
    if (this.age >= GRACE) {
      for (const drone of this.drones()) {
        this.tickDrone(drone, dt, player);
      }
    }
    if (this.outcome === 'play' && this.drones().every((drone) => drone.phase.name === 'dead')) {
      this.outcome = 'win';
      if (!this.loggedWin) {
        this.loggedWin = true;
        console.log('[arena] drones cleared');
      }
    }
  }

  view(): ArenaView {
    const player = this.player();
    const pose = player.phase.name;
    const hud =
      this.outcome === 'win'
        ? `HP ${player.hp}/${player.maxHp}  ·  clear`
        : this.outcome === 'dead'
          ? `HP 0/${player.maxHp}  ·  down`
          : `HP ${player.hp}/${player.maxHp}  ·  ${pose}`;
    return {
      hud,
      outcome: this.outcome,
      floor: { key: 'floor', spec: Clips.floor, at: [0, 0], z: -8 },
      props: this.props.map((prop) => ({
        key: prop.id,
        spec: prop.spec,
        at: [prop.x, prop.y] as const,
        z: 0,
      })),
      actors: this.actors.map((actor) => ({
        key: actor.id,
        spec: Clips.specFor(actor.kind, actor.phase.name, 'age' in actor.phase ? actor.phase.age : 0),
        at: [actor.x, actor.y] as const,
        z: 0,
      })),
    };
  }

  private tickActor(actor: Actor, dt: number, input: Sample): void {
    actor.cooldown = Math.max(0, actor.cooldown - dt);
    if (actor.phase.name === 'hit') {
      actor.phase = { name: 'hit', age: actor.phase.age + dt };
      if (actor.phase.age > 0.22) {
        actor.phase = { name: 'idle' };
      }
      return;
    }
    if (actor.phase.name === 'attack') {
      actor.phase = { name: 'attack', age: actor.phase.age + dt, landed: actor.phase.landed };
      if (actor.phase.age >= 0.08 && actor.phase.age <= 0.42) {
        this.strike(actor, [0, 0], REACH, 1);
      }
      if (actor.phase.age > 0.48 && !input.holding) {
        actor.phase = { name: 'idle' };
      }
      return;
    }
    if (input.attack && actor.cooldown <= 0) {
      actor.phase = { name: 'attack', age: 0, landed: false };
      actor.cooldown = 0.42;
      return;
    }
    if (input.mx !== 0 || input.my !== 0) {
      const age = actor.phase.name === 'walk' ? actor.phase.age + dt : 0;
      actor.phase = { name: 'walk', age };
      this.move(actor, input.mx * SPEED * dt, input.my * SPEED * dt);
      return;
    }
    actor.phase = { name: 'idle' };
  }

  private tickDrone(drone: Actor, dt: number, player: Actor): void {
    drone.cooldown = Math.max(0, drone.cooldown - dt);
    if (drone.phase.name === 'dead') {
      drone.phase = { name: 'dead', age: drone.phase.age + dt };
      return;
    }
    if (drone.phase.name === 'attack') {
      drone.phase = { name: 'attack', age: drone.phase.age + dt, landed: drone.phase.landed };
      if (!drone.phase.landed && drone.phase.age >= 0.1) {
        drone.phase.landed = true;
        this.hurt(player, 1);
      }
      if (drone.phase.age > 0.36) {
        drone.phase = { name: 'idle' };
      }
      return;
    }
    const dx = player.x - drone.x;
    const dy = player.y - drone.y;
    const dist = Math.hypot(dx, dy);
    if (dist < DRONE_REACH + 0.15 && drone.cooldown <= 0 && player.phase.name !== 'dead') {
      drone.phase = { name: 'attack', age: 0, landed: false };
      drone.cooldown = 0.95;
      return;
    }
    if (dist > 0.55) {
      const age = drone.phase.name === 'walk' ? drone.phase.age + dt : 0;
      drone.phase = { name: 'walk', age };
      this.move(drone, (dx / dist) * DRONE_SPEED * dt, (dy / dist) * DRONE_SPEED * dt);
      return;
    }
    drone.phase = { name: 'idle' };
  }

  private strike(source: Actor, dir: readonly [number, number], reach: number, damage: number): void {
    const hx = source.x + dir[0];
    const hy = source.y + dir[1];
    for (const other of this.actors) {
      if (other.id === source.id || other.phase.name === 'dead') {
        continue;
      }
      if (Math.hypot(other.x - hx, other.y - hy) <= reach) {
        this.hurt(other, damage);
      }
    }
  }

  private hurt(actor: Actor, damage: number): void {
    if (actor.phase.name === 'dead' || actor.phase.name === 'hit') {
      return;
    }
    actor.hp = Math.max(0, actor.hp - damage);
    if (actor.hp <= 0) {
      actor.phase = { name: 'dead', age: 0 };
      if (actor.kind === 'scout') {
        this.outcome = 'dead';
      }
      return;
    }
    if (actor.kind === 'scout') {
      actor.phase = { name: 'hit', age: 0 };
    }
  }

  private move(actor: Actor, dx: number, dy: number): void {
    const clamp = (value: number): number => ArtContract.snap(Math.max(-HALF, Math.min(HALF, value)));
    const x = clamp(actor.x + dx);
    const y = clamp(actor.y + dy);
    if (!this.blocked(x, y, actor.id)) {
      actor.x = x;
      actor.y = y;
      return;
    }
    if (!this.blocked(x, actor.y, actor.id)) {
      actor.x = x;
      return;
    }
    if (!this.blocked(actor.x, y, actor.id)) {
      actor.y = y;
    }
  }

  private blocked(x: number, y: number, self: string): boolean {
    for (const prop of this.props) {
      if (Math.hypot(x - prop.x, y - prop.y) < prop.radius + BODY) {
        return true;
      }
    }
    for (const other of this.actors) {
      if (other.id === self || other.phase.name === 'dead') {
        continue;
      }
      if (Math.hypot(x - other.x, y - other.y) < BODY * 2) {
        return true;
      }
    }
    return false;
  }

  private player(): Actor {
    const actor = this.actors[0];
    if (!actor) {
      throw new Error('arena missing player');
    }
    return actor;
  }

  private drones(): Actor[] {
    return this.actors.filter((actor) => actor.kind === 'brute');
  }

  private static actor(
    id: string,
    kind: Actor['kind'],
    x: number,
    y: number,
    hp: number,
    cooldown = 0,
  ): Actor {
    return { id, kind, x, y, hp, maxHp: hp, phase: { name: 'idle' }, cooldown };
  }
}
