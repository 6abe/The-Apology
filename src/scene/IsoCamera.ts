import { ArtContract } from './ArtContract';

export type PixelScale = 1 | 2 | 3 | 4;

export interface IsoCameraProps {
  readonly position: readonly [x: number, y: number, z: number];
  readonly zoom: number;
  readonly near: number;
  readonly far: number;
}

export class IsoCamera {
  static readonly DISTANCE = 10;

  static readonly GL = { antialias: false, alpha: false, powerPreference: 'high-performance' } as const;

  static canvasProps(scale: PixelScale): IsoCameraProps {
    return {
      position: [0, 0, IsoCamera.DISTANCE],
      zoom: ArtContract.PIXELS_PER_UNIT * scale,
      near: 0.1,
      far: 100,
    };
  }

  static dpr(): number {
    return Math.max(1, Math.floor(window.devicePixelRatio));
  }
}
