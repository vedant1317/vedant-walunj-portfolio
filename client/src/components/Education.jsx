import { motion } from "framer-motion";
import Section from "./Section.jsx";

export default function Education({ education, achievements }) {
  return (
    <>
      <style>{`
        .ed-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: var(--line); border: 1px solid var(--line); }
        @media (max-width: 820px) { .ed-grid { grid-template-columns: 1fr; } }
        .ed-col { background: var(--ink-2); padding: 38px 38px 42px; }
        .ed-col > h3 {
          font-family: var(--font-mono); font-size: 0.74rem; letter-spacing: 0.16em;
          text-transform: uppercase; color: var(--paper-dim); margin-bottom: 24px;
        }
        .ed-item { padding: 18px 0; border-top: 1px dashed var(--line); }
        .ed-item:first-of-type { border-top: none; padding-top: 0; }
        .ed-item h4 {
          font-variation-settings: "wdth" 80;
          font-size: 1.15rem; font-weight: 620; text-transform: uppercase;
        }
        .ed-item .deg { color: var(--paper-dim); font-size: 0.9rem; margin-top: 2px; }
        .ed-item .meta {
          display: flex; justify-content: space-between; margin-top: 8px;
          font-family: var(--font-mono); font-size: 0.74rem; letter-spacing: 0.08em;
        }
        .ed-item .meta .score { color: var(--acid); }
        .ed-item .meta .period { color: var(--paper-dim); }
        .aw-item {
          padding: 16px 0 16px 34px; position: relative;
          color: var(--paper-dim); font-size: 0.95rem;
          border-top: 1px dashed var(--line);
          transition: color 0.25s ease;
        }
        .aw-item:first-of-type { border-top: none; padding-top: 0; }
        .aw-item:first-of-type::before { top: 2px; }
        .aw-item:hover { color: var(--paper); }
        .aw-item::before {
          content: "✦"; position: absolute; left: 4px; top: 18px;
          color: var(--acid); font-size: 0.75rem;
        }
        .aw-item b { color: var(--paper); font-weight: 600; }
      `}</style>
      <Section
        id="education"
        num="05"
        label="Foundations"
        title={<>Study &amp; <span className="serif acid">honors</span></>}
      >
        <div className="ed-grid">
          <motion.div
            className="ed-col"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <h3>Education</h3>
            {education.map((e) => (
              <div className="ed-item" key={e.school}>
                <h4>{e.school}</h4>
                <p className="deg">{e.degree}</p>
                <div className="meta">
                  <span className="score">{e.score}</span>
                  <span className="period">{e.period}</span>
                </div>
              </div>
            ))}
          </motion.div>
          <motion.div
            className="ed-col"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: 0.12, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <h3>Achievements &amp; Certifications</h3>
            {achievements.map((a) => {
              const [head, ...rest] = a.split(" — ");
              return (
                <p className="aw-item" key={a}>
                  <b>{head}</b>
                  {rest.length > 0 && <> — {rest.join(" — ")}</>}
                </p>
              );
            })}
          </motion.div>
        </div>
      </Section>
    </>
  );
}
