// anime.js v3 default-export interop is inconsistent across bundlers — under
// Vite's dep pre-bundle the default can arrive wrapped. Resolve it once here so
// every caller gets the callable `anime` function.
import animeImport from "animejs";

const anime = typeof animeImport === "function" ? animeImport : animeImport?.default;

export default anime;
