import { NearestFilter, SRGBColorSpace, Texture } from 'three';

import type { SpriteSpec } from './SpriteSpec';

export type MissingReason = 'not-found' | 'network' | 'not-an-image' | 'undecodable' | 'size-mismatch';

export type PixelArt =
  | { readonly kind: 'ready'; readonly spec: SpriteSpec; readonly texture: Texture }
  | {
      readonly kind: 'missing';
      readonly spec: SpriteSpec;
      readonly reason: MissingReason;
      readonly detail: string;
    };

export class PixelTexture {
  private static readonly cache = new Map<string, Promise<PixelArt>>();

  static load(spec: SpriteSpec): Promise<PixelArt> {
    const hit = PixelTexture.cache.get(spec.key);
    if (hit) {
      return hit;
    }
    const pending = PixelTexture.decode(spec);
    PixelTexture.cache.set(spec.key, pending);
    return pending;
  }

  static applyPixelFilter<T extends Texture>(texture: T): T {
    texture.magFilter = NearestFilter;
    texture.minFilter = NearestFilter;
    texture.generateMipmaps = false;
    texture.colorSpace = SRGBColorSpace;
    return texture;
  }

  private static missing(spec: SpriteSpec, reason: MissingReason, detail: string): PixelArt {
    console.warn(`[art] ${spec.name}: ${reason}. ${detail}`);
    return { kind: 'missing', spec, reason, detail };
  }

  private static async decode(spec: SpriteSpec): Promise<PixelArt> {
    let res: Response;
    try {
      res = await fetch(spec.url);
    } catch {
      return PixelTexture.missing(spec, 'network', 'fetch threw');
    }
    if (res.status === 404) {
      return PixelTexture.missing(spec, 'not-found', `HTTP 404 ${spec.url}`);
    }
    if (!res.ok) {
      return PixelTexture.missing(spec, 'network', `HTTP ${res.status}`);
    }
    const ct = res.headers.get('content-type') ?? '';
    if (!ct.startsWith('image/')) {
      return PixelTexture.missing(spec, 'not-an-image', `content-type ${ct}`);
    }
    let bitmap: ImageBitmap;
    try {
      bitmap = await createImageBitmap(await res.blob(), {
        imageOrientation: 'flipY',
        premultiplyAlpha: 'none',
        colorSpaceConversion: 'none',
      });
    } catch {
      return PixelTexture.missing(spec, 'undecodable', 'decode failed');
    }
    const image = PixelTexture.fitContract(bitmap, spec);
    if (image === 'mismatch') {
      const detail = `got ${bitmap.width}x${bitmap.height}, contract says ${spec.size.w}x${spec.size.h}`;
      bitmap.close();
      return PixelTexture.missing(spec, 'size-mismatch', detail);
    }
    const texture = new Texture(image);
    texture.flipY = false;
    PixelTexture.applyPixelFilter(texture);
    texture.needsUpdate = true;
    return { kind: 'ready', spec, texture };
  }

  private static fitContract(bitmap: ImageBitmap, spec: SpriteSpec): TexImageSource | 'mismatch' {
    if (bitmap.width === spec.size.w && bitmap.height === spec.size.h) {
      return bitmap;
    }
    const sx = bitmap.width / spec.size.w;
    const sy = bitmap.height / spec.size.h;
    if (sx < 1 || sy < 1 || sx !== sy || !Number.isInteger(sx)) {
      return 'mismatch';
    }
    const canvas = document.createElement('canvas');
    canvas.width = spec.size.w;
    canvas.height = spec.size.h;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return 'mismatch';
    }
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(bitmap, 0, 0, spec.size.w, spec.size.h);
    bitmap.close();
    return canvas;
  }
}
