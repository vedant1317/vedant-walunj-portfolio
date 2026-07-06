import { useRef } from "react";

// Wraps a child so it magnetically follows the cursor while hovered.
export default function Magnetic({ children, strength = 0.35 }) {
  const ref = useRef(null);

  const onMove = (e) => {
    const el = ref.current;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
  };

  const onLeave = () => {
    ref.current.style.transform = "translate(0, 0)";
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ display: "inline-block", transition: "transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)" }}
    >
      {children}
    </div>
  );
}
