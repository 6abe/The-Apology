import { Color, ShaderMaterial, Texture, Vector2 } from 'three';
import type { IUniform } from 'three';

import { ArtContract } from './ArtContract';
import type { PixelArt } from './PixelTexture';
import frag from './shaders/pixel.frag.glsl';
import vert from './shaders/pixel.vert.glsl';

export interface PixelUniforms {
  readonly uMap: IUniform<Texture | null>;
  readonly uHasMap: IUniform<boolean>;
  readonly uPixelSize: IUniform<Vector2>;
  readonly uVoid: IUniform<Color>;
}

export class PixelMaterial extends ShaderMaterial {
  constructor(art: PixelArt) {
    const uniforms = PixelMaterial.uniformsFor(art);
    super({
      vertexShader: vert,
      fragmentShader: frag,
      uniforms: {
        uMap: uniforms.uMap,
        uHasMap: uniforms.uHasMap,
        uPixelSize: uniforms.uPixelSize,
        uVoid: uniforms.uVoid,
      },
      transparent: false,
    });
  }

  static uniformsFor(art: PixelArt): PixelUniforms {
    return {
      uMap: { value: art.kind === 'ready' ? art.texture : null },
      uHasMap: { value: art.kind === 'ready' },
      uPixelSize: { value: new Vector2(art.spec.size.w, art.spec.size.h) },
      uVoid: { value: new Color(ArtContract.VOID) },
    };
  }
}
