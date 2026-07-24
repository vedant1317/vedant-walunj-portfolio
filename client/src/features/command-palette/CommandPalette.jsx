import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "../../lib/theme.jsx";

// ⌘K / Ctrl-K / "/" opens a faux macOS Terminal: type a command to jump to
// sections, copy email, open profiles, or switch theme. Keyboard-first
// (arrows + Enter + Esc), focus trapped to the prompt.
export default function CommandPalette({ email, links }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef(null);
  const lastFocus = useRef(null);
  const { setTheme } = useTheme();
  const login = useMemo(() => new Date().toString().replace(/ GMT.*/, ""), []);

  const commands = useMemo(() => {
    const go = (id) => () => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      window.history.replaceState(null, "", `#${id}`);
    };
    const openUrl = (u) => () => window.open(u, "_blank", "noopener,noreferrer");
    return [
      { id: "exp", label: "cd ~/experience", hint: "section", run: go("experience") },
      { id: "work", label: "cd ~/projects", hint: "section", run: go("work") },
      { id: "code", label: "cd ~/code-stats", hint: "section", run: go("code") },
      { id: "after", label: "cd ~/after-hours", hint: "section", run: go("afterhours") },
      { id: "sketch", label: "cd ~/sketch-wall", hint: "section", run: go("guestbook") },
      { id: "contact", label: "cd ~/contact", hint: "section", run: go("contact") },
      { id: "email", label: "pbcopy < email", hint: email, run: () => navigator.clipboard?.writeText(email) },
      { id: "gh", label: "open github", hint: "↗", run: openUrl(links.github) },
      { id: "li", label: "open linkedin", hint: "↗", run: openUrl(links.linkedin) },
      { id: "lc", label: "open leetcode", hint: "↗", run: openUrl(links.leetcode) },
      { id: "t1", label: "theme acid", hint: "◍", run: () => setTheme("acid") },
      { id: "t2", label: "theme coral", hint: "◍", run: () => setTheme("coral") },
      { id: "t3", label: "theme azure", hint: "◍", run: () => setTheme("azure") },
      { id: "t4", label: "theme amber", hint: "◍", run: () => setTheme("amber") },
    ];
  }, [email, links, setTheme]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? commands.filter((c) => c.label.toLowerCase().includes(s)) : commands;
  }, [q, commands]);

  useEffect(() => {
    const onKey = (e) => {
      const typing = /^(input|textarea)$/i.test(e.target.tagName) || e.target.isContentEditable;
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "/" && !typing && !open) {
        e.preventDefault();
        setOpen(true);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // let the navbar chip (or anything) open the terminal
  useEffect(() => {
    const openIt = () => setOpen(true);
    window.addEventListener("cmdk:open", openIt);
    return () => window.removeEventListener("cmdk:open", openIt);
  }, []);

  useEffect(() => {
    if (open) {
      lastFocus.current = document.activeElement;
      setQ("");
      setActive(0);
      const t = setTimeout(() => inputRef.current?.focus(), 20);
      return () => clearTimeout(t);
    }
    lastFocus.current?.focus?.();
  }, [open]);
  useEffect(() => setActive(0), [q]);

  const run = (cmd) => {
    cmd.run();
    setOpen(false);
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[active]) run(filtered[active]);
    } else if (e.key === "Tab") {
      e.preventDefault();
    }
  };

  return (
    <>
      <style>{`
        .term-overlay {
          position: fixed; inset: 0; z-index: 300; display: flex; justify-content: center;
          align-items: flex-start; padding-top: 13vh;
          background: rgba(0, 0, 0, 0.5); backdrop-filter: blur(4px);
        }
        .term {
          width: min(620px, calc(100% - 28px)); border-radius: 10px; overflow: hidden;
          box-shadow: 0 30px 90px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.08);
          font-family: "SF Mono", "JetBrains Mono", ui-monospace, Menlo, monospace; font-size: 13px;
        }
        .term-bar {
          position: relative; height: 36px; background: #3a3a3c;
          display: flex; align-items: center; padding: 0 13px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.35);
        }
        .term-dot { width: 12px; height: 12px; border-radius: 50%; margin-right: 8px; }
        .term-dot.r { background: #ff5f56; } .term-dot.y { background: #ffbd2e; } .term-dot.g { background: #27c93f; }
        .term-title {
          position: absolute; left: 0; right: 0; text-align: center; pointer-events: none;
          color: #c9c9c9; font-size: 12px; font-weight: 500;
        }
        .term-body {
          background: #1e1e1e; color: #d8d8d8; padding: 14px 16px 20px;
          max-height: 56vh; overflow-y: auto; line-height: 1.75; cursor: text;
        }
        .term-login { color: #7a7a7a; margin-bottom: 8px; }
        .term-line { display: flex; align-items: center; flex-wrap: wrap; }
        .term-prompt { white-space: nowrap; }
        .term-prompt .u { color: #27c93f; }
        .term-prompt .p { color: #5ea9ff; }
        .term-prompt .pct { color: #d8d8d8; margin-left: 6px; }
        .term-inp { position: relative; display: inline-flex; align-items: center; margin-left: 8px; }
        .term-input {
          background: transparent; border: none; outline: none; color: #f4f4f4;
          font: inherit; caret-color: transparent; padding: 0; min-width: 2px;
        }
        .term-cursor {
          width: 7.5px; height: 15px; background: #d8d8d8; margin-left: 1px;
          animation: termcar 1.05s steps(1) infinite;
        }
        @keyframes termcar { 50% { opacity: 0; } }
        .term-out { margin-top: 8px; }
        .term-help { color: #6f6f6f; }
        .term-notfound { color: #ff6b57; }
        .term-cmd {
          display: flex; gap: 10px; align-items: center; padding: 2px 6px; margin: 0 -6px;
          cursor: pointer; color: #cfcfcf; border-radius: 3px;
        }
        .term-cmd .term-mark { width: 1ch; color: #27c93f; }
        .term-cmd.on { background: rgba(255, 255, 255, 0.08); color: #fff; }
        .term-cmd .term-hint { margin-left: auto; color: #6f6f6f; }
        .term-cmd.on .term-hint { color: #9a9a9a; }
      `}</style>
      <AnimatePresence>
        {open && (
          <motion.div
            className="term-overlay"
            onClick={() => setOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <motion.div
              className="term"
              role="dialog"
              aria-modal="true"
              aria-label="Terminal command palette"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={onKeyDown}
              initial={{ opacity: 0, y: -10, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.985 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="term-bar">
                <span className="term-dot r" />
                <span className="term-dot y" />
                <span className="term-dot g" />
                <span className="term-title">vedant — -zsh — 80×24</span>
              </div>
              <div className="term-body" onClick={() => inputRef.current?.focus()}>
                <div className="term-login">Last login: {login} on ttys001</div>
                <div className="term-line">
                  <span className="term-prompt">
                    <span className="u">vedant@walunj</span> <span className="p">~</span>
                    <span className="pct">%</span>
                  </span>
                  <span className="term-inp">
                    <input
                      ref={inputRef}
                      className="term-input"
                      value={q}
                      onChange={(e) => setQ(e.target.value)}
                      style={{ width: `${q.length || 0.5}ch` }}
                      aria-label="Command prompt"
                      autoComplete="off"
                      spellCheck="false"
                    />
                    <span className="term-cursor" />
                  </span>
                </div>
                <div className="term-out" role="listbox" aria-label="Commands">
                  {q.trim() === "" && (
                    <div className="term-help"># type to filter · ↑↓ move · ⏎ run · esc close</div>
                  )}
                  {q.trim() !== "" && filtered.length === 0 && (
                    <div className="term-notfound">zsh: command not found: {q}</div>
                  )}
                  {filtered.map((c, i) => (
                    <div
                      key={c.id}
                      role="option"
                      aria-selected={i === active}
                      className={`term-cmd ${i === active ? "on" : ""}`}
                      onMouseEnter={() => setActive(i)}
                      onClick={() => run(c)}
                    >
                      <span className="term-mark">{i === active ? "❯" : " "}</span>
                      <span className="term-lbl">{c.label}</span>
                      <span className="term-hint">{c.hint}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
