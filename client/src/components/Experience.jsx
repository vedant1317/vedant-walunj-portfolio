import { motion } from "framer-motion";
import Section from "./Section.jsx";

export default function Experience({ items }) {
  return (
    <>
      <style>{`
        .xp-row {
          display: grid; grid-template-columns: 1fr 2fr; gap: 40px;
          padding: 44px 0; border-top: 1px solid var(--line);
        }
        .xp-row:last-child { border-bottom: 1px solid var(--line); }
        @media (max-width: 760px) { .xp-row { grid-template-columns: 1fr; gap: 18px; } }
        .xp-left .role {
          font-variation-settings: "wdth" 78;
          font-size: 1.5rem; font-weight: 650; text-transform: uppercase; letter-spacing: -0.01em;
          line-height: 1.15;
        }
        .xp-left .org { font-family: var(--font-serif); font-style: italic; font-size: 1.25rem; color: var(--acid); margin-top: 4px; }
        .xp-left .period {
          font-family: var(--font-mono); font-size: 0.72rem; color: var(--paper-dim);
          letter-spacing: 0.12em; text-transform: uppercase; margin-top: 14px;
        }
        .xp-points { list-style: none; }
        .xp-points li {
          position: relative; padding: 13px 0 13px 34px;
          color: var(--paper-dim); font-size: 0.98rem;
          border-bottom: 1px dashed var(--line);
          transition: color 0.25s ease, padding-left 0.25s ease;
        }
        .xp-points li:last-child { border-bottom: none; }
        .xp-points li::before {
          content: "→"; position: absolute; left: 4px; color: var(--acid);
          transition: transform 0.25s ease;
        }
        .xp-points li:hover { color: var(--paper); padding-left: 42px; }
        .xp-points li:hover::before { transform: translateX(6px); }
      `}</style>
      <Section
        id="experience"
        num="01"
        label="Career"
        title={<>Where I've <span className="serif acid">worked</span></>}
      >
        <div>
          {items.map((xp, i) => (
            <motion.div
              key={xp.role + xp.org}
              className="xp-row"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.1, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="xp-left">
                <h3 className="role">{xp.role}</h3>
                <p className="org">{xp.org}</p>
                <p className="period">{xp.period}</p>
              </div>
              <ul className="xp-points">
                {xp.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </Section>
    </>
  );
}
