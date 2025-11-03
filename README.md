# LegalArgGen Frontend (Next.js)

A Next.js 15 app that provides a chat UX for generating 3‑ply legal arguments. It integrates with:

- Supabase Auth (email/GitHub etc.)
- MongoDB for chat storage
- Hugging Face Inference (classification + generic assistant)
- Flask backend pipeline for trade‑secret argument generation

Light/Dark themes supported. Includes ChatGPT‑like UX: instant user message, generating placeholder, stop button, auto‑scroll, per‑message copy, and per‑chat delete menu.

---

## Prerequisites

- Node.js 20+ (recommended)
- A running backend API (see `../backend/README.md`)
- Accounts/keys for:
  - Supabase (Project URL + anon public key)
  - MongoDB Atlas (or local Mongo) connection string
  - Hugging Face Inference API key

---

## Setup

1. Install dependencies

```bash
npm install
```

2. Create environment file

Create `.env.local` in `legal_arg_gen/` with:

```
# Backend API endpoint
BACKEND_PIPELINE_URL=http://localhost:8000/api/pipeline

# MongoDB
MONGO_DB_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority

# Supabase (client + server both use public URL and anon key)
NEXT_PUBLIC_SUPABASE_PUBLIC_URL=https://<project-id>.supabase.co
NEXT_PUBLIC_SUPABASE_API_KEY=<your-supabase-anon-key>

# Hugging Face (used for classification + generic responses)
HF_API_KEY=hf_********************************
```

Notes:

- DB name used is `arg_gen` (see `src/lib/mongodb.js`). You can change it in code if needed.
- For local Mongo, use `mongodb://localhost:27017` and ensure Mongo is running.

3. Run the app

```bash
npm run dev
```

Open http://localhost:3000.

---

## How it works

- Auth: Supabase SSR helpers manage session cookies server‑side (`src/lib/supabase-server.js`).
- Storage: Chats are stored in MongoDB (`src/lib/mongodb.js`, collection `chats`).
- Classification & routing: `src/actions/chats.js`
  - Pre‑extracts precedent hints
  - Calls HF classifier to detect trade‑secret cases and extract c1/c2/c3
  - If trade‑secret, calls the backend `/api/pipeline` with summaries
  - Else falls back to a generic HF assistant
- UX:
  - Instant user message save and a temporary "Generating..." bot placeholder
  - Stop button (Remix icon) cancels local wait and removes placeholder
  - Auto‑scroll to latest messages
  - Copy button below each message
  - Sidebar three‑dots menu with Delete chat option

---

## Scripts

- `npm run dev` – start Next.js dev server
- `npm run build` – production build
- `npm run start` – start production server (after build)
- `npm run lint` – run lints

---

## File map (high‑level)

- `src/app/(post_login)/dashboard/page.jsx` – main chat UI + auto‑scroll + copy buttons
- `src/components/chatinput.jsx` – input, send/stop, optimistic UI
- `src/components/sidebar.jsx` – chat list, new chat, delete menu
- `src/actions/chats.js` – server actions (fetch/add/delete/chat routing)
- `src/lib/mongodb.js` – Mongo connection (uses `MONGO_DB_URI`)
- `src/lib/supabase-client.js` / `supabase-server.js` – Supabase setup
- `src/app/globals.css` – Tailwind v4 + global scrollbar styles

---

## Backend dependency

Make sure the backend is running and reachable at `BACKEND_PIPELINE_URL`. See `../backend/README.md` for setup. The frontend will:

- POST to `/api/pipeline` for trade‑secret flows
- Use HF APIs for classification and generic replies

---

## Troubleshooting

- 401 / No user found on server
  - Ensure Supabase credentials are correct and the auth flow is working.
- Mongo errors / cannot connect
  - Check `MONGO_DB_URI` and IP access list for Atlas. Confirm database `arg_gen` exists or will be created.
- Pipeline errors
  - Ensure backend is running and `BACKEND_PIPELINE_URL` is correct.
- HF classify errors
  - Ensure `HF_API_KEY` is set.

---

## Production notes

- Set all env vars in your host environment (do not commit `.env.local`).
- Consider adding rate‑limits and stricter validation in `src/actions/chats.js` for public deployments.
- Next.js build: `npm run build && npm run start`.

---

## License

This project is provided as‑is for internal use. Review and adapt before commercial or public deployment.
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

# LegalArgGen Backend (Flask)
for backend refer the repository: https://github.com/Rayan-360/LegalArgGen_Backend