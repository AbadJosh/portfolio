# Learning Guide — Portfolio Tech Stack

> Start here if you are unfamiliar with any part of this project. Everything you need to run, understand, and extend the site is listed below.

---

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment file and fill in the key
cp .env.example .env.local

# Run dev server
npm run dev
# → http://localhost:3000

# Type check
npx tsc --noEmit

# Lint
npm run lint

# Build for production
npm run build
```

---

## 1. Next.js 16 (App Router)

**Official docs:** `node_modules/next/dist/docs/` (check this repo's AGENTS.md — it is required reading before touching Next.js code here)

### Key concepts used in this project

| Concept | Where |
|---------|-------|
| App Router (`app/` directory) | All routing lives in `app/` |
| Root Layout | `app/layout.tsx` — wraps every page |
| Page component | `app/page.tsx` — the `/` route |
| API Route Handler | `app/api/contact/route.ts` |
| Metadata API | `export const metadata` in `layout.tsx` |
| `next/font/google` | Inter font loaded at build time |

### What you need to know

**File-based routing:** The `app/` directory IS the router. A file at `app/foo/page.tsx` creates the `/foo` route. A file at `app/foo/route.ts` creates an API endpoint at `/foo`.

**Server vs Client components:** By default, every component in the `app/` directory is a React Server Component (runs on the server, zero JS sent to the browser). To use browser APIs (`window`, `document`, event handlers, hooks like `useState`), you must add `"use client"` at the top of the file. Every component in this project uses `"use client"` — this is a starting point, not the final architecture.

**Route Handlers:** `app/api/contact/route.ts` exports named async functions that match HTTP verbs: `export async function POST(request: NextRequest) { ... }`. This replaces the old `pages/api/` pattern.

**Metadata:** `export const metadata: Metadata = { ... }` in a layout or page file injects `<head>` tags automatically — no manual `<Head>` component needed.

### Things that are different from Next.js 12/13
- No `pages/` directory in this project
- No `getServerSideProps` or `getStaticProps` — data fetching happens inside Server Components via `async/await`
- `next/image` is strongly preferred over `<img>` for performance
- Fonts are loaded via `next/font`, not a Google Fonts `<link>` tag

---

## 2. React 19

**What changed from React 18:**
- `use()` hook for reading Promises and Context in render
- Improved hydration error messages
- `ref` as a prop (no more `forwardRef`)
- Server Components are a first-class concept

**What this project uses:**
Standard React 18-compatible patterns (`useState`, `useEffect`, `useRef`, `useCallback`). No React 19-specific features are actively used yet — the version is 19 but the code is compatible with 18.

**The `suppressHydrationWarning` on `<body>`** in `layout.tsx` tells React not to warn when the server-rendered and client-rendered HTML differ on that element (common with scroll state and browser extensions).

---

## 3. TypeScript 5

**Config file:** [tsconfig.json](../tsconfig.json)

**Key settings in this project:**
- `strict: true` — all strict checks enabled (null checks, implicit any, etc.)
- `paths: { "@/*": ["./*"] }` — import alias so `import X from "@/components/X"` works from anywhere
- `target: "ES2017"` — compiled output is compatible with modern browsers

**What you need for this codebase:**
- Know how to type `React.FC` vs function return types
- Understand `NextRequest` and `NextResponse` types from `next/server`
- Read `Metadata` type from `next` for the layout file

---

## 4. Tailwind CSS v4

**This version has breaking changes from v3.** Do not assume v3 knowledge applies.

**What changed:**
- Configuration moved from `tailwind.config.js` to CSS (`@theme` in the stylesheet)
- `@layer components` has lower cascade specificity than browser UA defaults — this is why `.btn-primary` and `.card` in `globals.css` are defined outside any `@layer` and use `!important`
- PostCSS plugin is now `@tailwindcss/postcss` (separate package)
- Utility class names are mostly the same but check the v4 changelog for renamed utilities

**In this project:**
- `globals.css` starts with `@import "tailwindcss"` — this replaces the old `@tailwind base; @tailwind components; @tailwind utilities;` directives
- Responsive variants (`sm:`, `md:`, `lg:`) work the same as v3
- Custom classes that need to override browser defaults are written as plain CSS with `!important` outside `@layer`
- The Navbar burger menu uses a raw `<style>` tag injected via JSX — this was a workaround for the cascade issue

---

## 5. Framer Motion

**Used for:**
- Scroll-triggered entrance animations (`useInView`)
- Mount/unmount transitions (`AnimatePresence`)
- Coordinated stagger animations across section children

**Core API you'll encounter:**

```tsx
import { motion, useInView, AnimatePresence } from "framer-motion";

// Animated element
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, delay: 0.2 }}
/>

// Trigger animation when element enters viewport
const ref = useRef(null);
const inView = useInView(ref, { once: true });
<motion.div ref={ref} animate={inView ? "visible" : "hidden"} />

// Animate presence/absence
<AnimatePresence>
  {isOpen && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    />
  )}
</AnimatePresence>
```

**Performance note:** Framer Motion components require `"use client"`. This is the primary reason all section components in this project are client components.

---

## 6. Resend (Email)

**Dashboard:** [resend.com](https://resend.com) — log in to check sending logs and API key.

**How it works in this project:**
1. User submits the contact form
2. `Contact.tsx` POSTs JSON to `/api/contact`
3. The route handler calls `resend.emails.send({ from, to, replyTo, subject, html })`
4. Resend delivers the email via SMTP

**Current sender domain:** `onboarding@resend.dev` (Resend sandbox). For production, verify a custom domain in the Resend dashboard and update `from` in [route.ts](../app/api/contact/route.ts#L15).

**Environment variable:**
```
RESEND_API_KEY=re_xxxxxxxx
```
Get this from the Resend dashboard under API Keys.

**Resend free tier:** 100 emails/day, 3,000/month.

---

## 7. Lucide React (Icons)

**Usage:**
```tsx
import { ArrowRight, Download, Menu, X } from "lucide-react";
<ArrowRight size={16} className="..." />
```

Find all available icons at [lucide.dev](https://lucide.dev). Version `^1.16` is installed — the icon names are stable but check the changelog if an import fails.

Custom GitHub and LinkedIn SVGs live in [components/icons.tsx](../components/icons.tsx) because Lucide's versions don't match the brand guidelines.

---

## 8. ESLint (Flat Config)

**Config file:** [eslint.config.mjs](../eslint.config.mjs)

This project uses the **ESLint 9 flat config** format, not the old `.eslintrc`. Rules come from `next/core-web-vitals` + `next/typescript`.

Run: `npm run lint`

Common issues the linter catches:
- Missing `key` props in lists
- `useEffect` dependency array warnings
- Unused imports

---

## 9. Project Conventions

**Component structure:**
All components are in `/components`. Each is a single file with a default export. No index barrel file exists yet.

**Styling rule:**
Use Tailwind utility classes for layout and spacing. For interactive states (hover, focus) on custom elements, write plain CSS in `globals.css` outside `@layer` to avoid cascade issues. For one-off responsive breakpoints in a component, prefer an injected `<style>` tag over Tailwind's `md:` prefix if the prefix is unreliable.

**Path alias:**
Use `@/` for imports from the project root: `import X from "@/components/X"`.

**No global state:**
Keep state local. If two components need to share state, lift it to their common parent (currently `app/page.tsx`).

---

## 10. Deployment (Vercel)

1. Push to GitHub
2. Import the repo in [vercel.com/new](https://vercel.com/new)
3. Add environment variable: `RESEND_API_KEY` in Project Settings → Environment Variables
4. Deploy — Vercel auto-detects Next.js and configures the build

**Build command:** `next build` (set automatically by Vercel)  
**Output:** Static pages + serverless functions for API routes  
**Domain:** Configure a custom domain in Vercel dashboard

After deployment, verify the contact form works by submitting a test message and checking your Gmail inbox.

---

## 11. Recommended Learning Order

If you are new to the stack, go through these in order:

1. **TypeScript basics** — [typescriptlang.org/docs/handbook](https://www.typescriptlang.org/docs/handbook/intro.html) (2 hours)
2. **React fundamentals** — `useState`, `useEffect`, `useRef`, component composition (1 day)
3. **Next.js App Router tutorial** — [nextjs.org/learn](https://nextjs.org/learn) official interactive tutorial (4 hours)
4. **Tailwind CSS v4 docs** — [tailwindcss.com/docs](https://tailwindcss.com/docs) — especially the "What's new in v4" section
5. **Framer Motion intro** — [motion.dev/docs/react-quick-start](https://motion.dev/docs/react-quick-start) — `motion`, `AnimatePresence`, `useInView` is all you need for this project
6. **Resend quickstart** — [resend.com/docs/send-with-nextjs](https://resend.com/docs/send-with-nextjs) — matches exactly how this project is wired

---

## 12. Common Gotchas

| Gotcha | What happens | How to avoid |
|--------|-------------|-------------|
| Forgetting `"use client"` | Hooks throw `Error: hooks can only be called inside a Client Component` | Add `"use client"` at top of any file using `useState`, `useEffect`, `useRef`, or Framer Motion |
| Tailwind class not applying | Style is overridden by browser or another rule | Write the style as inline CSS or add it to `globals.css` outside `@layer` |
| `RESEND_API_KEY` not set | API route returns 500 with no useful error | Ensure `.env.local` exists with the key before running `npm run dev` |
| `next/image` vs `<img>` | `<img>` has no optimization; Next.js lint warns about it | Use `<Image>` from `next/image` for all images in `/public` |
| `useInView` not triggering | Element already visible on mount, `once: true` fires immediately | Test scroll animations by resizing the window or using Chrome's mobile device emulator |
| Hot reload breaks state | Dev server HMR re-mounts components and resets `useState` | Normal in development; `useEffect` dependencies are your source of truth |
