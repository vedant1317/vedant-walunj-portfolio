import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";

// Free-draw canvas that captures strokes as normalized (0..1) point-paths.
// Exposes getStrokes()/clear()/isEmpty() to the parent via ref.
const MAX_STROKES = 60;

const SketchPad = forwardRef(function SketchPad({ color }, ref) {
  const canvasRef = useRef(null);
  const strokesRef = useRef([]); // [[[x,y],...], ...] normalized
  const drawing = useRef(false);
  const [empty, setEmpty] = useState(true);

  useImperativeHandle(ref, () => ({
    getStrokes: () => strokesRef.current,
    isEmpty: () => strokesRef.current.length === 0,
    clear: () => {
      strokesRef.current = [];
      setEmpty(true);
      const c = canvasRef.current;
      c?.getContext("2d").clearRect(0, 0, c.width, c.height);
    },
  }));

  // size the backing store to the displayed box (crisp on retina)
  useEffect(() => {
    const c = canvasRef.current;
    const fit = () => {
      const r = c.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      c.width = r.width * dpr;
      c.height = r.height * dpr;
      const ctx = c.getContext("2d");
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // redraw existing strokes after a resize
      ctx.clearRect(0, 0, r.width, r.height);
      ctx.lineWidth = 2.4;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      for (const path of strokesRef.current) {
        ctx.beginPath();
        path.forEach(([x, y], i) => (i ? ctx.lineTo(x * r.width, y * r.height) : ctx.moveTo(x * r.width, y * r.height)));
        ctx.stroke();
      }
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(c);
    return () => ro.disconnect();
  }, []);

  const pos = (e) => {
    const r = canvasRef.current.getBoundingClientRect();
    return [
      Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)),
      Math.min(1, Math.max(0, (e.clientY - r.top) / r.height)),
    ];
  };

  const start = (e) => {
    if (strokesRef.current.length >= MAX_STROKES) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drawing.current = true;
    strokesRef.current.push([pos(e)]);
    setEmpty(false);
  };

  const move = (e) => {
    if (!drawing.current) return;
    const r = canvasRef.current.getBoundingClientRect();
    const ctx = canvasRef.current.getContext("2d");
    const path = strokesRef.current[strokesRef.current.length - 1];
    const [px, py] = path[path.length - 1];
    const [x, y] = pos(e);
    path.push([x, y]);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.4;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(px * r.width, py * r.height);
    ctx.lineTo(x * r.width, y * r.height);
    ctx.stroke();
  };

  const end = () => {
    drawing.current = false;
  };

  return (
    <canvas
      ref={canvasRef}
      className="gb-canvas"
      role="img"
      aria-label="Drawing pad — use a pointer to sketch"
      data-empty={empty}
      onPointerDown={start}
      onPointerMove={move}
      onPointerUp={end}
      onPointerLeave={end}
    />
  );
});

export default SketchPad;
