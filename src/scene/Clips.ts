import { PixelTexture } from './PixelTexture';
import { SpriteSpec } from './SpriteSpec';

export type Pose = 'idle' | 'walk' | 'attack' | 'hit' | 'dead';

export class Clips {
  static readonly scout: Record<Pose, SpriteSpec> = {
    idle: SpriteSpec.character('scout/scout_idle_se_30.png'),
    walk: SpriteSpec.character('scout/scout_walk_se_33.png'),
    attack: SpriteSpec.character('scout/scout_attack_se_33.png'),
    hit: SpriteSpec.character('scout/scout_hit_se_32.png'),
    dead: SpriteSpec.character('scout/scout_death_se_29.png'),
  };

  static readonly brute: Record<Pose, SpriteSpec> = {
    idle: SpriteSpec.character('enemies/enemy_drone_brute_hover_se_31.png'),
    walk: SpriteSpec.character('enemies/enemy_drone_brute_hover_se_31.png'),
    attack: SpriteSpec.character('enemies/enemy_drone_brute_attack_se_28.png'),
    hit: SpriteSpec.character('enemies/enemy_drone_brute_hover_se_31.png'),
    dead: SpriteSpec.character('enemies/enemy_drone_brute_death_se_04.png'),
  };

  static readonly floor = SpriteSpec.square('tiles/tile_fill_29.png', 1024);

  static readonly crate = SpriteSpec.character('props/prop_crate_tech_05.png');

  static readonly ammo = SpriteSpec.character('props/prop_ammo_crate_25.png');

  static readonly hazard = SpriteSpec.character('tiles/tile_hazard_28.png');

  static preload(): Promise<unknown> {
    return Promise.all(Clips.all().map((spec) => PixelTexture.load(spec)));
  }

  static kit(kind: 'scout' | 'brute'): Record<Pose, SpriteSpec> {
    return kind === 'scout' ? Clips.scout : Clips.brute;
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
