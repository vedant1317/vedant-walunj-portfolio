import { useTheme } from "../lib/theme.jsx";

// A tiny row of accent swatches — the designer's colour story, one click each.
export default function ThemeToggle() {
  const { theme, setTheme, themes } = useTheme();
  return (
    <>
      <style>{`
        .tt { display: flex; align-items: center; gap: 8px; }
        .tt-sw {
          width: 13px; height: 13px; border-radius: 50%; padding: 0; cursor: pointer;
          background: var(--sw); border: 1px solid var(--line-strong);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .tt-sw:hover { transform: scale(1.18); }
        .tt-sw:focus-visible { outline: none; box-shadow: 0 0 0 2px var(--ink), 0 0 0 3px var(--sw); }
        .tt-sw[aria-pressed="true"] { box-shadow: 0 0 0 2px var(--ink), 0 0 0 3px var(--sw); }
      `}</style>
      <div className="tt" role="group" aria-label="Colour theme">
        {themes.map((t) => (
          <button
            key={t.id}
            type="button"
            className="tt-sw"
            style={{ "--sw": t.swatch }}
            aria-label={`${t.name} theme`}
            aria-pressed={theme === t.id}
            onClick={() => setTheme(t.id)}
          />
        ))}
      </div>
    </>
  );
}
