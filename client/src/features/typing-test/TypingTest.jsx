import { useMemo, useRef, useState } from "react";

const SENTENCE = "clean code, strong coffee, and one more commit before midnight";

// A tiny Monkeytype-style test: type the line, get your live WPM/accuracy, and
// see how you stack up against Vedant's personal best. Client-only.
export default function TypingTest({ pb = 79 }) {
  const [typed, setTyped] = useState("");
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const inputRef = useRef(null);
  const done = end != null;

  const onChange = (e) => {
    if (done) return;
    const v = e.target.value.slice(0, SENTENCE.length);
    if (start == null && v.length) setStart(performance.now());
    setTyped(v);
    if (v.length === SENTENCE.length) setEnd(performance.now());
  };

  const { wpm, acc } = useMemo(() => {
    if (start == null) return { wpm: 0, acc: 100 };
    const mins = ((end ?? performance.now()) - start) / 60000;
    let correct = 0;
    for (let i = 0; i < typed.length; i++) if (typed[i] === SENTENCE[i]) correct++;
    return {
      wpm: mins > 0 ? Math.round(correct / 5 / mins) : 0,
      acc: typed.length ? Math.round((correct / typed.length) * 100) : 100,
    };
  }, [typed, start, end]);

  const reset = () => {
    setTyped("");
    setStart(null);
    setEnd(null);
    inputRef.current?.focus();
  };

  return (
    <>
      <style>{`
        .tt-body { padding: 30px 32px; }
        .tt-surface {
          font-family: var(--font-mono); font-size: clamp(1rem, 2.4vw, 1.35rem);
          line-height: 1.9; letter-spacing: 0.02em; cursor: text; user-select: none;
          max-width: 760px;
        }
        .tt-c { color: var(--paper-dim); position: relative; }
        .tt-c.ok { color: var(--paper); }
        .tt-c.bad { color: #ff6b57; text-decoration: underline; }
        .tt-c.cur::before {
          content: ""; position: absolute; left: -1px; top: 0.1em; bottom: 0.1em; width: 2px;
          background: var(--acid); animation: ttcar 1s steps(1) infinite;
        }
        @keyframes ttcar { 50% { opacity: 0; } }
        .tt-input { position: absolute; opacity: 0; width: 1px; height: 1px; pointer-events: none; }
        .tt-foot {
          display: flex; align-items: center; gap: 26px; margin-top: 26px;
          font-family: var(--font-mono);
        }
        .tt-stat .n { font-size: 1.6rem; font-weight: 700; color: var(--paper); line-height: 1; }
        .tt-stat .l { font-size: 0.6rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--paper-dim); margin-top: 5px; }
        .tt-stat .n em { font-style: normal; color: var(--acid); }
        .tt-verdict { font-size: 0.82rem; color: var(--acid); margin-left: auto; }
        .tt-reset {
          margin-left: auto; background: none; border: 1px solid var(--line-strong); color: var(--paper);
          font-family: var(--font-mono); font-size: 0.68rem; letter-spacing: 0.12em; text-transform: uppercase;
          padding: 9px 16px; cursor: pointer; transition: all 0.25s ease;
        }
        .tt-reset:hover { border-color: var(--acid); color: var(--acid); }
        .tt-verdict + .tt-reset { margin-left: 20px; }
      `}</style>
      <div className="ah-band">
        <div className="ah-head">
          <span>Typing test — think you're faster?</span>
          <span>click &amp; type · my PB is {pb}</span>
        </div>
        <div className="tt-body">
          <div className="tt-surface" onClick={() => inputRef.current?.focus()}>
            {[...SENTENCE].map((ch, i) => {
              let cls = "tt-c pending";
              if (i < typed.length) cls = "tt-c " + (typed[i] === ch ? "ok" : "bad");
              if (i === typed.length && !done) cls = "tt-c cur";
              return (
                <span key={i} className={cls}>
                  {ch}
                </span>
              );
            })}
          </div>
          <input
            ref={inputRef}
            className="tt-input"
            value={typed}
            onChange={onChange}
            aria-label="Typing test — type the sentence above"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck="false"
          />
          <div className="tt-foot">
            <div className="tt-stat">
              <div className="n">{wpm}<em> wpm</em></div>
              <div className="l">your speed</div>
            </div>
            <div className="tt-stat">
              <div className="n">{acc}%</div>
              <div className="l">accuracy</div>
            </div>
            {done && (
              <span className="tt-verdict" aria-live="polite">
                {wpm >= pb ? `🔥 you beat me by ${wpm - pb}!` : `${pb - wpm} wpm off my pace — respectable.`}
              </span>
            )}
            <button type="button" className="tt-reset" onClick={reset}>
              {done ? "Try again" : "Reset"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
