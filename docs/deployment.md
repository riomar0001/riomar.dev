# Deployment Guide — Supabase + Vercel

End-to-end guide for deploying this portfolio: Supabase provides the PostgreSQL database (via Prisma) and file storage for uploads; Vercel builds and hosts the Next.js app. For self-hosting with Docker instead of Vercel, see [docker.md](./docker.md) — the Supabase setup in Part 1 applies either way.

## Architecture

- **Next.js 16 (App Router)** — public pages use ISR (`revalidate = 60`); CMS mutations call `revalidatePublic()` so edits appear immediately.
- **Prisma → Supabase Postgres** — queries go through the connection pooler (`DATABASE_URL`), migrations through the direct/session connection (`DIRECT_URL`).
- **Supabase Storage** — one public bucket holds all uploads (profile photo, project images, achievement photos, certificate badges, resumes). Uploads happen server-side with the service role key.
- **CMS** — `/dashboard` behind JWT auth (`/dashboard/login`), single `admin` user created by the seed script.

---

## Part 1 — Supabase setup

### 1.1 Create the project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard) → **New project**.
2. Pick an organization, name (e.g. `portfolio`), a **strong database password** (save it — you need it for the connection strings), and the region closest to your visitors.
3. Wait for provisioning to finish (~2 minutes).

### 1.2 Get the connection strings

Open **Connect** (top bar of the project dashboard) and copy both variants:

| Env var | Which string | Port | Notes |
|---|---|---|---|
| `DATABASE_URL` | **Transaction pooler** | `6543` | Append `?pgbouncer=true`. Used by the app at runtime — required on serverless so Prisma doesn't exhaust connections. |
| `DIRECT_URL` | **Session pooler** (or direct connection) | `5432` | Used only by Prisma CLI for migrations. |

They look like:

```
DATABASE_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"
```

> If your database password contains special characters (`@`, `#`, `:` …), URL-encode them.

### 1.3 Create the storage bucket

1. **Storage** → **New bucket**.
2. Name it `portfolio-assets` (or anything — just match `SUPABASE_STORAGE_BUCKET`).
3. Enable **Public bucket** — the site serves images/resume straight from public URLs.
4. No storage policies are needed: writes go through the server with the service role key (which bypasses RLS), and the public flag covers reads.

The app creates these folders inside the bucket on first upload — nothing to pre-create: `photos/`, `resumes/`, `projects/`, `certificate_badges/`, `achievement_photos/`.

### 1.4 Get the API credentials

**Project Settings** → **API keys**:

- **Project URL** → `NEXT_PUBLIC_SUPABASE_URL` (e.g. `https://abcdefgh.supabase.co`)
- **`service_role` secret key** → `SUPABASE_SERVICE_ROLE_KEY`

> ⚠️ The service role key bypasses all row-level security. It is only ever read server-side in this app (`lib/supabase.ts`), but never expose it client-side, commit it, or paste it anywhere public.

---

## Part 2 — Prepare the database (from your machine)

With Supabase ready, point your local checkout at it to run migrations and seed.

### 2.1 Environment file

```bash
cp .env.example .env
```

Fill in every value:

```bash
DATABASE_URL="…6543/postgres?pgbouncer=true"   # from 1.2
DIRECT_URL="…5432/postgres"                    # from 1.2
JWT_SECRET=""                                  # generate below
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
NEXT_PUBLIC_SUPABASE_URL="https://[project-ref].supabase.co"
SUPABASE_SERVICE_ROLE_KEY="…"
SUPABASE_STORAGE_BUCKET="portfolio-assets"
NEXT_PUBLIC_TRACK_PRIVATE_IPS=""               # leave unset in production
```

Generate the JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2.2 Apply migrations

```bash
npm install
npx prisma migrate deploy
```

`migrate deploy` applies the committed migrations in `prisma/migrations/` in order — it never generates new ones and is safe to re-run (already-applied migrations are skipped).

### 2.3 Seed the admin user and starter content

The seed script creates the `admin` user (password from `ADMIN_SEED_PASSWORD`) plus initial personal info, skills, experiences, achievements, certifications, and contact cards. It upserts, so re-running it won't duplicate content — and re-running with a new `ADMIN_SEED_PASSWORD` is also how you **reset the admin password**.

```bash
# bash
ADMIN_SEED_PASSWORD='choose-a-strong-password' npm run db:seed
```

```powershell
# PowerShell
$env:ADMIN_SEED_PASSWORD = 'choose-a-strong-password'; npm run db:seed
```

### 2.4 Verify locally

```bash
npm run dev
```

- `http://localhost:3000` — public site renders (sections show data from the seed).
- `http://localhost:3000/api/health` — reports database connectivity.
- `http://localhost:3000/dashboard/login` — sign in as `admin` with your seed password; try uploading an image to confirm the storage bucket works, then change your password from the dashboard header menu.

---

## Part 3 — Deploy to Vercel

### 3.1 Import the repository

1. Push the repo to GitHub.
2. [vercel.com/new](https://vercel.com/new) → import the repository.
3. Framework preset: **Next.js** (auto-detected). The default build command runs `npm run build`, which is already `prisma generate && next build`.

### 3.2 Environment variables

In the import screen (or later under **Project → Settings → Environment Variables**), add — for the **Production** environment:

| Variable | Value |
|---|---|
| `DATABASE_URL` | pooled string, port `6543`, with `?pgbouncer=true` |
| `DIRECT_URL` | direct/session string, port `5432` |
| `JWT_SECRET` | your generated secret |
| `NEXT_PUBLIC_BASE_URL` | your production URL, e.g. `https://riomar.dev` |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://[project-ref].supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | service role key (mark as **Sensitive**) |
| `SUPABASE_STORAGE_BUCKET` | `portfolio-assets` |

Two things that bite people:

- **`NEXT_PUBLIC_*` values are baked in at build time.** Changing them later requires a redeploy, not just a restart.
- **`NEXT_PUBLIC_SUPABASE_URL` must be set before the first build** — `next.config.ts` reads it during the build to allow your Supabase hostname in the Content-Security-Policy `img-src` and in `images.remotePatterns`. If it's missing at build time, uploaded images will be blocked on the deployed site.

### 3.3 Run migrations on deploy (recommended)

Vercel doesn't run migrations by itself. Override the **Build Command** in Project Settings:

```bash
npx prisma migrate deploy && npm run build
```

Every deploy then applies any new committed migrations before building. (Alternative: skip the override and run `npx prisma migrate deploy` manually from your machine with production env vars whenever you add a migration — fine for a single-developer project, easy to forget.)

### 3.4 Deploy and verify

Click **Deploy**, then check:

1. `https://your-app.vercel.app/api/health` — database status is healthy.
2. Public pages render your content.
3. `/dashboard/login` — log in, upload an image, confirm it appears on the public site (ISR revalidation makes CMS edits show immediately).

### 3.5 Custom domain

1. **Project → Settings → Domains** → add your domain (e.g. `riomar.dev`) and follow the DNS instructions (A/ALIAS/CNAME at your registrar).
2. Update `NEXT_PUBLIC_BASE_URL` to the custom domain and **redeploy**.
3. Note: `app/sitemap.ts` hardcodes `https://riomar.dev` — update it if you deploy under a different domain.

---

## Ongoing workflow

**Content changes** need no deploys — everything is edited in `/dashboard` and served from the database.

**Schema changes:**

```bash
# 1. Edit prisma/schema.prisma
# 2. Create a migration against your dev database
npm run db:migrate        # prisma migrate dev — prompts for a migration name
# 3. Commit the new folder under prisma/migrations/ and push
# 4. Vercel build runs `prisma migrate deploy` (per 3.3) and applies it
```

**Admin password reset:** re-run the seed (2.3) with a new `ADMIN_SEED_PASSWORD`, or use the dashboard's Change Password once logged in.

---

## Troubleshooting

| Symptom | Cause / fix |
|---|---|
| `prepared statement "s0" already exists` | `DATABASE_URL` is missing `?pgbouncer=true` on the transaction pooler (port 6543). |
| `P1001: Can't reach database server` | Wrong host/port, or the project is paused (free tier pauses after inactivity — open the Supabase dashboard to wake it). |
| Migrations hang or fail with `P1002` | You pointed `DIRECT_URL` at the transaction pooler. Migrations need port `5432`. |
| Images upload but don't display in production | `NEXT_PUBLIC_SUPABASE_URL` wasn't set at build time (CSP blocks the host), or the bucket isn't public. Set the var and redeploy. |
| `401` / logged out after redeploy | `JWT_SECRET` changed between deploys — sessions signed with the old secret become invalid. Keep it stable. |
| `Upload failed: …` from the dashboard | Bucket name mismatch with `SUPABASE_STORAGE_BUCKET`, or `SUPABASE_SERVICE_ROLE_KEY` is wrong/expired. |
| Local `prisma generate` fails with `EPERM … query_engine-windows.dll.node` | The dev server is holding the engine DLL (Windows). Stop `npm run dev`, regenerate, restart. |
| Visitor logs empty while testing locally | Localhost/private IPs are skipped by design. Set `NEXT_PUBLIC_TRACK_PRIVATE_IPS="true"` locally only. |

## Security checklist

- [ ] `JWT_SECRET` is long, random, and different from any example value
- [ ] `SUPABASE_SERVICE_ROLE_KEY` exists only in server env vars (Vercel/`.env`), never in client code or git
- [ ] `.env` is gitignored (only `.env.example` is committed)
- [ ] Admin password is strong; login lockout is built in (failed attempts lock the account temporarily)
- [ ] `NEXT_PUBLIC_TRACK_PRIVATE_IPS` is unset in production
