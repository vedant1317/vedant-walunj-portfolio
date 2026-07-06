import { motion } from "framer-motion";
import Section from "./Section.jsx";

// Ruled skill ledger — no chips, no glow. Type does the work.
export default function Skills({ skills }) {
  return (
    <>
      <style>{`
        .sk-row {
          display: grid; grid-template-columns: 1fr 2fr; gap: 40px;
          padding: 26px 0; border-top: 1px solid var(--line);
          align-items: baseline;
        }
        .sk-row:last-child { border-bottom: 1px solid var(--line); }
        @media (max-width: 720px) { .sk-row { grid-template-columns: 1fr; gap: 10px; } }
        .sk-cat {
          font-family: var(--font-mono); font-size: 0.74rem;
          letter-spacing: 0.16em; text-transform: uppercase; color: var(--paper-dim);
        }
        .sk-list { display: flex; flex-wrap: wrap; column-gap: 0; row-gap: 6px; }
        .sk-item {
          font-variation-settings: "wdth" 78;
          font-size: clamp(1.2rem, 2.6vw, 1.7rem); font-weight: 560;
          text-transform: uppercase; letter-spacing: -0.01em;
          transition: color 0.2s ease;
          cursor: default;
        }
        .sk-item:hover { color: var(--acid); }
        .sk-item:not(:last-child)::after {
          content: "·"; color: var(--acid); margin: 0 14px; font-weight: 400;
        }
      `}</style>
      <Section
        id="skills"
        num="04"
        label="Toolbox"
        title={<>What I <span className="serif acid">reach for</span></>}
      >
        <div>
          {Object.entries(skills).map(([cat, list], i) => (
            <motion.div
              key={cat}
              className="sk-row"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.06, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="sk-cat">{cat}</span>
              <div className="sk-list">
                {list.map((s) => (
                  <span key={s} className="sk-item" data-hover>{s}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </Section>
    </>
  );
}
