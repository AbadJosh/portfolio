# Joshua D. Abad — Portfolio

Personal portfolio site for a Data Engineer based in the Philippines. Built with Next.js 16, React 19, and Tailwind CSS v4. Features animated sections, a working contact form, and a dark cyberpunk aesthetic.

**Live site:** [abadjoshua.dev](https://abadjoshua.dev)

---

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19 + TypeScript 5 |
| Styling | Tailwind CSS v4 + Framer Motion |
| Email | Resend |
| Deployment | Vercel |

---

## Sections

- **Hero** — Typewriter tagline, CTA buttons
- **About** — Bio + experience timeline
- **Skills** — Categorized skill pills
- **Projects** — Six-card project grid
- **Resume** — Jobs, certs, and education
- **Contact** — Form with rate limiting, CSRF protection, and honeypot spam guard

---

## Getting Started

**Prerequisites:** Node.js 18+

```bash
npm install
cp .env.example .env.local   # fill in the keys
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

| Variable | Required | Purpose |
|---|---|---|
| `RESEND_API_KEY` | Yes | Resend email delivery |
| `CONTACT_EMAIL` | Yes | Destination inbox for contact form |
| `CONTACT_FROM` | Yes | Sender address (must be verified in Resend) |

### Commands

| Command | Description |
|---|---|
| `npm run dev` | Start dev server (Turbopack) |
| `npm run build` | Production build |
| `npm start` | Run production build |
| `npm run lint` | ESLint check |

---

## Deployment

1. Push to GitHub
2. Import the repo at [vercel.com/new](https://vercel.com/new)
3. Add the three environment variables under **Project Settings → Environment Variables**
4. Deploy — Vercel auto-detects Next.js

---

## License

MIT
