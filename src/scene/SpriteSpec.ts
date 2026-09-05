import { ArtContract, type PixelPoint, type PixelSize } from './ArtContract';

export type AssetUrl = string & { readonly __brand: 'AssetUrl' };

export class SpriteSpec {
  private constructor(
    readonly url: AssetUrl,
    readonly size: PixelSize,
    readonly pivot: PixelPoint,
  ) {}

  static character(path: string): SpriteSpec {
    return new SpriteSpec(SpriteSpec.parseUrl(path), ArtContract.CHARACTER.size, ArtContract.CHARACTER.pivot);
  }

  static tile(path: string): SpriteSpec {
    return new SpriteSpec(SpriteSpec.parseUrl(path), ArtContract.TILE.size, ArtContract.TILE.pivot);
  }

  get name(): string {
    const file = this.url.split('/').pop() ?? '';
    return file.replace(/\.png$/u, '');
  }

  get key(): string {
    return `${this.url}#${this.size.w}x${this.size.h}`;
  }

  worldSize(): [w: number, h: number] {
    return [ArtContract.toWorld(this.size.w), ArtContract.toWorld(this.size.h)];
  }

  meshPosition(at: readonly [x: number, y: number]): [x: number, y: number, z: number] {
    const x = ArtContract.snap(at[0]);
    const y = ArtContract.snap(at[1]);
    const dx = ArtContract.toWorld(this.size.w / 2 - this.pivot.x);
    const dy = ArtContract.toWorld(this.pivot.y - this.size.h / 2);
    return [x + dx, y + dy, 0];
  }

  private static parseUrl(path: string): AssetUrl {
    if (path.startsWith('/') || path.split('/').includes('..')) {
      throw new TypeError(`invalid asset path: ${path}`);
    }
    if (!/^[a-z0-9_\-/.]+$/u.test(path)) {
      throw new TypeError(`invalid asset path: ${path}`);
    }
    if (!path.endsWith('.png')) {
      throw new TypeError(`invalid asset path: ${path}`);
    }
    const root = ArtContract.ASSET_ROOT.replace(/^\//u, '');
    return `${import.meta.env.BASE_URL}${root}${path}` as AssetUrl;
  }
}
