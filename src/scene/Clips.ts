import { PixelTexture } from './PixelTexture';
import { SpriteSpec } from './SpriteSpec';

export type Pose = 'idle' | 'walk' | 'attack' | 'hit' | 'dead';

const WALK_FPS = 10;
const WALK_FRAMES = 8;

export class Clips {
  static readonly scout: Record<Pose, SpriteSpec> = {
    idle: SpriteSpec.character('scout/scout_idle_se_30.png'),
    walk: SpriteSpec.character('scout/scout_walk_se_33.png'),
    attack: SpriteSpec.character('scout/scout_attack_se_33.png'),
    hit: SpriteSpec.character('scout/scout_hit_se_33.png'),
    dead: SpriteSpec.character('scout/scout_death_se_29.png'),
  };

  static readonly walkStrip: readonly SpriteSpec[] = [0, 1, 2, 3, 4, 5, 6, 7].map((frame) =>
    SpriteSpec.character(`scout/scout_walk_se_f0${frame}.png`),
  );

  private static readonly walkReady = new Set<string>();

  static readonly brute: Record<Pose, SpriteSpec> = {
    idle: SpriteSpec.character('enemies/enemy_drone_brute_hover_se_31.png'),
    walk: SpriteSpec.character('enemies/enemy_drone_brute_hover_se_31.png'),
    attack: SpriteSpec.character('enemies/enemy_drone_brute_attack_se_28.png'),
    hit: SpriteSpec.character('enemies/enemy_drone_brute_hover_se_31.png'),
    dead: SpriteSpec.character('enemies/enemy_drone_brute_death_se_04.png'),
  };

  static readonly floor = SpriteSpec.square('tiles/tile_fill_30.png', 1024);

  static readonly crate = SpriteSpec.character('props/prop_crate_tech_05.png');

  static readonly ammo = SpriteSpec.character('props/prop_ammo_crate_25.png');

  static readonly hazard = SpriteSpec.character('tiles/tile_hazard_28.png');

  private static boot: Promise<unknown> | undefined;

  static preload(): Promise<unknown> {
    Clips.boot ??= Clips.bootLoad();
    return Clips.boot;
  }

  static specFor(kind: 'scout' | 'brute', pose: Pose, age: number): SpriteSpec {
    if (kind === 'scout' && pose === 'walk') {
      const frame = Clips.walkStrip[Math.floor(age * WALK_FPS) % WALK_FRAMES];
      if (frame && Clips.walkReady.has(frame.key)) {
        return frame;
      }
      return Clips.scout.walk;
    }
    return (kind === 'scout' ? Clips.scout : Clips.brute)[pose];
  }

  private static async bootLoad(): Promise<void> {
    await Promise.all(Clips.all().map((spec) => PixelTexture.load(spec)));
    await Promise.all(
      Clips.walkStrip.map(async (spec) => {
        const art = await PixelTexture.load(spec);
        if (art.kind === 'ready') {
          Clips.walkReady.add(spec.key);
        }
      }),
    );
  }

  private static all(): SpriteSpec[] {
    return [
      ...Object.values(Clips.scout),
      ...Object.values(Clips.brute),
      Clips.floor,
      Clips.crate,
      Clips.ammo,
      Clips.hazard,
    ];
  }
}
