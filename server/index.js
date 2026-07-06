import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { profile } from "./data/profile.js";

const app = express();
// Use API_PORT, not PORT — dev launchers often inject PORT for the frontend.
const PORT = process.env.API_PORT || 5001;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/portfolio";

app.use(cors());
app.use(express.json());

// --- MongoDB (optional — falls back to in-memory so the site always works) ---
let dbReady = false;
const memoryMessages = [];

const messageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, maxlength: 200 },
    message: { type: String, required: true, trim: true, maxlength: 5000 },
  },
  { timestamps: true }
);
const Message = mongoose.model("Message", messageSchema);

mongoose
  .connect(MONGODB_URI, { serverSelectionTimeoutMS: 3000 })
  .then(() => {
    dbReady = true;
    console.log("[server] MongoDB connected");
  })
  .catch(() => {
    console.log("[server] MongoDB unavailable — using in-memory message store");
  });

// --- Live stats proxies (GitHub + LeetCode) with a 1h in-memory cache ---
const cache = new Map();
const HOUR = 60 * 60 * 1000;

async function cached(key, fetcher) {
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < HOUR) return hit.data;
  const data = await fetcher();
  cache.set(key, { at: Date.now(), data });
  return data;
}

app.get("/api/github", async (_req, res) => {
  try {
    const data = await cached("github", async () => {
      const [user, repos] = await Promise.all([
        fetch("https://api.github.com/users/vedant1317").then((r) => r.json()),
        fetch("https://api.github.com/users/vedant1317/repos?per_page=100&sort=updated").then((r) => r.json()),
      ]);
      return {
        publicRepos: user.public_repos,
        followers: user.followers,
        repos: (Array.isArray(repos) ? repos : [])
          .filter((r) => !r.fork)
          .map((r) => ({
            name: r.name,
            description: r.description,
            language: r.language,
            url: r.html_url,
            updated: r.updated_at,
          })),
      };
    });
    res.json(data);
  } catch {
    res.json(profile.githubFallback);
  }
});

app.get("/api/leetcode", async (_req, res) => {
  try {
    const data = await cached("leetcode", async () => {
      const body = {
        query: `query { matchedUser(username: "vedantvw") {
          profile { ranking }
          submitStatsGlobal { acSubmissionNum { difficulty count } }
        } }`,
      };
      const r = await fetch("https://leetcode.com/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }).then((x) => x.json());
      const stats = r.data.matchedUser.submitStatsGlobal.acSubmissionNum;
      const get = (d) => stats.find((s) => s.difficulty === d)?.count ?? 0;
      return {
        total: get("All"),
        easy: get("Easy"),
        medium: get("Medium"),
        hard: get("Hard"),
        ranking: r.data.matchedUser.profile.ranking,
      };
    });
    res.json(data);
  } catch {
    res.json(profile.leetcodeFallback);
  }
});

app.get("/api/letterboxd", async (_req, res) => {
  try {
    const data = await cached("letterboxd", async () => {
      const xml = await fetch("https://letterboxd.com/vboiwatches/rss/").then((r) => r.text());
      const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(([, item]) => {
        const tag = (name) => item.match(new RegExp(`<${name}>([\\s\\S]*?)</${name}>`))?.[1] ?? null;
        return {
          title: tag("letterboxd:filmTitle"),
          year: tag("letterboxd:filmYear"),
          rating: tag("letterboxd:memberRating") ? Number(tag("letterboxd:memberRating")) : null,
          watched: tag("letterboxd:watchedDate"),
          url: tag("link"),
          poster: item.match(/<img src="([^"]+)"/)?.[1] ?? null,
        };
      });
      return {
        ...profile.letterboxdFallback,
        recent: items.filter((i) => i.title).slice(0, 5),
      };
    });
    res.json(data);
  } catch {
    res.json(profile.letterboxdFallback);
  }
});

// --- API ---
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, db: dbReady ? "mongodb" : "memory" });
});

app.get("/api/profile", (_req, res) => {
  res.json(profile);
});

app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body || {};
  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return res.status(400).json({ error: "name, email and message are required" });
  }
  try {
    if (dbReady) {
      await Message.create({ name, email, message });
    } else {
      memoryMessages.push({ name, email, message, createdAt: new Date() });
    }
    res.status(201).json({ ok: true });
  } catch (err) {
    console.error("[server] contact error:", err.message);
    res.status(500).json({ error: "failed to save message" });
  }
});

app.listen(PORT, () => console.log(`[server] API listening on http://localhost:${PORT}`));
