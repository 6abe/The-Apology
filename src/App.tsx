import { useState, type ReactElement } from 'react';

import { GameCanvas } from './scene/GameCanvas';

export default function App(): ReactElement {
  const [hud, setHud] = useState('HP 3/3');
  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 12,
          left: 14,
          zIndex: 2,
          color: '#E8EEF7',
          font: '14px/1.2 ui-monospace, SFMono-Regular, Menlo, monospace',
          letterSpacing: '0.04em',
          pointerEvents: 'none',
          textShadow: '0 1px 0 #070B12',
        }}
      >
        {hud}
      </div>
      <GameCanvas onHud={setHud} />
    </>
  );
}
