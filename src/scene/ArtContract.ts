export interface PixelSize {
  readonly w: number;
  readonly h: number;
}

export interface PixelPoint {
  readonly x: number;
  readonly y: number;
}

export interface Footprint {
  readonly size: PixelSize;
  readonly pivot: PixelPoint;
}

export class ArtContract {
  static readonly PIXELS_PER_UNIT = 32;

  static readonly VOID = '#070B12';

  static readonly CHARACTER: Footprint = { size: { w: 64, h: 64 }, pivot: { x: 32, y: 60 } };

  static readonly TILE: Footprint = { size: { w: 64, h: 32 }, pivot: { x: 32, y: 16 } };

  static readonly ASSET_ROOT = '/assets/agreed/';

  static toWorld(px: number): number {
    return px / ArtContract.PIXELS_PER_UNIT;
  }

  static snap(world: number): number {
    return Math.round(world * ArtContract.PIXELS_PER_UNIT) / ArtContract.PIXELS_PER_UNIT;
  }
}
