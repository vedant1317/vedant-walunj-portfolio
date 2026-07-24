import { useRef, useState } from "react";
import Section from "../../components/Section.jsx";
import SketchPad from "./SketchPad.jsx";
import SketchTile from "./SketchTile.jsx";
import { useGuestbook } from "./useGuestbook.js";

const COLORS = ["#d8f651", "#ece8df", "#d97757", "#7cc4ff", "#e9b949"];

export default function Guestbook() {
  const { status, data, post, reload } = useGuestbook();
  const padRef = useRef(null);
  const [color, setColor] = useState(COLORS[0]);
  const [name, setName] = useState("");
  const [hp, setHp] = useState(""); // honeypot — bots fill it, humans never see it
  const [sending, setSending] = useState(false);
  const [note, setNote] = useState("");

  const sign = async () => {
    const strokes = padRef.current?.getStrokes() ?? [];
    if (strokes.length === 0) {
      setNote("draw something first ✍");
      return;
    }
    setSending(true);
    setNote("");
    try {
      await post({ name: name.trim(), color, strokes, hp });
      padRef.current.clear();
      setName("");
      setNote("signed — thanks for leaving your mark ✓");
      setTimeout(() => setNote(""), 4000);
    } catch {
      setNote("couldn't save — try again");
    } finally {
      setSending(false);
    }
  };

  const count = status === "success" ? data.length : 0;

  return (
    <>
      <style>{`
        .gb-pad { max-width: 460px; margin: 0 auto; padding: 20px; }
        .gb-pad-top {
          font-family: var(--font-mono); font-size: 0.66rem; letter-spacing: 0.14em;
          text-transform: uppercase; color: var(--paper-dim); margin-bottom: 14px;
          display: flex; justify-content: space-between;
        }
        .gb-canvas-wrap { position: relative; }
        .gb-canvas {
          width: 100%; aspect-ratio: 4 / 3; display: block;
          background: var(--ink-3); border: 1px solid var(--line);
          cursor: crosshair; touch-action: none; border-radius: 2px;
        }
        .gb-hint {
          position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
          pointer-events: none; color: var(--paper-dim); opacity: 0.5;
          font-family: var(--font-mono); font-size: 0.9rem; letter-spacing: 0.08em;
          transition: opacity 0.2s ease;
        }
        .gb-canvas[data-empty="false"] + .gb-hint { opacity: 0; }
        .gb-controls { margin-top: 16px; display: flex; flex-direction: column; gap: 14px; }
        .gb-colors { display: flex; gap: 9px; align-items: center; }
        .gb-colors .gb-colors-l { font-family: var(--font-mono); font-size: 0.6rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--paper-dim); margin-right: 4px; }
        .gb-sw {
          width: 20px; height: 20px; border-radius: 50%; padding: 0; cursor: pointer;
          background: var(--sw); border: 1px solid var(--line-strong);
          transition: transform 0.18s ease, box-shadow 0.18s ease;
        }
        .gb-sw:hover { transform: scale(1.15); }
        .gb-sw[aria-pressed="true"] { box-shadow: 0 0 0 2px var(--ink), 0 0 0 3px var(--sw); }
        .gb-row { display: flex; gap: 14px; align-items: flex-end; }
        .gb-namewrap { display: flex; flex-direction: column; gap: 5px; flex: 1; }
        .gb-namelabel { font-family: var(--font-mono); font-size: 0.6rem; letter-spacing: 0.16em; text-transform: uppercase; color: var(--paper-dim); }
        .gb-name {
          background: transparent; border: none; border-bottom: 1px solid var(--line);
          color: var(--paper); font-family: var(--font-display); font-size: 0.95rem; padding: 6px 0; outline: none; width: 100%;
        }
        .gb-name:focus { border-color: var(--acid); }
        .gb-hp { position: absolute; left: -9999px; width: 1px; height: 1px; opacity: 0; }
        .gb-actions { display: flex; gap: 10px; }
        .gb-actions .btn { padding: 12px 18px; font-size: 0.72rem; }
        .gb-note { font-family: var(--font-mono); font-size: 0.72rem; color: var(--acid); min-height: 1.1em; letter-spacing: 0.04em; }

        .gb-wall { margin-top: 56px; }
        .gb-wall-head {
          display: flex; justify-content: space-between; align-items: baseline;
          border-top: 1px solid var(--line-strong); padding-top: 18px; margin-bottom: 22px;
          font-family: var(--font-mono); font-size: 0.72rem; letter-spacing: 0.14em;
          text-transform: uppercase; color: var(--paper-dim);
        }
        .gb-tiles { display: grid; grid-template-columns: repeat(auto-fill, minmax(132px, 1fr)); gap: 14px; }
        .gb-tile { border: 1px solid var(--line); background: var(--ink-2); position: relative; }
        .gb-tile svg { width: 100%; aspect-ratio: 1; display: block; }
        .gb-tile-name {
          position: absolute; left: 0; right: 0; bottom: 0;
          font-family: var(--font-mono); font-size: 0.56rem; letter-spacing: 0.06em; color: var(--paper-dim);
          background: color-mix(in srgb, var(--ink) 70%, transparent); padding: 3px 6px;
          text-overflow: ellipsis; overflow: hidden; white-space: nowrap;
        }
        .gb-empty {
          border: 1px dashed var(--line-strong); padding: 54px 24px; text-align: center;
          font-family: var(--font-mono); font-size: 0.85rem; color: var(--paper-dim); letter-spacing: 0.04em;
        }
        .gb-retry { background: none; border: none; color: var(--acid); cursor: pointer; font: inherit; text-decoration: underline; }
      `}</style>
      <Section
        id="guestbook"
        num="07"
        label="Leave your mark"
        title={<>The <span className="serif acid">sketch wall</span></>}
      >
        {/* --- drawing pad --- */}
        <div className="gb-pad panel">
          <div className="gb-pad-top">
            <span>✎ Draw something</span>
            <span>then sign below</span>
          </div>
          <div className="gb-canvas-wrap">
            <SketchPad ref={padRef} color={color} />
            <div className="gb-hint">✎ draw here</div>
          </div>
          <div className="gb-controls">
            <div className="gb-colors" role="group" aria-label="Pen colour">
              <span className="gb-colors-l">Pen</span>
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className="gb-sw"
                  style={{ "--sw": c }}
                  aria-label={`Pen colour ${c}`}
                  aria-pressed={color === c}
                  onClick={() => setColor(c)}
                />
              ))}
            </div>
            <div className="gb-row">
              <label className="gb-namewrap">
                <span className="gb-namelabel">Name (optional)</span>
                <input
                  className="gb-name"
                  value={name}
                  maxLength={40}
                  placeholder="who's signing?"
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
              <div className="gb-actions">
                <button type="button" className="btn" onClick={() => padRef.current?.clear()}>
                  Clear
                </button>
                <button type="button" className="btn btn-solid" onClick={sign} disabled={sending}>
                  {sending ? "Signing…" : "Sign the wall →"}
                </button>
              </div>
            </div>
            <input
              className="gb-hp"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              value={hp}
              onChange={(e) => setHp(e.target.value)}
            />
            <p className="gb-note" aria-live="polite">{note}</p>
          </div>
        </div>

        {/* --- the wall --- */}
        <div className="gb-wall">
          <div className="gb-wall-head">
            <span>— the wall</span>
            <span>{count} {count === 1 ? "sketch" : "sketches"}</span>
          </div>
          {status === "loading" && <div className="gb-empty">loading the wall…</div>}
          {status === "error" && (
            <div className="gb-empty">
              couldn't load the wall — <button className="gb-retry" onClick={reload}>retry</button>
            </div>
          )}
          {status === "success" && data.length === 0 && (
            <div className="gb-empty">nobody's signed yet — be the first to leave a mark ✍</div>
          )}
          {status === "success" && data.length > 0 && (
            <div className="gb-tiles">
              {data.map((s, i) => (
                <SketchTile key={s.createdAt || i} sketch={s} />
              ))}
            </div>
          )}
        </div>
      </Section>
    </>
  );
}
