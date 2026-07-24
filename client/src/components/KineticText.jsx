import { useEffect, useLayoutEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import anime from "../lib/anime.js";

// Expressive per-letter display type: a staggered anime.js intro, then a live
// "lean" where letters rise toward the pointer. The signature hero move.
//
// Robustness: letters are visible by default (CSS). We only hide-then-reveal
// when the page is actually visible and motion is allowed — so no-JS, a failed
// anime import, reduced-motion, or a background-tab load never leave the name
// invisible. Accessible: the real word is exposed via aria-label.
export default function KineticText({ text, delay = 0, stagger = 34, className = "" }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const letters = [...text];

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    const inners = root.querySelectorAll(".kt-inner");
    const show = () =>
      inners.forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
      });

    if (reduced || typeof anime !== "function") {
      show();
      return;
    }

    let anim;
    const play = () => {
      inners.forEach((el) => (el.style.opacity = "0")); // set before paint, no flash
      anim = anime({
        targets: inners,
        translateY: ["0.5em", "0em"],
        rotateZ: [6, 0],
        opacity: [0, 1],
        delay: anime.stagger(stagger, { start: delay }),
        duration: 900,
        easing: "easeOutExpo",
        complete: show, // guarantee the final state even if interrupted
      });
    };

    if (document.hidden) {
      show(); // don't hide content in a background tab — play once it's shown
      const onVis = () => {
        if (!document.hidden) {
          document.removeEventListener("visibilitychange", onVis);
          play();
        }
      };
      document.addEventListener("visibilitychange", onVis);
      return () => document.removeEventListener("visibilitychange", onVis);
    }

    play();
    return () => anim && anim.pause();
  }, [reduced, delay, stagger, text]);

  // pointer lean — letters near the cursor rise a touch
  useEffect(() => {
    const root = ref.current;
    if (!root || reduced) return;
    let raf = 0;
    let px = null;
    const apply = () => {
      raf = 0;
      if (px == null) return;
      root.querySelectorAll(".kt-letter").forEach((el) => {
        const c = el.offsetLeft + el.offsetWidth / 2;
        const infl = Math.max(0, 1 - Math.abs(c - px) / 200);
        el.style.transform = `translateY(${(-infl * 11).toFixed(2)}px)`;
      });
    };
    const onMove = (e) => {
      px = e.clientX - root.getBoundingClientRect().left;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const reset = () => {
      px = null;
      root.querySelectorAll(".kt-letter").forEach((el) => (el.style.transform = "translateY(0)"));
    };
    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerleave", reset);
    return () => {
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", reset);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  return (
    <span ref={ref} className={`kt ${className}`} aria-label={text}>
      {letters.map((ch, i) => (
        <span className="kt-letter" key={i} aria-hidden="true">
          <span className="kt-inner">{ch === " " ? " " : ch}</span>
        </span>
      ))}
    </span>
  );
}
