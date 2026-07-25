import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { profile } from "./data/profile.js";

const app = express();
// Use API_PORT, not PORT — dev launchers often inject PORT for the frontend.
const PORT = process.env.API_PORT || 5001;
const MONGODB_URI =
  process.env.MONGODB_URI || process.env.MONGO_URI || "mongodb://127.0.0.1:27017/portfolio";

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

// Sketch-wall guestbook: visitors leave a small doodle. Strokes are stored as
// normalized point-paths so they render at any tile size.
const sketchSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, maxlength: 40, default: "" },
    color: { type: String, trim: true, maxlength: 12, default: "#d8f651" },
    strokes: { type: Array, default: [] }, // [[[x,y],...], ...] with x,y in 0..1
  },
  { timestamps: true }
);
const Sketch = mongoose.model("Sketch", sketchSchema);
const memorySketches = []; // dev fallback when Mongo is unavailable; starts empty each boot

// Guards against garbage / abuse payloads. Returns a cleaned sketch or null.
const HEX = /^#[0-9a-fA-F]{3,8}$/;
function sanitizeSketch(body) {
  if (!body || typeof body !== "object") return null;
  if (typeof body.hp === "string" && body.hp.trim() !== "") return null; // honeypot
  const strokes = Array.isArray(body.strokes) ? body.strokes : [];
  if (strokes.length === 0 || strokes.length > 60) return null;
  let points = 0;
  const clean = [];
  for (const s of strokes) {
    if (!Array.isArray(s) || s.length < 2) continue;
    const path = [];
    for (const p of s) {
      if (!Array.isArray(p) || p.length !== 2) continue;
      const x = Number(p[0]);
      const y = Number(p[1]);
      if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
      path.push([Math.min(1, Math.max(0, +x.toFixed(3))), Math.min(1, Math.max(0, +y.toFixed(3)))]);
      if (++points > 2500) break;
    }
    if (path.length >= 2) clean.push(path);
    if (points > 2500) break;
  }
  if (clean.length === 0) return null;
  const name = typeof body.name === "string" ? body.name.trim().slice(0, 40) : "";
  const color = typeof body.color === "string" && HEX.test(body.color.trim()) ? body.color.trim() : "#d8f651";
  return { name, color, strokes: clean };
}

mongoose
  .connect(MONGODB_URI, { serverSelectionTimeoutMS: 12000 })
  .then(async () => {
    dbReady = true;
    console.log("[server] MongoDB connected");
    // One-time cleanup: drop the doodle left behind while verifying persistence.
    try {
      const { deletedCount } = await Sketch.deleteMany({ name: /^persist-test$/i });
      if (deletedCount) console.log(`[server] removed ${deletedCount} persist-test sketch(es)`);
    } catch (err) {
      console.error("[server] persist-test cleanup skipped:", err.message);
    }
  })
  .catch((err) => {
    // log the real reason so failures are diagnosable in Render logs
    console.error("[server] MongoDB unavailable — using in-memory store. Reason:", err.message);
  });

mongoose.connection.on("connected", () => { dbReady = true; });
mongoose.connection.on("disconnected", () => { dbReady = false; });

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

app.get("/api/monkeytype", async (_req, res) => {
  try {
    const data = await cached("monkeytype", async () => {
      const r = await fetch("https://api.monkeytype.com/users/vboitypes/profile?isUid=false", {
        headers: { Accept: "application/json" },
      }).then((x) => x.json());
      const d = r.data ?? {};
      const ts = d.typingStats ?? {};
      const time = d.personalBests?.time ?? {};
      const personalBests = ["15", "30", "60", "120"]
        .map((sec) => {
          const arr = time[sec] ?? [];
          if (!arr.length) return null;
          const best = arr.reduce((a, b) => (b.wpm > a.wpm ? b : a));
          return { label: `${sec}s`, wpm: Math.round(best.wpm), acc: Math.round(best.acc) };
        })
        .filter(Boolean);
      return {
        url: "https://monkeytype.com/profile/vboitypes",
        username: "vboitypes",
        bestWpm: personalBests.reduce((m, p) => Math.max(m, p.wpm), 0),
        bestAcc: personalBests.reduce((m, p) => Math.max(m, p.acc), 0),
        completedTests: ts.completedTests ?? 0,
        minutesTyping: Math.round((ts.timeTyping ?? 0) / 60),
        personalBests,
      };
    });
    res.json(data);
  } catch {
    res.json(profile.monkeytypeFallback);
  }
});

// --- API ---
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, db: dbReady ? "mongodb" : "memory" });
});

app.get("/api/profile", (_req, res) => {
  res.json(profile);
});

function requireAdmin(req, res, next) {
  const token = req.get("x-admin-token");
  if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ error: "unauthorized" });
  }
  next();
}

app.get("/api/messages", requireAdmin, async (_req, res) => {
  if (dbReady) {
    const messages = await Message.find().sort({ createdAt: -1 });
    return res.json(messages);
  }
  res.json([...memoryMessages].reverse());
});

app.get("/api/guestbook", async (_req, res) => {
  try {
    if (dbReady) {
      const rows = await Sketch.find().sort({ createdAt: -1 }).limit(24).lean();
      return res.json(rows.map((r) => ({ name: r.name, color: r.color, strokes: r.strokes, createdAt: r.createdAt })));
    }
    return res.json([...memorySketches].slice(-24).reverse());
  } catch (err) {
    console.error("[server] guestbook GET error:", err.message);
    res.status(500).json({ error: "failed to load guestbook" });
  }
});

app.post("/api/guestbook", async (req, res) => {
  const clean = sanitizeSketch(req.body);
  if (!clean) return res.status(400).json({ error: "invalid sketch" });
  try {
    const doc = { ...clean, createdAt: new Date() };
    if (dbReady) await Sketch.create(clean);
    else memorySketches.push(doc);
    res.status(201).json({ ok: true, sketch: doc });
  } catch (err) {
    console.error("[server] guestbook POST error:", err.message);
    res.status(500).json({ error: "failed to save sketch" });
  }
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
