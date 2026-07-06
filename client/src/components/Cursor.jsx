import { useEffect, useRef } from "react";

// Minimal cursor: crosshair dot + label that appears over interactive elements.
export default function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    let mx = -100, my = -100, rx = -100, ry = -100, raf;

    const onMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      const hit = e.target.closest("a, button, input, textarea, [data-hover]");
      ring.classList.toggle("cur-ring--on", !!hit);
    };

    const loop = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      dot.style.transform = `translate(${mx}px, ${my}px)`;
      ring.style.transform = `translate(${rx}px, ${ry}px)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <style>{`
        @media (pointer: fine) {
          .cur-dot {
            position: fixed; top: -3px; left: -3px; width: 6px; height: 6px;
            background: var(--acid); border-radius: 50%;
            pointer-events: none; z-index: 9999; mix-blend-mode: difference;
          }
          .cur-ring {
            position: fixed; top: -18px; left: -18px; width: 36px; height: 36px;
            border: 1px solid rgba(216, 246, 81, 0.55);
            pointer-events: none; z-index: 9998;
            transition: width 0.3s, height 0.3s, top 0.3s, left 0.3s, border-radius 0.3s, background 0.3s, transform 0.05s linear;
            border-radius: 50%;
          }
          .cur-ring--on {
            width: 56px; height: 56px; top: -28px; left: -28px;
            border-radius: 0; background: rgba(216, 246, 81, 0.08);
          }
        }
        @media (pointer: coarse) { .cur-dot, .cur-ring { display: none; } }
      `}</style>
      <div ref={dotRef} className="cur-dot" />
      <div ref={ringRef} className="cur-ring" />
    </>
  );
}
