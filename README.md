# Portfolio + CMS

A self-hosted developer portfolio with a built-in admin dashboard. The public site is fully database-driven — every section (profile, skills, projects, experience, awards, certifications, contact) is edited from a private CMS at `/dashboard`, with zero redeploys for content changes.

Brutalist / mono aesthetic, dark-mode aware, no CSS framework beyond Tailwind.

## Features

**Public site**
- Hero, About, Skills, Work, Experience, Awards, Certifications, Contact sections
- Dedicated `/projects` and `/experience` pages
- ISR caching (`revalidate = 60`) with instant cache busting on CMS edits
- Empty states everywhere — a fresh database renders cleanly

**CMS (`/dashboard`)**
- JWT auth with refresh tokens, login lockout after failed attempts, login history
- CRUD for all portfolio content with modal forms
- Image uploads to Supabase Storage with **drag-to-reposition focal point** (with snap-to-center guides), **zoom slider (1–3×)**, and live preview — crops render identically on the public site via `object-position` + `transform: scale()`
- Separate profile-photo editor with 1:1 preview
- Visitor analytics: page views with geo lookup, top countries/pages/sources, daily chart
- Tracking links (`/clicked?from=…`) to attribute visits from resumes, job applications, LinkedIn, etc.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, React 19) |
| Database | PostgreSQL (Supabase) via Prisma |
| File storage | Supabase Storage (public bucket, server-side uploads) |
| Auth | JWT (`jose`) + bcrypt, refresh-token rotation |
| Styling | Tailwind CSS 4 |
| Charts | Recharts (visitor dashboard) |

## Quick start

```bash
# 1. Install
npm install

# 2. Configure — see .env.example for every variable
cp .env.example .env

# 3. Apply database migrations
npx prisma migrate deploy

# 4. Seed the admin user + starter content
ADMIN_SEED_PASSWORD='choose-a-strong-password' npm run db:seed

# 5. Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the site and [http://localhost:3000/dashboard/login](http://localhost:3000/dashboard/login) for the CMS (username `admin`, password from step 4).

You'll need a Supabase project for the database and storage bucket first — the [Deployment Guide](docs/deployment.md) walks through it from scratch.

## Deployment

- **Supabase + Vercel** — full walkthrough in [docs/deployment.md](docs/deployment.md)
- **Docker / self-hosted** — see [docs/docker.md](docs/docker.md) (standalone Next.js build, `build.sh` for zero-downtime rebuilds)

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | `prisma generate` + production build |
| `npm run db:migrate` | Create a new migration from schema changes (dev) |
| `npm run db:push` | Push schema without a migration (prototyping) |
| `npm run db:seed` | Seed admin user + starter content (needs `ADMIN_SEED_PASSWORD`) |
| `npm run db:studio` | Prisma Studio |
| `npm run lint` / `lint:fix` | ESLint |
| `npm run format` | Prettier |

## Project structure

```
app/
  page.tsx               # Home (ISR, DB-driven)
  projects/  experience/ # Public detail pages
  dashboard/             # CMS (client) + /dashboard/login
  api/                   # REST routes: content CRUD, auth, upload, visitor, health
  clicked/               # Tracking-link redirect endpoint
components/
  *.tsx                  # Public site sections
  dashboard/             # CMS UI: sections, modal forms, shared ui.tsx (ImagePicker…)
lib/
  auth.ts  prisma.ts  supabase.ts  validate.ts  image.ts  api-helpers.ts
  dashboard/             # CMS context, API client, types
prisma/
  schema.prisma  migrations/  seed.ts
docs/
  deployment.md  docker.md
```

## Making it your own

Content lives in the database, so most personalization happens in the CMS. The few hardcoded places to edit:

1. **`app/layout.tsx`** — site metadata: title, description, keywords, author, OpenGraph/Twitter fields, `metadataBase` URL
2. **Branding strings** — the `riomar.dev_` wordmark in `components/Navbar.tsx`, `app/dashboard/login/page.tsx`, and `components/dashboard/DashboardHeader.tsx`
3. **`app/sitemap.ts`** and **`public/robots.txt`** — hardcoded domain
4. **`prisma/seed.ts`** — replace the starter identity, experiences, achievements, and certifications with your own (or seed and edit everything in the CMS afterwards)
5. **`public/profile.jpg`** — fallback profile photo
6. **The design** — please make it yours. If you build your portfolio on this codebase, restyle it with your own visual identity (typography, colors, layout, wordmark) instead of shipping the brutalist/mono look as-is. A portfolio should represent you — and this design already represents someone else's.

> Forking note: this repository's git history contains the original author's content. For a clean start, copy the working tree into a fresh `git init` instead of forking.

## License

Personal project. You're welcome to learn from the code and use it as a starting point — but **please use your own design and your own content**.
