import { useEffect, useState } from "react";
import { motion } from "framer-motion";

function Counter({ go, value, decimals = 0, suffix = "" }) {
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!go) return;
    const duration = 1500;
    const start = performance.now();
    let raf;
    const step = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 4);
      setDisplay((value * eased).toFixed(decimals));
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [go, value, decimals]);

  return (
    <span>
      {display}
      {suffix}
    </span>
  );
}

function Cell({ stat, index }) {
  const [go, setGo] = useState(false);

  return (
    <motion.div
      className="ledger-cell"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      onViewportEnter={() => setGo(true)}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="ledger-num">
        <Counter go={go} value={stat.value} decimals={stat.decimals} suffix={stat.suffix} />
      </div>
      <div className="ledger-label">{stat.label}</div>
      <p className="ledger-ctx">{stat.context}</p>
    </motion.div>
  );
}

// Ledger-style figures: big number, precise label, one line of context each.
export default function Stats({ stats }) {
  return (
    <>
      <style>{`
        .ledger { border-bottom: 1px solid var(--line-strong); }
        .ledger-grid { display: grid; grid-template-columns: repeat(4, 1fr); }
        @media (max-width: 980px) { .ledger-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 560px) { .ledger-grid { grid-template-columns: 1fr; } }
        .ledger-cell {
          padding: 44px 32px 40px;
          border-left: 1px solid var(--line);
          position: relative; overflow: hidden;
        }
        .ledger-cell:first-child { border-left: none; }
        @media (max-width: 980px) { .ledger-cell { border-top: 1px solid var(--line); } }
        .ledger-cell::before {
          content: ""; position: absolute; inset: 0; background: var(--acid);
          transform: translateY(101%); transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .ledger-cell:hover::before { transform: translateY(0); }
        .ledger-cell > * { position: relative; transition: color 0.3s ease; }
        .ledger-cell:hover > * { color: var(--ink); }
        .ledger-num {
          font-variation-settings: "wdth" 68;
          font-size: clamp(3rem, 6vw, 4.6rem); font-weight: 700; line-height: 1;
          letter-spacing: -0.03em;
          font-variant-numeric: tabular-nums;
        }
        .ledger-label {
          font-family: var(--font-mono); font-size: 0.74rem;
          letter-spacing: 0.12em; text-transform: uppercase;
          margin-top: 14px; color: var(--paper);
        }
        .ledger-ctx { font-size: 0.85rem; color: var(--paper-dim); margin-top: 8px; line-height: 1.5; }
        .ledger-cell:hover .ledger-ctx { color: rgba(16, 17, 19, 0.75); }
      `}</style>
      <div className="ledger">
        <div className="ledger-grid">
          {stats.map((s, i) => (
            <Cell key={s.label} stat={s} index={i} />
          ))}
        </div>
      </div>
    </>
  );
}
