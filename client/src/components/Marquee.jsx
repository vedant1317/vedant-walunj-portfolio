import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

// Scroll-velocity-aware divider strip.
export default function Marquee({ items }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll();
  const x = useSpring(useTransform(scrollYProgress, [0, 1], [0, -900]), {
    stiffness: 60,
    damping: 20,
  });

  const strip = [...items, ...items, ...items, ...items];

  return (
    <>
      <style>{`
        .mq { border-top: 1px solid var(--line-strong); border-bottom: 1px solid var(--line-strong);
          padding: 18px 0; overflow: hidden; white-space: nowrap; }
        .mq-track { display: inline-flex; gap: 0; will-change: transform; }
        .mq-item {
          font-variation-settings: "wdth" 72;
          font-size: clamp(1.4rem, 3.4vw, 2.4rem); font-weight: 620;
          text-transform: uppercase; letter-spacing: -0.01em;
          padding: 0 28px; display: inline-flex; align-items: center; gap: 56px;
        }
        .mq-item::after { content: "✦"; color: var(--acid); font-size: 0.7em; }
        .mq-item:nth-child(even) { font-family: var(--font-serif); font-style: italic; font-weight: 400; text-transform: none; color: var(--paper-dim); }
      `}</style>
      <div className="mq" ref={ref}>
        <motion.div className="mq-track" style={{ x }}>
          {strip.map((s, i) => (
            <span className="mq-item" key={i}>{s}</span>
          ))}
        </motion.div>
      </div>
    </>
  );
}
