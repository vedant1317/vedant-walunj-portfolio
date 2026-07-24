export const profile = {
  name: "Vedant Walunj",
  roles: ["backend systems", "AI agents", "cloud security", "full-stack products", "database tooling"],
  email: "vedantwalunj1317@gmail.com",
  phone: "+91 8928615023",
  summary:
    "IT engineering student at KJ Somaiya College of Engineering (CGPA 9.55, Honors in AI) and Technical Intern at ARCON. Driven by a passion for building solutions that solve real problems.",
  links: {
    github: "https://github.com/vedant1317",
    linkedin: "https://www.linkedin.com/in/vedantwalunj/",
    leetcode: "https://leetcode.com/u/vedantvw/",
  },
  // Every number has context — nothing vague.
  stats: [
    {
      value: 9.55,
      decimals: 2,
      suffix: "",
      label: "CGPA",
      context: "B.Tech IT + Honors in AI, KJ Somaiya College of Engineering",
    },
    {
      value: 2,
      decimals: 0,
      suffix: "",
      label: "national hackathon finals",
      context: "2nd place at KJSSE Gajshield HackX (250+ participants) · Datathon 2026 finalist",
    },
    {
      value: 1150,
      decimals: 0,
      suffix: "+",
      label: "registrations at AfterMath",
      context: "24-hour national hackathon I co-organized as ACM KJSCE Treasurer",
    },
    {
      value: 10,
      decimals: 0,
      suffix: "",
      label: "AI agents orchestrated",
      context: "In NERVE — my autonomous outreach engine built on Mastra + Groq",
    },
  ],
  experience: [
    {
      role: "Technical Intern",
      org: "ARCON",
      period: "Jun 2026 – Present",
      points: [
        "Working in the DevOps team on a cloud security initiative that automates CVE extraction and remediation across AWS services.",
        "Built a boto3-based CloudTrail audit pipeline that ingests management events across UAT and production AWS accounts and classifies IAM and network-security events — root account usage, MFA changes, policy attachments, AdministratorAccess grants, and Elastic IP lifecycle.",
        "Automated prioritized daily security summaries per environment, turning raw CloudTrail logs into review-ready reports mapped to a monitoring-priority matrix.",
      ],
    },
    {
      role: "Treasurer",
      org: "KJSCE ACM Student Chapter",
      period: "Jun 2025 – Present",
      points: [
        "Managed budgeting, sponsorship coordination, and execution for large-scale technical events.",
        "Delivered a seminar to 200+ students during “Beyond the Classroom”, ACM KJSCE's introductory event.",
        "Organized Artemis, a frontend-only hackathon with 50+ participating teams.",
        "Co-organized AfterMath, a 24-hour national-level hackathon with 1,150+ registrations.",
        "Co-developed the ACM KJSCE council website: kjsce.acm.org.",
      ],
    },
    {
      role: "Software Development Intern",
      org: "Mahindra Group",
      period: "Jun – Jul 2025",
      points: [
        "Developed RESTful APIs and automated internal workflows using Python and Flask.",
        "Optimized backend modules, cutting application load time by 18%.",
        "Collaborated with cross-functional teams on testing, deployment, and Agile development workflows.",
      ],
    },
    {
      role: "Operations Team Member",
      org: "KJSCE ACM Student Chapter",
      period: "Jul 2024 – May 2025",
      points: [
        "Handled on-ground operations and logistics for the chapter's technical events and workshops.",
      ],
    },
  ],
  projects: [
    {
      name: "NERVE",
      tagline: "Autonomous Outreach Engine",
      description:
        "Agentic AI sales platform automating lead enrichment, intent scoring, outreach strategy, content generation, and follow-ups. A 10-agent TypeScript backend with a real-time React dashboard — SSE streaming, pipeline visualization, campaign tracking, and an AI schedule assistant.",
      stack: ["Groq Llama 3.3", "Mastra", "Hono", "MongoDB", "React", "SSE"],
      github: "https://github.com/vedant1317",
    },
    {
      name: "PathFinder",
      tagline: "Career Guidance Platform",
      description:
        "Career guidance platform with authenticated workflows, role-based admin access, personalized assessments, session booking, and payment flows. Multilingual AI chatbot, i18next localization, email automation, cron reminders, and Chart.js analytics.",
      stack: ["React", "Express.js", "PostgreSQL", "JWT", "OpenAI API"],
      github: "https://github.com/vedant1317",
    },
    {
      name: "PitLane",
      tagline: "DB Benchmarking Tool",
      description:
        "Database benchmarking platform for evidence-driven selection across PostgreSQL, MongoDB, and DynamoDB Local. Concurrent workload runner with latency percentiles, throughput metrics, Docker telemetry, CI-ready regression gates, and a FastAPI dashboard.",
      stack: ["Python", "FastAPI", "PostgreSQL", "MongoDB", "Docker"],
      github: "https://github.com/vedant1317/CC-Project",
    },
  ],
  skills: {
    Languages: ["C", "C++", "Python", "Java", "JavaScript", "TypeScript"],
    "Web Technologies": ["React", "Node.js", "Express.js", "Flask", "Hono", "REST APIs", "SSE"],
    Databases: ["MongoDB", "PostgreSQL", "MySQL", "DynamoDB"],
    "AI & Agents": ["Mastra", "Groq", "OpenAI API", "LLM Orchestration", "GNNs"],
    "Cloud & DevOps": ["AWS", "boto3", "CloudTrail", "IAM", "Docker", "CI/CD"],
    "Tools & Platforms": ["Git", "GitHub", "FastAPI", "Vercel"],
  },
  education: [
    {
      school: "KJ Somaiya College of Engineering",
      degree: "B.Tech in Information Technology, Honors in AI",
      period: "2023 – 2027",
      score: "CGPA 9.55",
    },
    { school: "Ryan International School, Sanpada", degree: "HSC", period: "2023", score: "85%" },
    { school: "St Mary's ICSE School", degree: "SSC", period: "2021", score: "97.33%" },
  ],
  achievements: [
    "2nd place — KJSSE Gajshield HackX, national-level hackathon, 250+ participants",
    "Finalist — Datathon 2026, national-level hackathon, 200+ participants",
    "Data Structures in C++ — Scaler Academy",
    "Secure & Sustainable Blockchain Development STTP — KJSCE, Euclid Labs",
  ],
  // After-hours data. Spotify is a curated snapshot (their API needs auth keys);
  // Letterboxd is fetched live via /api/letterboxd with this as fallback.
  spotify: {
    url: "https://open.spotify.com/user/mv0xvo926pxcwpvyos3k4rfh1",
    displayName: "vedant",
    publicPlaylists: 17,
    followers: 32,
    onRepeat: [
      { track: "Champions (WC 26)", artist: "IShowSpeed" },
      { track: "(When You Gonna) Give It Up to Me", artist: "Sean Paul, Keyshia Cole" },
      { track: "Aarzu", artist: "Asim Azhar, Noor, Khan" },
      { track: "Favour", artist: "Avenoir" },
    ],
  },
  letterboxdFallback: {
    url: "https://letterboxd.com/vboiwatches/",
    filmsLogged: 105,
    thisYear: 5,
    distribution: [
      { stars: "½", count: 2 },
      { stars: "★", count: 3 },
      { stars: "★½", count: 1 },
      { stars: "★★", count: 9 },
      { stars: "★★½", count: 4 },
      { stars: "★★★", count: 16 },
      { stars: "★★★½", count: 10 },
      { stars: "★★★★", count: 26 },
      { stars: "★★★★½", count: 14 },
      { stars: "★★★★★", count: 20 },
    ],
    avgRating: 3.65,
    fiveStarPct: 19,
    recent: [
      { poster: "https://a.ltrbxd.com/resized/film-poster/9/7/6/4/1/9/976419-backrooms-2026-0-600-0-900-crop.jpg?v=f7a99e3fc8", title: "Backrooms", year: "2026", rating: 2.0, watched: "2026-06-21", url: "https://letterboxd.com/vboiwatches/film/backrooms-2026/1/" },
      { poster: "https://a.ltrbxd.com/resized/film-poster/1/2/3/4/4/7/2/1234472-obsession-2025-2-0-600-0-900-crop.jpg?v=cff6fc00b6", title: "Obsession", year: "2025", rating: 3.5, watched: "2026-06-03", url: "https://letterboxd.com/vboiwatches/film/obsession-2025/" },
      { poster: "https://a.ltrbxd.com/resized/film-poster/1/0/9/0/2/7/1/1090271-return-of-the-jungle-0-600-0-900-crop.jpg?v=7551f34fb6", title: "Return of the Jungle", year: "2023", rating: 4.0, watched: "2026-06-01", url: "https://letterboxd.com/vboiwatches/film/return-of-the-jungle/" },
      { poster: "https://a.ltrbxd.com/resized/film-poster/1/1/7/3/1/9/5/1173195-thrash-2026-0-600-0-900-crop.jpg?v=d17155cd56", title: "Thrash", year: "2026", rating: 1.0, watched: "2026-05-27", url: "https://letterboxd.com/vboiwatches/film/thrash-2026/" },
      { poster: "https://a.ltrbxd.com/resized/film-poster/8/4/1/1/0/3/841103-michael-2026-0-600-0-900-crop.jpg?v=1e8e478e40", title: "Michael", year: "2026", rating: 4.5, watched: "2026-05-19", url: "https://letterboxd.com/vboiwatches/film/michael-2026/" },
    ],
  },
  // Snapshots used if the live GitHub/LeetCode proxies fail.
  githubFallback: {
    publicRepos: 8,
    followers: 4,
    repos: [
      { name: "MolecularGNN", description: null, language: "Python", url: "https://github.com/vedant1317/MolecularGNN", updated: "2026-04-29" },
      { name: "VAPT-Project", description: null, language: "Python", url: "https://github.com/vedant1317/VAPT-Project", updated: "2026-04-23" },
      { name: "CC-Project", description: "Automated database evaluation suite for cloud native applications", language: "Python", url: "https://github.com/vedant1317/CC-Project", updated: "2026-04-19" },
      { name: "MonsterDex", description: null, language: "TypeScript", url: "https://github.com/vedant1317/MonsterDex", updated: "2026-04-18" },
      { name: "OOSE-Project", description: null, language: "JavaScript", url: "https://github.com/vedant1317/OOSE-Project", updated: "2026-04-21" },
      { name: "RAIT-ACM-KLEOS_snackOverlflow", description: null, language: "Python", url: "https://github.com/vedant1317/RAIT-ACM-KLEOS_snackOverlflow", updated: "2026-06-20" },
    ],
  },
  leetcodeFallback: { total: 50, easy: 29, medium: 21, hard: 0, ranking: 2568693 },
  monkeytypeFallback: {
    url: "https://monkeytype.com/profile/vboitypes",
    username: "vboitypes",
    bestWpm: 79,
    bestAcc: 99,
    completedTests: 163,
    minutesTyping: 43,
    personalBests: [
      { label: "15s", wpm: 79, acc: 99 },
      { label: "30s", wpm: 78, acc: 98 },
      { label: "60s", wpm: 69, acc: 96 },
    ],
  },
};
