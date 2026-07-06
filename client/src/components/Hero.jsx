import { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import Magnetic from "./Magnetic.jsx";
import { GitHubIcon, LinkedInIcon, LeetCodeIcon, MailIcon } from "./icons.jsx";

// Staggered letter reveal for the display name.
function SplitReveal({ text, delay = 0 }) {
  return (
    <span style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom" }}>
      {text.split("").map((ch, i) => (
        <motion.span
          key={i}
          style={{ display: "inline-block", whiteSpace: "pre" }}
          initial={{ y: "110%", rotate: 6 }}
          animate={{ y: "0%", rotate: 0 }}
          transition={{ delay: delay + i * 0.035, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          {ch}
        </motion.span>
      ))}
    </span>
  );
}

// Flipping serif word — replaces the typewriter.
function WordFlip({ words }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % words.length), 2400);
    return () => clearInterval(id);
  }, [words]);
  return (
    <span style={{ display: "inline-grid", overflow: "hidden", verticalAlign: "bottom" }}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={words[i]}
          className="serif acid"
          style={{ gridArea: "1 / 1", whiteSpace: "nowrap" }}
          initial={{ y: "105%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-105%", opacity: 0 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        >
          {words[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default function Hero({ profile }) {
  const { scrollY } = useScroll();
  const yTitle = useTransform(scrollY, [0, 600], [0, -80]);
  const yMeta = useTransform(scrollY, [0, 600], [0, -30]);
  const first = profile.name.split(" ")[0].toUpperCase();
  const last = profile.name.split(" ")[1].toUpperCase();

  return (
    <>
      <style>{`
        .hero {
          min-height: 100svh; display: flex; flex-direction: column; justify-content: flex-end;
          padding: 120px 0 0; position: relative;
        }
        .hero .container { width: 100%; }
        .hero-top {
          display: flex; justify-content: space-between; align-items: flex-start;
          padding-bottom: 40px;
        }
        .hero-avail {
          font-family: var(--font-mono); font-size: 0.72rem; letter-spacing: 0.14em;
          text-transform: uppercase; color: var(--paper-dim);
          display: flex; align-items: center; gap: 10px;
        }
        .hero-avail .dot {
          width: 7px; height: 7px; border-radius: 50%; background: var(--acid);
          animation: throb 2s ease-in-out infinite;
        }
        @keyframes throb { 50% { opacity: 0.25; } }
        .hero-role-line {
          font-size: clamp(1.15rem, 2.6vw, 1.7rem);
          font-weight: 460; line-height: 1.35;
          max-width: 560px;
        }
        .hero-name {
          font-weight: 720;
          font-variation-settings: "wdth" 68;
          font-size: clamp(4rem, 14.5vw, 12.5rem);
          line-height: 0.86; letter-spacing: -0.025em;
          text-transform: uppercase;
          border-bottom: 1px solid var(--line-strong);
          padding-bottom: 8px;
        }
        .hero-name .row2 { display: flex; align-items: baseline; justify-content: space-between; gap: 24px; }
        .hero-name .row2 .socials-inline { display: flex; gap: 2px; padding-bottom: clamp(8px, 2vw, 30px); }
        .socials-inline a {
          display: inline-flex; align-items: center; justify-content: center;
          width: 46px; height: 46px; color: var(--paper-dim);
          border: 1px solid transparent;
          transition: all 0.25s ease;
        }
        .socials-inline a:hover { color: var(--ink); background: var(--acid); }
        .hero-foot {
          display: flex; justify-content: space-between; align-items: center;
          padding: 22px 0 26px;
          font-family: var(--font-mono); font-size: 0.72rem;
          letter-spacing: 0.12em; text-transform: uppercase; color: var(--paper-dim);
        }
        .hero-foot .cta-row { display: flex; gap: 14px; }
        @media (max-width: 820px) {
          .hero-top { flex-direction: column; gap: 26px; }
          .hero-foot { flex-direction: column; gap: 20px; align-items: flex-start; }
          .hero-name .row2 .socials-inline { display: none; }
        }
      `}</style>
      <header className="hero" id="top">
        <div className="container">
          <motion.div className="hero-top" style={{ y: yMeta }}>
            <motion.p
              className="hero-avail"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.8 }}
            >
              <span className="dot" /> Open to opportunities — Mumbai / Remote
            </motion.p>
            <motion.p
              className="hero-role-line"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              Software engineer at the intersection of{" "}
              <WordFlip words={profile.roles} /> — currently Technical Intern @ ARCON,
              B.Tech IT @ KJ Somaiya (9.55 CGPA).
            </motion.p>
          </motion.div>
        </div>
        <motion.div className="container" style={{ y: yTitle }}>
          <h1 className="hero-name">
            <SplitReveal text={first} delay={0.15} />
            <div className="row2">
              <SplitReveal text={last} delay={0.45} />
              <motion.div
                className="socials-inline"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3, duration: 0.7 }}
              >
                <a href={profile.links.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub"><GitHubIcon /></a>
                <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><LinkedInIcon /></a>
                <a href={profile.links.leetcode} target="_blank" rel="noopener noreferrer" aria-label="LeetCode"><LeetCodeIcon /></a>
                <a href={`mailto:${profile.email}`} aria-label="Email"><MailIcon /></a>
              </motion.div>
            </div>
          </h1>
        </motion.div>
        <div className="container">
          <motion.div
            className="hero-foot"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
          >
            <span>Scroll ↓</span>
            <div className="cta-row">
              <Magnetic><a className="btn btn-solid" href="#contact">Get in touch</a></Magnetic>
              <Magnetic><a className="btn" href="#work">Selected work</a></Magnetic>
            </div>
          </motion.div>
        </div>
      </header>
    </>
  );
}
