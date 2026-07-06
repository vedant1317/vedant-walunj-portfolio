import { motion } from "framer-motion";
import Section from "./Section.jsx";

// Live LeetCode + GitHub figures — fetched through the Express proxy.
export default function CodeStats({ leetcode, github, links }) {
  const bars = [
    { label: "Easy", count: leetcode.easy, max: Math.max(leetcode.easy, leetcode.medium, leetcode.hard, 1) },
    { label: "Medium", count: leetcode.medium, max: Math.max(leetcode.easy, leetcode.medium, leetcode.hard, 1) },
    { label: "Hard", count: leetcode.hard, max: Math.max(leetcode.easy, leetcode.medium, leetcode.hard, 1) },
  ];

  return (
    <>
      <style>{`
        .cs-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: var(--line); border: 1px solid var(--line); }
        @media (max-width: 820px) { .cs-grid { grid-template-columns: 1fr; } }
        .cs-cell { background: var(--ink-2); padding: 40px; }
        .cs-cell h3 {
          font-family: var(--font-mono); font-size: 0.74rem; letter-spacing: 0.16em;
          text-transform: uppercase; color: var(--paper-dim); margin-bottom: 28px;
          display: flex; justify-content: space-between;
        }
        .cs-cell h3 a { color: var(--acid); }
        .cs-cell h3 a:hover { text-decoration: underline; }
        .cs-big {
          font-variation-settings: "wdth" 68;
          font-size: clamp(3.4rem, 7vw, 5.4rem); font-weight: 700; line-height: 1;
          letter-spacing: -0.03em;
        }
        .cs-big .serif { color: var(--paper-dim); font-size: 0.5em; margin-left: 12px; }
        .cs-bars { margin-top: 30px; display: flex; flex-direction: column; gap: 16px; }
        .cs-bar-row { display: grid; grid-template-columns: 70px 1fr 40px; align-items: center; gap: 16px; }
        .cs-bar-row .bl { font-family: var(--font-mono); font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--paper-dim); }
        .cs-bar-row .bc { font-family: var(--font-mono); font-size: 0.78rem; text-align: right; font-variant-numeric: tabular-nums; }
        .cs-track { height: 8px; background: var(--ink); border: 1px solid var(--line); position: relative; overflow: hidden; }
        .cs-fill { position: absolute; inset: 0; right: auto; background: var(--acid); }
        .cs-langrow { margin-top: 30px; display: flex; flex-wrap: wrap; gap: 8px; }
        .cs-langrow span {
          font-family: var(--font-mono); font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.08em;
          border: 1px solid var(--line-strong); padding: 5px 12px; color: var(--paper-dim);
        }
        .cs-note { font-size: 0.82rem; color: var(--paper-dim); margin-top: 22px; }
      `}</style>
      <Section
        id="code"
        num="03"
        label="Live from the APIs"
        title={<>Proof of <span className="serif acid">practice</span></>}
      >
        <div className="cs-grid">
          <motion.div
            className="cs-cell"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <h3>
              LeetCode — DSA reps
              <a href={links.leetcode} target="_blank" rel="noopener noreferrer">@vedantvw ↗</a>
            </h3>
            <div className="cs-big">
              {leetcode.total}
              <span className="serif">problems solved</span>
            </div>
            <div className="cs-bars">
              {bars.map((b, i) => (
                <div className="cs-bar-row" key={b.label}>
                  <span className="bl">{b.label}</span>
                  <div className="cs-track">
                    <motion.div
                      className="cs-fill"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(b.count / b.max) * 100}%` }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.15, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                  <span className="bc">{b.count}</span>
                </div>
              ))}
            </div>
            <p className="cs-note">Numbers pulled live from LeetCode's GraphQL API via the Express backend.</p>
          </motion.div>
          <motion.div
            className="cs-cell"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: 0.12, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <h3>
              GitHub — shipping log
              <a href={links.github} target="_blank" rel="noopener noreferrer">@vedant1317 ↗</a>
            </h3>
            <div className="cs-big">
              {github.publicRepos}
              <span className="serif">public repos</span>
            </div>
            <div className="cs-langrow">
              {[...new Set((github.repos || []).map((r) => r.language).filter(Boolean))].map((l) => (
                <span key={l}>{l}</span>
              ))}
            </div>
            <p className="cs-note">
              Python, TypeScript and JavaScript across AI, security and database tooling — refreshed
              hourly from the GitHub API.
            </p>
          </motion.div>
        </div>
      </Section>
    </>
  );
}
