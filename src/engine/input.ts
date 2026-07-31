"""Rafeeq Game Engine — Input System (Touch + Keyboard + Gyroscope)"""

export interface InputState {
  touches: Map<number, { x: number; y: number; startX: number; startY: number }>;
  keys: Set<string>;
  gyroscope: { alpha: number; beta: number; gamma: number };
  mouse: { x: number; y: number; dx: number; dy: number; buttons: number };
}

export class InputManager {
  state: InputState = {
    touches: new Map(),
    keys: new Set(),
    gyroscope: { alpha: 0, beta: 0, gamma: 0 },
    mouse: { x: 0, y: 0, dx: 0, dy: 0, buttons: 0 },
  };

  private canvas: HTMLCanvasElement;
  private boundHandlers: Array<{ type: string; handler: EventListener }> = [];

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.setupTouch();
    this.setupKeyboard();
    this.setupMouse();
  }

  private setupTouch(): void {
    const onTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      const rect = this.canvas.getBoundingClientRect();
      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i];
        this.state.touches.set(t.identifier, {
          x: t.clientX - rect.left,
          y: t.clientY - rect.top,
          startX: t.clientX - rect.left,
          startY: t.clientY - rect.top,
        });
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const rect = this.canvas.getBoundingClientRect();
      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i];
        const existing = this.state.touches.get(t.identifier);
        if (existing) {
          this.state.touches.set(t.identifier, {
            ...existing,
            x: t.clientX - rect.left,
            y: t.clientY - rect.top,
          });
        }
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      for (let i = 0; i < e.changedTouches.length; i++) {
        this.state.touches.delete(e.changedTouches[i].identifier);
      }
    };

    this.canvas.addEventListener("touchstart", onTouchStart, { passive: false });
    this.canvas.addEventListener("touchmove", onTouchMove, { passive: false });
    this.canvas.addEventListener("touchend", onTouchEnd, { passive: false });
    this.canvas.addEventListener("touchcancel", onTouchEnd, { passive: false });
  }

  private setupKeyboard(): void {
    const onKeyDown = (e: KeyboardEvent) => {
      this.state.keys.add(e.code);
    };
    const onKeyUp = (e: KeyboardEvent) => {
      this.state.keys.delete(e.code);
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
  }

  private setupMouse(): void {
    const onMouseMove = (e: MouseEvent) => {
      const rect = this.canvas.getBoundingClientRect();
      this.state.mouse.dx = e.clientX - rect.left - this.state.mouse.x;
      this.state.mouse.dy = e.clientY - rect.top - this.state.mouse.y;
      this.state.mouse.x = e.clientX - rect.left;
      this.state.mouse.y = e.clientY - rect.top;
    };
    const onMouseDown = (e: MouseEvent) => {
      this.state.mouse.buttons |= 1 << e.button;
    };
    const onMouseUp = (e: MouseEvent) => {
      this.state.mouse.buttons &= ~(1 << e.button);
    };

    this.canvas.addEventListener("mousemove", onMouseMove);
    this.canvas.addEventListener("mousedown", onMouseDown);
    this.canvas.addEventListener("mouseup", onMouseUp);
  }

  isKeyDown(code: string): boolean {
    return this.state.keys.has(code);
  }

  isTouching(): boolean {
    return this.state.touches.size > 0;
  }

  getTouchDelta(identifier: number = 0): { dx: number; dy: number } | null {
    const touch = this.state.touches.get(identifier);
    if (!touch) return null;
    return { dx: touch.x - touch.startX, dy: touch.y - touch.startY };
  }

  dispose(): void {
    // Cleanup handled by removing listeners if needed
  }
}
