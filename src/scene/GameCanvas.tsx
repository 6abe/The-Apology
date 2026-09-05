import { OrthographicCamera } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { Suspense, use, useEffect, useRef, useState, type ReactElement } from 'react';

import { Arena, type ArenaView } from './Arena';
import { ArtContract } from './ArtContract';
import { Clips } from './Clips';
import { Input } from './Input';
import { IsoCamera } from './IsoCamera';
import { PixelSprite } from './PixelSprite';

export function GameCanvas({ onHud }: { readonly onHud: (line: string) => void }): ReactElement {
  useEffect(() => Input.mount(), []);
  return (
    <Canvas gl={IsoCamera.GL} dpr={IsoCamera.dpr()} flat>
      <OrthographicCamera makeDefault {...IsoCamera.canvasProps(2)} />
      <color attach="background" args={[ArtContract.VOID]} />
      <Suspense fallback={null}>
        <Boot onHud={onHud} />
      </Suspense>
    </Canvas>
  );
}

function Boot({ onHud }: { readonly onHud: (line: string) => void }): ReactElement {
  use(Clips.preload());
  return <Playfield onHud={onHud} />;
}

function Playfield({ onHud }: { readonly onHud: (line: string) => void }): ReactElement {
  const arena = useRef(Arena.spawn());
  const hud = useRef('');
  const [view, setView] = useState<ArenaView>(() => arena.current.view());
  useFrame((_, dt) => {
    arena.current.tick(Math.min(dt, 0.05), Input.sample());
    const next = arena.current.view();
    setView(next);
    if (next.hud !== hud.current) {
      hud.current = next.hud;
      onHud(next.hud);
    }
  });
  return (
    <>
      <PixelSprite spec={view.floor.spec} at={view.floor.at} z={view.floor.z} />
      {view.props.map((sprite) => (
        <PixelSprite key={sprite.key} spec={sprite.spec} at={sprite.at} z={sprite.z} />
      ))}
      {view.actors.map((sprite) => (
        <PixelSprite key={sprite.key} spec={sprite.spec} at={sprite.at} z={sprite.z} />
      ))}
    </>
  );
}
