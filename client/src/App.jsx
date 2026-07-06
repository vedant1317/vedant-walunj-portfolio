import { useEffect, useState } from "react";
import Cursor from "./components/Cursor.jsx";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import Marquee from "./components/Marquee.jsx";
import Stats from "./components/Stats.jsx";
import Experience from "./components/Experience.jsx";
import Projects from "./components/Projects.jsx";
import CodeStats from "./components/CodeStats.jsx";
import Skills from "./components/Skills.jsx";
import Education from "./components/Education.jsx";
import AfterHours from "./components/AfterHours.jsx";
import Contact from "./components/Contact.jsx";
import Footer from "./components/Footer.jsx";
import { fallbackProfile } from "./data/fallbackProfile.js";

export default function App() {
  const [profile, setProfile] = useState(fallbackProfile);
  const [github, setGithub] = useState(fallbackProfile.githubFallback);
  const [leetcode, setLeetcode] = useState(fallbackProfile.leetcodeFallback);
  const [letterboxd, setLetterboxd] = useState(fallbackProfile.letterboxdFallback);

  useEffect(() => {
    const load = (url, set) =>
      fetch(url)
        .then((r) => (r.ok ? r.json() : Promise.reject()))
        .then(set)
        .catch(() => {}); // fallbacks already in place
    load("/api/profile", setProfile);
    load("/api/github", setGithub);
    load("/api/leetcode", setLeetcode);
    load("/api/letterboxd", setLetterboxd);
  }, []);

  return (
    <>
      <div className="grid-rules" />
      <div className="noise" />
      <Cursor />
      <Navbar />
      <main>
        <Hero profile={profile} />
        <Marquee items={profile.roles} />
        <Stats stats={profile.stats} />
        <Experience items={profile.experience} />
        <Projects projects={profile.projects} github={github} />
        <CodeStats leetcode={leetcode} github={github} links={profile.links} />
        <Skills skills={profile.skills} />
        <Education education={profile.education} achievements={profile.achievements} />
        <AfterHours spotify={profile.spotify} letterboxd={letterboxd} />
        <Contact email={profile.email} />
      </main>
      <Footer links={profile.links} />
    </>
  );
}
