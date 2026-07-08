# Vedant Walunj — Portfolio

Personal portfolio built on the MERN stack: React 19 + Vite + Framer Motion client,
Express/Node API, MongoDB (Atlas) for contact-form messages.

**Live data** — the API proxies and caches (1h):

- GitHub repos & stats → `/api/github`
- LeetCode solved counts → `/api/leetcode`
- Letterboxd diary (posters, ratings) → `/api/letterboxd`
- Contact form → `/api/contact` (writes to MongoDB, in-memory fallback)

## Local development

```bash
npm install && npm --prefix server install && npm --prefix client install
npm run dev   # client :5173 (proxies /api), server :5001
```

Optional: set `MONGODB_URI` in `server/.env` to persist contact messages.

## Deployment

| Piece | Where | How |
| --- | --- | --- |
| `client/` | Vercel | `vercel` from `client/`; `vercel.json` rewrites `/api/*` to the Render API |
| `server/` | Render | Connect repo as a Blueprint — `render.yaml` provisions `vedant-portfolio-api` (free plan) |
| MongoDB | Atlas | Free M0 cluster; set `MONGODB_URI` on the Render service |
| Keep-alive | GitHub Actions | `.github/workflows/keepalive.yml` wakes `/api/health` and holds it warm ~8 min per run (best-effort — see below) |

### Keeping the free API awake

Render's free instance sleeps after ~15 min of no traffic (first request then cold-starts ~50s).
The site is unaffected either way — it ships with fallback data ([`client/src/data/fallbackProfile.js`](client/src/data/fallbackProfile.js)),
so pages always render and only the live-data calls wait on a wake.

`keepalive.yml` helps but can't guarantee 24/7: GitHub's scheduled cron is best-effort and
often delayed 30–120 min, so the API isn't warm the whole time. For true 24/7 warmth, add an
external pinger hitting `https://vedant-portfolio-api.onrender.com/api/health` every 5 min
([cron-job.org](https://cron-job.org) or [UptimeRobot](https://uptimerobot.com), both free),
or upgrade the Render service to a paid instance (never sleeps).

Content lives in one place: [`server/data/profile.js`](server/data/profile.js)
(mirrored in [`client/src/data/fallbackProfile.js`](client/src/data/fallbackProfile.js) for API-down resilience).
