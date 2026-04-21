import { useCallback, useEffect, useRef } from "react";

const CELL_SIZE = 12;
const SIM_INTERVAL = 80;
const DECAY_RATE = 0.02;
const SPAWN_RADIUS = 2;
const SPAWN_CHANCE = 0.4;

const ACCENT_R = 143;
const ACCENT_G = 201;
const ACCENT_B = 158;

export function GameOfLifeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<{
    cols: number;
    rows: number;
    current: number[][];
    next: number[][];
    display: number[][];
    mouse: { x: number; y: number; active: boolean };
    lastUpdate: number;
    animId: number;
  } | null>(null);

  const makeGrid = (c: number, r: number) =>
    Array.from({ length: c }, () => new Array<number>(r).fill(0));

  const init = useCallback((canvas: HTMLCanvasElement) => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const cols = Math.ceil(canvas.width / CELL_SIZE);
    const rows = Math.ceil(canvas.height / CELL_SIZE);
    stateRef.current = {
      cols,
      rows,
      current: makeGrid(cols, rows),
      next: makeGrid(cols, rows),
      display: makeGrid(cols, rows),
      mouse: { x: -1000, y: -1000, active: false },
      lastUpdate: 0,
      animId: 0,
    };
  }, []);

  const countNeighbors = (
    board: number[][],
    x: number,
    y: number,
    cols: number,
    rows: number,
  ) => {
    let count = 0;
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        count +=
          board[(x + dx + cols) % cols][(y + dy + rows) % rows];
      }
    }
    return count;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    init(canvas);

    const onResize = () => init(canvas);

    const onInteraction = (cx: number, cy: number) => {
      const s = stateRef.current;
      if (!s) return;
      const rect = canvas.getBoundingClientRect();
      s.mouse.x = cx - rect.left;
      s.mouse.y = cy - rect.top;
      s.mouse.active = true;
      const gx = Math.floor(s.mouse.x / CELL_SIZE);
      const gy = Math.floor(s.mouse.y / CELL_SIZE);
      for (let dx = -SPAWN_RADIUS; dx <= SPAWN_RADIUS; dx++) {
        for (let dy = -SPAWN_RADIUS; dy <= SPAWN_RADIUS; dy++) {
          const tx = (gx + dx + s.cols) % s.cols;
          const ty = (gy + dy + s.rows) % s.rows;
          if (Math.random() < SPAWN_CHANCE) {
            s.current[tx][ty] = 1;
            s.display[tx][ty] = 1;
          }
        }
      }
    };

    const onMouseMove = (e: MouseEvent) =>
      onInteraction(e.clientX, e.clientY);
    const onTouchStart = (e: TouchEvent) =>
      onInteraction(e.touches[0].clientX, e.touches[0].clientY);
    const onTouchMove = (e: TouchEvent) => {
      onInteraction(e.touches[0].clientX, e.touches[0].clientY);
      e.preventDefault();
    };
    const onLeave = () => {
      if (stateRef.current) stateRef.current.mouse.active = false;
    };

    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("touchstart", onTouchStart);
    canvas.addEventListener("touchmove", onTouchMove, {
      passive: false,
    });
    canvas.addEventListener("mouseleave", onLeave);
    canvas.addEventListener("touchend", onLeave);
    window.addEventListener("resize", onResize);

    const animate = (ts: number) => {
      const s = stateRef.current;
      if (!s) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const bgGrad = ctx.createRadialGradient(
        canvas.width * 0.5,
        canvas.height * 0.5,
        0,
        canvas.width * 0.5,
        canvas.height * 0.5,
        canvas.width,
      );
      bgGrad.addColorStop(
        0,
        `rgba(${ACCENT_R}, ${ACCENT_G}, ${ACCENT_B}, 0.03)`,
      );
      bgGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (ts - s.lastUpdate > SIM_INTERVAL) {
        for (let x = 0; x < s.cols; x++) {
          for (let y = 0; y < s.rows; y++) {
            const alive = s.current[x][y];
            const n = countNeighbors(
              s.current,
              x,
              y,
              s.cols,
              s.rows,
            );
            if (alive === 0 && n === 3) {
              s.next[x][y] = 1;
            } else if (alive === 1 && (n < 2 || n > 3)) {
              s.next[x][y] = 0;
            } else {
              s.next[x][y] = alive;
            }
          }
        }
        for (let x = 0; x < s.cols; x++) {
          for (let y = 0; y < s.rows; y++) {
            s.current[x][y] = s.next[x][y];
          }
        }
        s.lastUpdate = ts;
      }

      for (let x = 0; x < s.cols; x++) {
        for (let y = 0; y < s.rows; y++) {
          if (s.current[x][y] === 1) {
            s.display[x][y] = 1;
          } else {
            s.display[x][y] = Math.max(
              0,
              s.display[x][y] - DECAY_RATE,
            );
          }
          const opacity = s.display[x][y];
          if (opacity > 0) {
            ctx.fillStyle = `rgba(${ACCENT_R}, ${ACCENT_G}, ${ACCENT_B}, ${opacity * 0.15})`;
            const size = CELL_SIZE - 2;
            ctx.fillRect(
              x * CELL_SIZE + 1,
              y * CELL_SIZE + 1,
              size,
              size,
            );
            if (opacity > 0.8) {
              ctx.shadowBlur = 10;
              ctx.shadowColor = `rgba(${ACCENT_R}, ${ACCENT_G}, ${ACCENT_B}, 0.4)`;
            } else {
              ctx.shadowBlur = 0;
            }
          }
        }
      }
      ctx.shadowBlur = 0;

      if (s.mouse.active) {
        const glow = ctx.createRadialGradient(
          s.mouse.x,
          s.mouse.y,
          0,
          s.mouse.x,
          s.mouse.y,
          150,
        );
        glow.addColorStop(
          0,
          `rgba(${ACCENT_R}, ${ACCENT_G}, ${ACCENT_B}, 0.1)`,
        );
        glow.addColorStop(
          0.6,
          `rgba(${ACCENT_R}, ${ACCENT_G}, ${ACCENT_B}, 0.01)`,
        );
        glow.addColorStop(
          1,
          `rgba(${ACCENT_R}, ${ACCENT_G}, ${ACCENT_B}, 0)`,
        );
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      s.animId = requestAnimationFrame(animate);
    };

    const id = requestAnimationFrame(animate);
    if (stateRef.current) stateRef.current.animId = id;

    return () => {
      if (stateRef.current) {
        cancelAnimationFrame(stateRef.current.animId);
      }
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("mouseleave", onLeave);
      canvas.removeEventListener("touchend", onLeave);
      window.removeEventListener("resize", onResize);
    };
  }, [init]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full cursor-crosshair"
    />
  );
}
