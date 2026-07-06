import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Section from "./Section.jsx";

// Editorial index rows that expand on hover/tap, plus a live GitHub repo strip.
function ProjectRow({ project, index, open, onToggle }) {
  return (
    <div className={`pr-row ${open ? "pr-row--open" : ""}`} onMouseEnter={onToggle} onClick={onToggle}>
      <div className="pr-line">
        <span className="pr-idx">{String(index + 1).padStart(2, "0")}</span>
        <h3 className="pr-name">{project.name}</h3>
        <span className="pr-tagline serif">{project.tagline}</span>
        <span className="pr-plus">{open ? "−" : "+"}</span>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="pr-body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="pr-body-grid">
              <p className="pr-desc">{project.description}</p>
              <div className="pr-side">
                <div className="pr-stack">
                  {project.stack.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
                <a
                  className="pr-link"
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  View on GitHub ↗
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Projects({ projects, github }) {
  const [open, setOpen] = useState(0);
  const featuredNames = new Set(["nerve", "pathfinder", "pitlane"]);
  const moreRepos = (github?.repos || []).filter(
    (r) => !featuredNames.has(r.name.toLowerCase()) && r.name.toLowerCase() !== "vedant1317"
  );

  return (
    <>
      <style>{`
        .pr-row { border-top: 1px solid var(--line); cursor: pointer; }
        .pr-row:last-of-type { border-bottom: 1px solid var(--line); }
        .pr-line {
          display: grid; grid-template-columns: 70px 1fr auto 40px;
          align-items: baseline; gap: 20px; padding: 30px 0;
          transition: padding 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .pr-row--open .pr-line { padding-bottom: 14px; }
        .pr-idx { font-family: var(--font-mono); font-size: 0.8rem; color: var(--paper-dim); }
        .pr-name {
          font-variation-settings: "wdth" 70;
          font-size: clamp(2rem, 5vw, 3.4rem); font-weight: 700;
          text-transform: uppercase; letter-spacing: -0.02em; line-height: 1;
          transition: color 0.3s ease, transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .pr-row:hover .pr-name, .pr-row--open .pr-name { color: var(--acid); transform: translateX(12px); }
        .pr-tagline { font-size: 1.1rem; color: var(--paper-dim); }
        .pr-plus { font-size: 1.4rem; color: var(--acid); text-align: right; font-weight: 300; }
        .pr-body { overflow: hidden; }
        .pr-body-grid {
          display: grid; grid-template-columns: 2fr 1fr; gap: 40px;
          padding: 6px 0 36px 90px;
        }
        @media (max-width: 760px) {
          .pr-line { grid-template-columns: 40px 1fr 30px; }
          .pr-tagline { display: none; }
          .pr-body-grid { grid-template-columns: 1fr; padding-left: 0; gap: 22px; }
        }
        .pr-desc { color: var(--paper-dim); font-size: 1rem; max-width: 560px; }
        .pr-stack { display: flex; flex-wrap: wrap; gap: 8px; }
        .pr-stack span {
          font-family: var(--font-mono); font-size: 0.7rem; letter-spacing: 0.06em;
          border: 1px solid var(--line-strong); padding: 5px 12px;
          color: var(--paper-dim); text-transform: uppercase;
        }
        .pr-link {
          display: inline-block; margin-top: 18px;
          font-family: var(--font-mono); font-size: 0.75rem; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--acid);
          border-bottom: 1px solid transparent; transition: border-color 0.25s ease;
        }
        .pr-link:hover { border-color: var(--acid); }
        /* more-from-github strip */
        .gh-more { margin-top: 64px; }
        .gh-more-head {
          font-family: var(--font-mono); font-size: 0.72rem; letter-spacing: 0.16em;
          text-transform: uppercase; color: var(--paper-dim); margin-bottom: 18px;
          display: flex; justify-content: space-between; align-items: baseline;
        }
        .gh-more-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: var(--line); border: 1px solid var(--line); }
        @media (max-width: 860px) { .gh-more-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 560px) { .gh-more-grid { grid-template-columns: 1fr; } }
        .gh-repo {
          background: var(--ink); padding: 22px 22px 26px; display: block;
          transition: background 0.3s ease;
        }
        .gh-repo:hover { background: var(--ink-3); }
        .gh-repo .rn {
          font-family: var(--font-mono); font-size: 0.88rem; color: var(--paper);
          display: flex; justify-content: space-between; gap: 10px;
        }
        .gh-repo .rn::after { content: "↗"; color: var(--acid); }
        .gh-repo .rd { font-size: 0.82rem; color: var(--paper-dim); margin-top: 8px; min-height: 2.4em; }
        .gh-repo .rl {
          font-family: var(--font-mono); font-size: 0.68rem; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--acid); margin-top: 12px; display: block;
        }
      `}</style>
      <Section
        id="work"
        num="02"
        label="Selected work"
        title={<>Things I've <span className="serif acid">built</span></>}
      >
        <div>
          {projects.map((p, i) => (
            <ProjectRow
              key={p.name}
              project={p}
              index={i}
              open={open === i}
              onToggle={() => setOpen(i)}
            />
          ))}
        </div>
        <motion.div
          className="gh-more"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="gh-more-head">
            <span>More from GitHub — fetched live</span>
            <span>{github?.publicRepos ?? "—"} public repos</span>
          </div>
          <div className="gh-more-grid">
            {moreRepos.slice(0, 6).map((r) => (
              <a className="gh-repo" key={r.name} href={r.url} target="_blank" rel="noopener noreferrer">
                <span className="rn">{r.name}</span>
                <p className="rd">{r.description || "No description yet — the code speaks for itself."}</p>
                <span className="rl">{r.language || "—"}</span>
              </a>
            ))}
          </div>
        </motion.div>
      </Section>
    </>
  );
}
