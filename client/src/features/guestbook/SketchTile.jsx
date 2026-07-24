// Renders a stored sketch (normalized strokes) as a crisp SVG tile.
export default function SketchTile({ sketch }) {
  const { name, color, strokes } = sketch;
  return (
    <figure className="gb-tile">
      <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" role="img"
           aria-label={name ? `Sketch by ${name}` : "Visitor sketch"}>
        {(strokes || []).map((path, i) => (
          <polyline
            key={i}
            points={path.map(([x, y]) => `${x * 100},${y * 100}`).join(" ")}
            fill="none"
            stroke={color || "var(--acid)"}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
      </svg>
      <figcaption className="gb-tile-name">{name || "anon"}</figcaption>
    </figure>
  );
}
