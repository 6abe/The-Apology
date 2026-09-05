import { OrthographicCamera } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Suspense, type ReactElement } from 'react';

import { ArtContract } from './ArtContract';
import { IsoCamera } from './IsoCamera';
import { PixelSprite } from './PixelSprite';
import { SpriteSpec } from './SpriteSpec';

export const DEMO = SpriteSpec.character('packs/player_walk_00_64.png');

export function GameCanvas(): ReactElement {
  return (
    <Canvas gl={IsoCamera.GL} dpr={IsoCamera.dpr()} flat>
      <OrthographicCamera makeDefault {...IsoCamera.canvasProps(3)} />
      <color attach="background" args={[ArtContract.VOID]} />
      <Suspense fallback={null}>
        <PixelSprite spec={DEMO} at={[0, 0]} />
      </Suspense>
    </Canvas>
  );
}
