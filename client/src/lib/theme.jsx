import { createContext, useCallback, useContext, useState } from "react";

// Curated accent palettes. Each swaps --acid / --acid-dim via a data-theme
// attribute on <html>; the CSS lives in index.css. Dark base stays constant.
export const THEMES = [
  { id: "acid", name: "Acid", swatch: "#d8f651" },
  { id: "coral", name: "Coral", swatch: "#d97757" },
  { id: "azure", name: "Azure", swatch: "#7cc4ff" },
  { id: "amber", name: "Amber", swatch: "#e9b949" },
];

const KEY = "vw-theme";
const DEFAULT = "acid";

const read = () => {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
};
const write = (id) => {
  try {
    localStorage.setItem(KEY, id);
  } catch {
    /* private mode — ignore */
  }
};
const isValid = (id) => THEMES.some((t) => t.id === id);

// Apply the stored theme before React renders, so there's no flash of default.
export function initTheme() {
  const id = read();
  const chosen = isValid(id) ? id : DEFAULT;
  document.documentElement.setAttribute("data-theme", chosen);
  return chosen;
}

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    const id = read();
    return isValid(id) ? id : DEFAULT;
  });

  const setTheme = useCallback((id) => {
    if (!isValid(id)) return;
    document.documentElement.setAttribute("data-theme", id);
    write(id);
    setThemeState(id);
  }, []);

  const cycleTheme = useCallback(() => {
    setThemeState((cur) => {
      const next = THEMES[(THEMES.findIndex((t) => t.id === cur) + 1) % THEMES.length].id;
      document.documentElement.setAttribute("data-theme", next);
      write(next);
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, cycleTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within <ThemeProvider>");
  return ctx;
}
