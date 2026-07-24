import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import ThemeToggle from "./ThemeToggle.jsx";

const LINKS = ["experience", "work", "code", "skills", "contact"];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [time, setTime] = useState("");
  const cmdkLabel =
    typeof navigator !== "undefined" && /Mac|iPhone|iPad/i.test(navigator.platform || navigator.userAgent)
      ? "⌘K"
      : "Ctrl K";
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 26, mass: 0.4 });

  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
          timeZone: "Asia/Kolkata",
        })
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <style>{`
        .nb {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          background: color-mix(in srgb, var(--ink) 82%, transparent);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid var(--line);
        }
        .nb-inner {
          display: flex; align-items: center; justify-content: space-between;
          height: 58px;
        }
        .nb-logo { font-family: var(--font-mono); font-size: 0.85rem; letter-spacing: 0.06em; }
        .nb-logo b { color: var(--acid); font-weight: 500; }
        .nb-right { display: flex; align-items: center; gap: 28px; }
        .nb-links { display: flex; gap: 24px; list-style: none; }
        .nb-links a {
          font-family: var(--font-mono); font-size: 0.72rem;
          letter-spacing: 0.14em; text-transform: uppercase; color: var(--paper-dim);
          position: relative; padding: 4px 0;
          transition: color 0.25s ease;
        }
        .nb-links a:hover { color: var(--acid); }
        .nb-links a::after {
          content: ""; position: absolute; left: 0; right: 100%; bottom: 0; height: 1px;
          background: var(--acid); transition: right 0.3s ease;
        }
        .nb-links a:hover::after { right: 0; }
        .nb-clock {
          font-family: var(--font-mono); font-size: 0.72rem; color: var(--paper-dim);
          letter-spacing: 0.08em; font-variant-numeric: tabular-nums;
        }
        .nb-clock span { color: var(--acid); }
        .nb-cmdk {
          display: inline-flex; align-items: center;
          font-family: var(--font-mono); font-size: 0.66rem; letter-spacing: 0.08em;
          color: var(--paper-dim); background: transparent;
          border: 1px solid var(--line); padding: 5px 9px; cursor: pointer;
          transition: color 0.25s ease, border-color 0.25s ease;
        }
        .nb-cmdk:hover { color: var(--acid); border-color: var(--acid); }
        @media (max-width: 820px) { .nb-cmdk { display: none; } }
        .nb-burger { display: none; background: none; border: none; color: var(--paper); font-size: 1.3rem; cursor: pointer; }
        .nb-progress {
          position: absolute; left: 0; right: 0; bottom: -1px; height: 2px;
          background: var(--acid); transform-origin: 0%;
        }
        @media (max-width: 820px) {
          .nb-clock { display: none; }
          .nb-links {
            position: absolute; top: 58px; left: 0; right: 0;
            flex-direction: column; gap: 0;
            background: var(--ink); border-bottom: 1px solid var(--line);
            max-height: 0; overflow: hidden; transition: max-height 0.35s ease;
          }
          .nb-links.open { max-height: 340px; }
          .nb-links li { border-top: 1px solid var(--line); }
          .nb-links a { display: block; padding: 16px 20px; }
          .nb-burger { display: block; }
        }
      `}</style>
      <motion.nav
        className="nb"
        initial={{ y: -60 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="container nb-inner">
          <a className="nb-logo" href="#top">
            VW<b>©2026</b>
          </a>
          <div className="nb-right">
            <ul className={`nb-links ${open ? "open" : ""}`}>
              {LINKS.map((l) => (
                <li key={l}>
                  <a href={`#${l}`} onClick={() => setOpen(false)}>{l}</a>
                </li>
              ))}
            </ul>
            <button
              className="nb-cmdk"
              onClick={() => window.dispatchEvent(new Event("cmdk:open"))}
              aria-label="Open command palette"
            >
              {cmdkLabel}
            </button>
            <ThemeToggle />
            <span className="nb-clock">
              Mumbai <span>{time}</span> IST
            </span>
            <button className="nb-burger" onClick={() => setOpen(!open)} aria-label="Menu">
              {open ? "✕" : "≡"}
            </button>
          </div>
        </div>
        <motion.div className="nb-progress" style={{ scaleX }} />
      </motion.nav>
    </>
  );
}
