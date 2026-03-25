# ⚡ LeadFlux

A lead distribution and sales control SaaS. Automatically assigns leads to agents using round-robin, tracks response time with color indicators, and provides an admin panel for performance monitoring.

---

## Tech Stack

| Layer     | Technology              |
|-----------|-------------------------|
| Frontend  | Vite + React + TypeScript + Tailwind CSS |
| Backend   | Node.js + Express (ESM) |
| Auth & DB | Supabase                |

---

## Project Structure

```
leadflux/
├── backend/
│   ├── src/
│   │   ├── index.js              # Express entry point
│   │   ├── lib/supabase.js       # Supabase client (service role)
│   │   ├── middleware/auth.js    # JWT auth + role guard
│   │   └── routes/
│   │       ├── agents.js
│   │       ├── leads.js
│   │       ├── admin.js
│   │       └── settings.js
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── main.tsx
│   │   ├── App.tsx               # Router
│   │   ├── index.css             # Tailwind + global styles
│   │   ├── lib/
│   │   │   ├── supabase.ts
│   │   │   ├── api.ts            # Typed fetch wrapper
│   │   │   ├── i18n.ts           # EN / ES translations
│   │   │   ├── types.ts
│   │   │   └── time.ts           # Response time utils
│   │   ├── store/index.ts        # Zustand (auth + lang)
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   └── useT.ts           # Translation hook
│   │   ├── components/
│   │   │   ├── ProtectedRoute.tsx
│   │   │   ├── layout/Layout.tsx
│   │   │   └── ui/
│   │   │       ├── StatusBadge.tsx
│   │   │       └── ResponseTimeCell.tsx
│   │   └── pages/
│   │       ├── Login.tsx
│   │       ├── Dashboard.tsx
│   │       ├── Agents.tsx
│   │       └── AdminPanel.tsx
│   ├── .env.example
│   └── package.json
│
└── supabase_schema.sql
```

---

## Setup Instructions

### 1. Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run `supabase_schema.sql`
3. Go to **Authentication > Users** and create your first admin user
4. Go to **SQL Editor** and insert the admin agent row:

```sql
insert into agents (name, email, role, status)
values ('Your Name', 'admin@yourcompany.com', 'admin', 'active');
```

5. Note down:
   - Project URL → `SUPABASE_URL`
   - `anon` public key → `VITE_SUPABASE_ANON_KEY`
   - `service_role` secret key → `SUPABASE_SERVICE_ROLE_KEY`

---

### 2. Backend Setup

```bash
cd backend
cp .env.example .env
# Fill in your Supabase values in .env

npm install
npm run dev
# API running at http://localhost:3001
```

**Backend `.env`:**
```
PORT=3001
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

---

### 3. Frontend Setup

```bash
cd frontend
cp .env.example .env
# Fill in your Supabase values in .env

npm install
npm run dev
# App running at http://localhost:5173
```

**Frontend `.env`:**
```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

---

## API Reference

### Leads

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/leads` | Any | Create & auto-assign lead |
| `GET` | `/api/leads` | Any | All leads (admin) / own leads (agent) |
| `PATCH` | `/api/leads/:id/status` | Any | Update status |

### Agents (Admin only)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/agents` | List all agents |
| `POST` | `/api/agents` | Create agent + Supabase auth user |
| `PATCH` | `/api/agents/:id` | Update (status, role, etc.) |
| `DELETE` | `/api/agents/:id` | Delete agent |

### Admin

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/admin/stats` | Totals, avg response time, leaderboard |

### Settings

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/settings` | Get current settings |
| `PATCH` | `/api/settings` | Update assignment type |

---

## Injecting Leads (external)

To inject leads from a landing page, form, or webhook:

```bash
curl -X POST http://localhost:3001/api/leads \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT" \
  -d '{"name":"Jane Doe","email":"jane@example.com","phone":"+1234567890"}'
```

The system will automatically assign the lead to the next active agent using round-robin.

---

## Response Time Color Logic

| Color | Condition |
|-------|-----------|
| 🟢 Green | < 2 minutes since assigned |
| 🟡 Yellow | 2–5 minutes |
| 🔴 Red | > 5 minutes |

The timer updates every 30 seconds in the browser.

---

## UI Language

Toggle between **English** and **Spanish** using the language switcher in the sidebar (or on the login page). The preference is saved in `localStorage`.

---

## Deployment

### Backend → Railway / Render / Fly.io
- Set environment variables
- Run: `node src/index.js`

### Frontend → Vercel
- Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Build command: `npm run build`
- Output: `dist/`
- Update Vite proxy in production to point to your deployed backend URL

---

## Security Notes

- Backend uses **Supabase service role key** — never expose this on the frontend
- Frontend uses **anon key** only for auth session management
- All API routes are JWT-protected
- Agents cannot access other agents' leads
- Only admins can manage agents or view global stats
