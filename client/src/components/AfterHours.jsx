import { motion } from "framer-motion";
import Section from "./Section.jsx";

// Spotify + Letterboxd — because commits aren't a personality.

const EASE = [0.16, 1, 0.3, 1];

function starsFor(rating) {
  if (rating == null) return "";
  return "★".repeat(Math.floor(rating)) + (rating % 1 !== 0 ? "½" : "");
}

// Spinning vinyl with acid label.
function Vinyl() {
  return (
    <div className="vinyl-wrap" aria-hidden="true">
      <div className="vinyl">
        <div className="vinyl-label">
          <span>VW·FM</span>
        </div>
      </div>
      <div className="vinyl-arm" />
    </div>
  );
}

// Tiny animated equalizer.
function Eq({ delay = 0 }) {
  return (
    <span className="eq" aria-hidden="true">
      {[0, 1, 2, 3].map((i) => (
        <span key={i} style={{ animationDelay: `${delay + i * 0.18}s` }} />
      ))}
    </span>
  );
}

export default function AfterHours({ spotify, letterboxd }) {
  const distribution = letterboxd.distribution ?? [];
  const maxCount = Math.max(...distribution.map((d) => d.count), 1);

  return (
    <>
      <style>{`
        .ah-band { border: 1px solid var(--line); background: var(--ink-2); margin-bottom: 24px; }
        .ah-head {
          display: flex; justify-content: space-between; gap: 12px; align-items: baseline;
          padding: 22px 32px; border-bottom: 1px solid var(--line);
          font-family: var(--font-mono); font-size: 0.74rem; letter-spacing: 0.16em;
          text-transform: uppercase; color: var(--paper-dim);
        }
        .ah-head a { color: var(--acid); white-space: nowrap; }
        .ah-head a:hover { text-decoration: underline; }

        /* ---------- letterboxd: poster wall ---------- */
        .lb-body { display: grid; grid-template-columns: 1.6fr 1fr; }
        @media (max-width: 900px) { .lb-body { grid-template-columns: 1fr; } }
        .lb-posters {
          display: grid; grid-template-columns: repeat(5, 1fr); gap: 14px;
          padding: 28px; border-right: 1px solid var(--line);
        }
        @media (max-width: 900px) { .lb-posters { border-right: none; border-bottom: 1px solid var(--line); } }
        @media (max-width: 600px) { .lb-posters { grid-template-columns: repeat(3, 1fr); } }
        .lb-film { position: relative; display: block; overflow: hidden; background: var(--ink-3); }
        .lb-film img {
          width: 100%; aspect-ratio: 2/3; object-fit: cover; display: block;
          filter: grayscale(65%) contrast(1.05);
          transition: filter 0.4s ease, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .lb-film:hover img { filter: grayscale(0%); transform: scale(1.06); }
        .lb-film .veil {
          position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: flex-end;
          padding: 10px; background: linear-gradient(180deg, transparent 40%, rgba(16, 17, 19, 0.92));
          opacity: 0; transition: opacity 0.35s ease;
        }
        .lb-film:hover .veil { opacity: 1; }
        .lb-film .veil .fname { font-size: 0.72rem; font-weight: 650; color: var(--paper); line-height: 1.25; text-transform: uppercase; }
        .lb-film .veil .fstars { font-size: 0.7rem; color: var(--acid); letter-spacing: 0.06em; margin-top: 2px; }
        .lb-film .corner {
          position: absolute; top: 0; right: 0;
          font-family: var(--font-mono); font-size: 0.62rem; padding: 3px 7px;
          background: var(--acid); color: var(--ink); font-weight: 600;
          transform: translateY(-101%); transition: transform 0.3s ease;
        }
        .lb-film:hover .corner { transform: translateY(0); }

        /* ---------- letterboxd: histogram + figures ---------- */
        .lb-side { padding: 28px 32px; display: flex; flex-direction: column; gap: 24px; }
        .lb-figures { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .lb-fig .n {
          font-variation-settings: "wdth" 68;
          font-size: clamp(1.7rem, 3vw, 2.4rem); font-weight: 700; line-height: 1;
          letter-spacing: -0.02em;
        }
        .lb-fig .n em { font-family: var(--font-serif); font-style: italic; font-weight: 400; color: var(--acid); }
        .lb-fig .l {
          font-family: var(--font-mono); font-size: 0.62rem; letter-spacing: 0.12em;
          text-transform: uppercase; color: var(--paper-dim); margin-top: 6px; line-height: 1.5;
        }
        .lb-histo { flex: 1; display: flex; align-items: flex-end; gap: 6px; min-height: 110px; }
        .lb-bar { flex: 1; display: flex; flex-direction: column; justify-content: flex-end; gap: 6px; height: 100%; }
        .lb-bar .bar {
          background: var(--ink-3); border: 1px solid var(--line);
          position: relative; overflow: hidden; width: 100%;
          transform-origin: bottom;
        }
        .lb-bar .bar i { position: absolute; inset: 0; background: var(--acid); display: block; }
        .lb-bar:hover .bar i { background: var(--paper); }
        .lb-bar .tick {
          font-family: var(--font-mono); font-size: 0.55rem; color: var(--paper-dim);
          text-align: center; white-space: nowrap; overflow: hidden;
        }
        .lb-histo-cap {
          font-family: var(--font-mono); font-size: 0.62rem; letter-spacing: 0.12em;
          text-transform: uppercase; color: var(--paper-dim);
          display: flex; justify-content: space-between;
        }

        /* ---------- spotify ---------- */
        .sp-body { display: grid; grid-template-columns: 240px 1.5fr 1fr; align-items: stretch; }
        @media (max-width: 900px) { .sp-body { grid-template-columns: 1fr; } }
        .vinyl-wrap {
          position: relative; display: flex; align-items: center; justify-content: center;
          padding: 28px; border-right: 1px solid var(--line); overflow: hidden;
        }
        @media (max-width: 900px) { .vinyl-wrap { border-right: none; border-bottom: 1px solid var(--line); } }
        .vinyl {
          width: 175px; height: 175px; border-radius: 50%;
          background:
            repeating-radial-gradient(circle at 50%, #17181b 0px, #17181b 2px, #202226 3px, #17181b 4px);
          border: 1px solid var(--line-strong);
          display: flex; align-items: center; justify-content: center;
          animation: spin 5s linear infinite;
          box-shadow: 0 0 0 6px rgba(216, 246, 81, 0.04);
        }
        .vinyl-label {
          width: 62px; height: 62px; border-radius: 50%; background: var(--acid);
          display: flex; align-items: center; justify-content: center;
          font-family: var(--font-mono); font-size: 0.6rem; font-weight: 600; color: var(--ink);
          letter-spacing: 0.1em;
          position: relative;
        }
        .vinyl-label::after {
          content: ""; width: 8px; height: 8px; border-radius: 50%;
          background: var(--ink-2); position: absolute;
        }
        .vinyl-label span { transform: translateY(-12px); }
        @keyframes spin { to { transform: rotate(360deg); } }
        .vinyl-arm {
          position: absolute; top: 14px; right: 22px; width: 3px; height: 92px;
          background: var(--paper-dim); transform-origin: top center; transform: rotate(-24deg);
          border-radius: 2px;
        }
        .vinyl-arm::before {
          content: ""; position: absolute; top: -7px; left: -5px; width: 13px; height: 13px;
          border-radius: 50%; background: var(--paper-dim);
        }
        .vinyl-arm::after {
          content: ""; position: absolute; bottom: -3px; left: -3px; width: 9px; height: 20px;
          background: var(--acid);
        }
        .sp-tracks { padding: 18px 32px; }
        .sp-track {
          display: flex; align-items: center; gap: 16px;
          padding: 13px 0; border-top: 1px dashed var(--line);
        }
        .sp-track:first-child { border-top: none; }
        .sp-track .no { font-family: var(--font-mono); font-size: 0.7rem; color: var(--acid); }
        .sp-track .meta { flex: 1; min-width: 0; }
        .sp-track .tt { font-weight: 560; font-size: 0.95rem; color: var(--paper); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .sp-track .ta { font-size: 0.78rem; color: var(--paper-dim); }
        .eq { display: inline-flex; align-items: flex-end; gap: 2px; height: 16px; }
        .eq span {
          width: 3px; background: var(--acid); height: 30%;
          animation: eqbounce 1s ease-in-out infinite alternate;
        }
        @keyframes eqbounce {
          0% { height: 22%; opacity: 0.55; }
          100% { height: 100%; opacity: 1; }
        }
        .sp-stats {
          border-left: 1px solid var(--line);
          display: flex; flex-direction: column;
        }
        @media (max-width: 900px) { .sp-stats { border-left: none; border-top: 1px solid var(--line); flex-direction: row; } }
        .sp-stat { flex: 1; padding: 20px 28px; border-top: 1px solid var(--line); }
        .sp-stat:first-child { border-top: none; }
        @media (max-width: 900px) { .sp-stat { border-top: none; border-left: 1px solid var(--line); } .sp-stat:first-child { border-left: none; } }
        .sp-stat .n {
          font-variation-settings: "wdth" 68;
          font-size: clamp(1.7rem, 3vw, 2.4rem); font-weight: 700; line-height: 1; letter-spacing: -0.02em;
        }
        .sp-stat .l {
          font-family: var(--font-mono); font-size: 0.62rem; letter-spacing: 0.12em;
          text-transform: uppercase; color: var(--paper-dim); margin-top: 6px;
        }
        .ah-footnote {
          font-family: var(--font-serif); font-style: italic; font-size: 1.05rem;
          color: var(--paper-dim); text-align: right; margin-top: 4px;
        }
        .ah-footnote b { color: var(--acid); font-weight: 400; }
      `}</style>
      <Section
        id="afterhours"
        num="06"
        label="Not everything is a deliverable"
        title={<>After <span className="serif acid">hours</span></>}
      >
        {/* --- Letterboxd --- */}
        <motion.div
          className="ah-band"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.75, ease: EASE }}
        >
          <div className="ah-head">
            <span>Letterboxd — the film diary</span>
            <a href={letterboxd.url} target="_blank" rel="noopener noreferrer">@vboiwatches ↗</a>
          </div>
          <div className="lb-body">
            <div className="lb-posters">
              {letterboxd.recent.map((f, i) => (
                <motion.a
                  key={f.url ?? f.title}
                  className="lb-film"
                  href={f.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 26 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.6, ease: EASE }}
                >
                  {f.poster && <img src={f.poster} alt={`${f.title} poster`} loading="lazy" />}
                  <span className="corner">{starsFor(f.rating)}</span>
                  <span className="veil">
                    <span className="fname">{f.title}</span>
                    <span className="fstars">{starsFor(f.rating)} · {f.year}</span>
                  </span>
                </motion.a>
              ))}
            </div>
            <div className="lb-side">
              <div className="lb-figures">
                <div className="lb-fig">
                  <div className="n">{letterboxd.filmsLogged}</div>
                  <div className="l">films logged</div>
                </div>
                <div className="lb-fig">
                  <div className="n">{letterboxd.avgRating}<em>★</em></div>
                  <div className="l">average rating</div>
                </div>
                <div className="lb-fig">
                  <div className="n">{letterboxd.fiveStarPct}%</div>
                  <div className="l">five-star verdicts</div>
                </div>
              </div>
              <div className="lb-histo">
                {distribution.map((d, i) => (
                  <div className="lb-bar" key={d.stars} title={`${d.stars}: ${d.count} films`}>
                    <motion.div
                      className="bar"
                      style={{ height: `${Math.max((d.count / maxCount) * 100, 4)}%` }}
                      initial={{ scaleY: 0 }}
                      whileInView={{ scaleY: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.25 + i * 0.06, duration: 0.7, ease: EASE }}
                    >
                      <i />
                    </motion.div>
                  </div>
                ))}
              </div>
              <div className="lb-histo-cap">
                <span>½★</span>
                <span>how I rate 105 films</span>
                <span>5★</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* --- Spotify --- */}
        <motion.div
          className="ah-band"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.75, ease: EASE }}
        >
          <div className="ah-head">
            <span>Spotify — on repeat this month</span>
            <a href={spotify.url} target="_blank" rel="noopener noreferrer">@{spotify.displayName} ↗</a>
          </div>
          <div className="sp-body">
            <Vinyl />
            <div className="sp-tracks">
              {spotify.onRepeat.map((s, i) => (
                <div className="sp-track" key={s.track}>
                  <span className="no">{String(i + 1).padStart(2, "0")}</span>
                  <span className="meta">
                    <span className="tt">{s.track}</span>
                    <br />
                    <span className="ta">{s.artist}</span>
                  </span>
                  <Eq delay={i * 0.12} />
                </div>
              ))}
            </div>
            <div className="sp-stats">
              <div className="sp-stat">
                <div className="n">{spotify.publicPlaylists}</div>
                <div className="l">public playlists</div>
              </div>
              <div className="sp-stat">
                <div className="n">{spotify.followers}</div>
                <div className="l">followers</div>
              </div>
              <div className="sp-stat">
                <div className="n">∞</div>
                <div className="l">replays of track 01</div>
              </div>
            </div>
          </div>
        </motion.div>

        <p className="ah-footnote">
          films pulled <b>live</b> from the diary — the ratings are final, the taste is not up for debate.
        </p>
      </Section>
    </>
  );
}
