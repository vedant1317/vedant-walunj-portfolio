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
| Keep-alive | GitHub Actions | `.github/workflows/keepalive.yml` pings `/api/health` every 10 min so the free dyno never sleeps |

Content lives in one place: [`server/data/profile.js`](server/data/profile.js)
(mirrored in [`client/src/data/fallbackProfile.js`](client/src/data/fallbackProfile.js) for API-down resilience).
