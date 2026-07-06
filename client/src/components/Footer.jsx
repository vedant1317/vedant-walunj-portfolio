import { GitHubIcon, LinkedInIcon, LeetCodeIcon } from "./icons.jsx";

export default function Footer({ links }) {
  return (
    <>
      <style>{`
        .ft {
          position: relative; z-index: 2;
          border-top: 1px solid var(--line-strong);
          padding: 26px 0;
        }
        .ft-inner {
          display: flex; justify-content: space-between; align-items: center; gap: 20px;
          font-family: var(--font-mono); font-size: 0.7rem; letter-spacing: 0.12em;
          text-transform: uppercase; color: var(--paper-dim);
        }
        @media (max-width: 640px) { .ft-inner { flex-direction: column; } }
        .ft-social { display: flex; gap: 4px; }
        .ft-social a {
          display: inline-flex; width: 38px; height: 38px; align-items: center; justify-content: center;
          color: var(--paper-dim); transition: all 0.25s ease;
        }
        .ft-social a:hover { color: var(--ink); background: var(--acid); }
        .ft b { color: var(--acid); font-weight: 500; }
      `}</style>
      <footer className="ft">
        <div className="container ft-inner">
          <span>© 2026 <b>Vedant Walunj</b></span>
          <div className="ft-social">
            <a href={links.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub"><GitHubIcon width="18" height="18" /></a>
            <a href={links.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><LinkedInIcon width="18" height="18" /></a>
            <a href={links.leetcode} target="_blank" rel="noopener noreferrer" aria-label="LeetCode"><LeetCodeIcon width="18" height="18" /></a>
          </div>
          <span>MERN · Designed in code, Mumbai</span>
        </div>
      </footer>
    </>
  );
}
