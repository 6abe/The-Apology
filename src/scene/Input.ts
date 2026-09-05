export type Sample = {
  readonly mx: number;
  readonly my: number;
  readonly attack: boolean;
  readonly holding: boolean;
};

export class Input {
  private static readonly held = new Set<string>();

  private static queued = false;

  private static bound = false;

  static mount(): () => void {
    if (Input.bound) {
      return () => undefined;
    }
    Input.bound = true;
    const down = (event: KeyboardEvent): void => {
      Input.held.add(event.code);
      if (event.code === 'Space') {
        event.preventDefault();
        Input.queued = true;
      }
    };
    const up = (event: KeyboardEvent): void => {
      Input.held.delete(event.code);
    };
    const pointer = (event: PointerEvent): void => {
      if (event.button === 0) {
        Input.queued = true;
      }
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    window.addEventListener('pointerdown', pointer);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
      window.removeEventListener('pointerdown', pointer);
      Input.held.clear();
      Input.queued = false;
      Input.bound = false;
    };
  }

  static sample(): Sample {
    let mx = 0;
    let my = 0;
    if (Input.held.has('KeyW') || Input.held.has('ArrowUp')) {
      my += 1;
    }
    if (Input.held.has('KeyS') || Input.held.has('ArrowDown')) {
      my -= 1;
    }
    if (Input.held.has('KeyA') || Input.held.has('ArrowLeft')) {
      mx -= 1;
    }
    if (Input.held.has('KeyD') || Input.held.has('ArrowRight')) {
      mx += 1;
    }
    const len = Math.hypot(mx, my);
    const attack = Input.queued;
    Input.queued = false;
    const holding = Input.held.has('Space');
    if (len === 0) {
      return { mx: 0, my: 0, attack, holding };
    }
    return { mx: mx / len, my: my / len, attack, holding };
  }
}
