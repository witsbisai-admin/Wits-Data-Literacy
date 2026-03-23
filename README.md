# Wits Data Literacy Platform v4
**University of the Witwatersrand · Business Intelligence Services**

> NQF Level 7 · 12 Contact Hours · 8 Credits · 6 Units · Interactive Labs · Quizzes · Certificate Generator

---

## Admin Credentials
| Field | Value |
|---|---|
| **Email** | `admin@wits.ac.za` |
| **Password** | `WitsBISO@2025!` |

**Change the password after first login.**

---

## Quick Deploy

### Option C — Netlify (2 minutes, free)
1. Go to [netlify.com](https://netlify.com) → New site → Deploy manually
2. Drag the `platform/` folder onto the drop zone
3. Done — live at `https://random-name.netlify.app`

### Option A — Docker (5 minutes)
```bash
curl -fsSL https://get.docker.com | bash          # install Docker
nano nginx/default.conf                            # set server_name to your domain
cd docker && docker compose up -d --build          # start
curl http://localhost/health                       # verify → "healthy"
```

### Option B — Bare nginx (Ubuntu)
```bash
sudo bash deploy.sh --nginx
```

### Option D — Canvas
See `canvas/canvas-iframe-embed.html` — paste into Canvas HTML editor.
Full guide in `canvas/CANVAS_INTEGRATION.py`.

---

## File Structure
```
wits-complete-package/
├── platform/index.html          ← The full platform (v4, all bugs fixed)
├── docker/Dockerfile            ← nginx:alpine image
├── docker/docker-compose.yml    ← Container orchestration
├── nginx/nginx.conf             ← Main nginx config
├── nginx/default.conf           ← Virtual host (set domain here)
├── nginx/wits-platform.service  ← systemd service
├── canvas/canvas-iframe-embed.html  ← Canvas iFrame snippet
├── canvas/CANVAS_INTEGRATION.py ← Canvas full integration guide
├── netlify.toml                 ← Netlify auto-config
├── vercel.json                  ← Vercel auto-config
├── .github/workflows/deploy.yml ← GitHub Pages auto-deploy
├── deploy.sh                    ← One-command deploy/update/ssl/stop
├── .env.example                 ← Copy to .env, fill in domain
└── docs/deployment-guide.html   ← Full guide (open in browser)
```

---

## Platform Features
- **6 Units** with full content (2h each, 12h total)
- **Interactive Labs** with embedded datasets, filterable tables, charts, task completion
- **Quizzes** — per-unit, auto-graded, 70% pass threshold, XP rewards
- **Sign In / Sign Out** — per-user progress tracking via localStorage
- **Forgot Password** — self-service reset code flow
- **Admin Panel** — Overview dashboard, User Management (reset/delete passwords), Progress Reports
- **Certificate Generator** — unlocks on full completion, auto-fills from logged-in user
- **No backend required** — entirely self-contained HTML file

---

## Update the Platform
```bash
bash deploy.sh --update         # works for both Docker and bare nginx
```

## Add HTTPS
```bash
sudo bash deploy.sh --ssl your-domain.wits.ac.za
```

---

*Wits BISO · 2025*
