import { use, useEffect, useMemo, type ReactElement } from 'react';

import { PixelMaterial } from './PixelMaterial';
import { PixelTexture } from './PixelTexture';
import type { SpriteSpec } from './SpriteSpec';

export interface PixelSpriteProps {
  readonly spec: SpriteSpec;
  readonly at?: readonly [x: number, y: number];
  readonly z?: number;
}

export function PixelSprite({ spec, at = [0, 0], z = 0 }: PixelSpriteProps): ReactElement {
  const art = use(PixelTexture.load(spec));
  const material = useMemo(() => new PixelMaterial(art), [art]);
  useEffect(() => () => material.dispose(), [material]);
  const [x, y, depth] = spec.meshPosition(at);
  return (
    <mesh position={[x, y, depth + z]} material={material}>
      <planeGeometry args={spec.worldSize()} />
    </mesh>
  );
}
