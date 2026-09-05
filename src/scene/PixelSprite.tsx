import { use, useEffect, useMemo, type ReactElement } from 'react';

import { PixelMaterial } from './PixelMaterial';
import { PixelTexture } from './PixelTexture';
import type { SpriteSpec } from './SpriteSpec';

export interface PixelSpriteProps {
  readonly spec: SpriteSpec;
  readonly at?: readonly [x: number, y: number];
}

export function PixelSprite({ spec, at = [0, 0] }: PixelSpriteProps): ReactElement {
  const art = use(PixelTexture.load(spec));
  const material = useMemo(() => new PixelMaterial(art), [art]);
  useEffect(() => () => material.dispose(), [material]);
  return (
    <mesh position={spec.meshPosition(at)} material={material}>
      <planeGeometry args={spec.worldSize()} />
    </mesh>
  );
}
