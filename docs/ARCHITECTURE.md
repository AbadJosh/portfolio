# Architecture Overview

> Current state as of May 2026. Validate against Next.js 16, React 19, and Tailwind v4 best practices.

---

## 1. Application Type

**Single-Page Application (SPA)** served by Next.js App Router.

All content lives on one scrollable page (`/`). Navigation is hash-anchor-based — clicking a nav link calls `scrollIntoView()` rather than changing routes. The only true server boundary is the `/api/contact` POST endpoint.

---

## 2. Directory Structure

```
data-engineering-portfolio/
├── app/
│   ├── layout.tsx            # Root layout — metadata, font, body class
│   ├── page.tsx              # Home page — composes all sections
│   ├── globals.css           # Global resets + design-system classes
│   └── api/
│       └── contact/
│           └── route.ts      # POST /api/contact — Resend email handler
│
├── components/
│   ├── Navbar.tsx            # Fixed nav, scroll detection, mobile menu
│   ├── Hero.tsx              # Full-viewport hero with typewriter
│   ├── About.tsx             # Bio + vertical experience timeline
│   ├── Skills.tsx            # Categorized skill pills grid
│   ├── Projects.tsx          # Six-card portfolio grid
│   ├── Resume.tsx            # Jobs + certs + education
│   ├── Contact.tsx           # Form + info cards
│   ├── Footer.tsx            # Simple centered footer
│   └── icons.tsx             # GithubIcon, LinkedinIcon SVGs
│
└── public/
    ├── hero.png              # Background illustration (~2 MB)
    └── jda-logo.png          # Navbar logo (~66 KB)
```

---

## 3. Component Tree

```
RootLayout (app/layout.tsx)
└── Home (app/page.tsx)
    ├── Navbar
    ├── main
    │   ├── Hero       — id="home"
    │   ├── About      — id="about"
    │   ├── Skills     — id="skills"
    │   ├── Projects   — id="projects"
    │   ├── Resume     — id="resume"
    │   └── Contact    — id="contact"
    └── Footer
```

All components are `"use client"` — there are **no React Server Components** in use.

---

## 4. Routing

| Path | Handler | Notes |
|------|---------|-------|
| `/` | `app/page.tsx` | SPA home |
| `/api/contact` | `app/api/contact/route.ts` | POST only |

Navigation between sections uses the browser's native `scrollIntoView({ behavior: "smooth" })`. The URL does not change on section scroll; there is no hash-based routing library.

---

## 5. Data Flow

```
User fills Contact form
        │
        ▼
Contact.tsx (client)
  fetch POST /api/contact
  { name, email, subject, message }
        │
        ▼
app/api/contact/route.ts (server)
  1. Parse JSON body
  2. Validate all fields present
  3. resend.emails.send({ from, to, replyTo, subject, html })
        │
        ▼
Resend API → Gmail inbox
```

This is the only client→server interaction in the entire app.

---

## 6. State Management

**No global state library.** Everything is local `useState` inside each component.

| Component | State |
|-----------|-------|
| Navbar | `scrolled`, `mobileOpen`, `active` (current section) |
| Contact | `form` (fields), `status` (idle/sending/success/error), `errorMsg` |
| All sections | Animation entry state via Framer Motion `useInView` |

There is no React Context, Redux, Zustand, or Jotai.

---

## 7. Styling System

**Tailwind CSS v4** + custom global CSS classes.

Due to Tailwind v4 cascade specificity issues, reusable interactive styles are defined as plain CSS classes outside `@layer` (with `!important` where needed):

| Class | Purpose |
|-------|---------|
| `.btn-primary` | Blue-to-violet gradient CTA button |
| `.btn-ghost` | Semi-transparent ghost button |
| `.card` | Dark card with border hover glow |
| `.gradient-text` | Blue-to-purple gradient text clip |
| `.section-heading` | Fluid clamp font-size heading |
| `.section-subheading` | Blue accent subheading |

**Color tokens** (not in a Tailwind config, defined ad-hoc in components):

| Token | Value | Use |
|-------|-------|-----|
| Background | `#050b18` | Page bg |
| Surface | `#0a1228` | Card bg |
| Border | `#1e3a5f` | Default borders |
| Text | `#e2e8f0` | Body text |
| Accent blue | `#3b82f6` | Links, highlights |
| Accent violet | `#8b5cf6` | Gradient secondary |

Responsive layout uses Tailwind breakpoint classes (`sm:`, `md:`, `lg:`). The Navbar burger toggle uses an injected `<style>` tag with a raw `@media` rule due to the cascade issues.

---

## 8. Animation Architecture

All animations are driven by **Framer Motion**.

- **Entry animations**: `useInView()` hook triggers `animate` when the element enters the viewport. Each section stagger-delays children by `i * 0.07–0.09s`.
- **Mount animations**: Hero elements fade+slide in on first render.
- **Layout transitions**: Navbar background and mobile menu use `AnimatePresence`.
- **CSS-only**: Availability badge pulsing green dot uses a CSS `@keyframes pulse`.

---

## 9. Third-Party Dependencies

| Package | Version | Role |
|---------|---------|------|
| `next` | 16.2.6 | Framework |
| `react` / `react-dom` | 19.2.4 | UI runtime |
| `framer-motion` | ^12 | Animations + scroll detection |
| `react-type-animation` | ^3.2 | Typewriter in Hero |
| `lucide-react` | ^1.16 | UI icons |
| `resend` | ^6.12 | Email delivery |
| `swiper` | ^12.1 | Carousel *(CSS imported, not actively used)* |
| `tailwindcss` | ^4 | Utility CSS |
| `typescript` | ^5 | Type checking |

---

## 10. Environment Variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `RESEND_API_KEY` | Yes | Authenticates Resend email sends |

No database, no auth tokens, no feature flags. The key is loaded only server-side in the API route.

---

## 11. Build & Deployment

- **Dev**: `next dev` (Turbopack in Next.js 16)
- **Build**: `next build` → static + serverless output
- **Deploy**: Vercel (`.vercel` in `.gitignore`; `onboarding@resend.dev` sender domain = Resend sandbox, not a custom domain)
- **Fonts**: Google Inter loaded via `next/font/google` at build time (no runtime fetch)

---

## 12. Possible Improvements & Design Pattern Additions

### A. Performance

**1. Use `next/image` for assets**
`hero.png` (~2 MB) and `jda-logo.png` are loaded via plain `<img>` tags. Switching to `<Image>` gives automatic WebP conversion, lazy loading, blur placeholders, and bandwidth savings.

**2. Remove unused Swiper CSS**
Swiper is imported in `globals.css` but never used in any component, adding ~30 KB of CSS to the bundle. Remove the imports and the dependency.

**3. Code-split heavy sections**
`Projects`, `Resume`, and `Contact` are loaded immediately even if the user never scrolls. Wrapping them in `React.lazy` + `Suspense` defers their JavaScript until needed.

---

### B. Architecture & Patterns

**4. Introduce React Server Components**
Sections like `About`, `Skills`, `Projects`, and `Resume` contain only static data — they have no click handlers, no state, and no real-time data. The only reason they are `"use client"` is Framer Motion `useInView`. Splitting into a server-rendered shell + a thin client wrapper for animations is the correct pattern and shrinks the client bundle significantly.

```tsx
// Server component (no "use client")
export default function ProjectsSection() {
  return <ProjectsGrid projects={projectsData} />;
}

// Client wrapper — only the animation layer
"use client";
export function ProjectsGrid({ projects }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  // ...
}
```

**5. Extract scroll/observer logic into custom hooks**
`Navbar.tsx` has ~40 lines of `useEffect`/`IntersectionObserver` logic inline. This should live in a custom hook:

```ts
// hooks/useActiveSection.ts
export function useActiveSection(sectionIds: string[]): string { ... }
```

**6. Share Contact form types between client and API**
The form fields (`name`, `email`, `subject`, `message`) are defined implicitly in the component and destructured in the route without a shared type. Adding a shared type in `types/contact.ts` removes the duplication.

**7. Validate API input with Zod**
The current validation is `if (!name || !email || !subject || !message)`. This doesn't validate email format, max lengths, or types. Zod adds one dependency and proper typed schemas:

```ts
const ContactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(200),
  subject: z.string().min(1).max(200),
  message: z.string().min(1).max(5000),
});
```

**8. Extract contact form fetch logic into a service function**
`Contact.tsx` has the fetch call inline inside the submit handler. This makes it harder to test or reuse. A `services/contact.ts` function with a typed return value separates the concern.

**9. Add a barrel export for components**
Currently each page/component does `import Navbar from "@/components/Navbar"`. An `index.ts` in `/components` makes imports cleaner, though this is a low-priority cosmetic change.

---

### C. Developer Experience

**10. Validate environment variables at startup**
If `RESEND_API_KEY` is missing, the API route silently creates a Resend client that will fail at send time with an unhelpful error. Adding a startup validation (e.g., using `@t3-oss/env-nextjs`) surfaces misconfigured environments immediately at build time.

**11. Add test coverage**
There is zero test coverage. At minimum, the API route should have integration tests (verify validation rejects bad input, verify success path). Playwright or Cypress E2E tests for the contact form submission flow would also guard against regressions.

**12. Add ESLint rules for `"use client"` overuse**
A rule like `eslint-plugin-react-server-components` can warn when a `"use client"` boundary is larger than necessary.

---

### D. UX & SEO

**13. Add `og:image` to metadata**
`app/layout.tsx` has Open Graph title and description but no `og:image`. Link previews on LinkedIn and Twitter will show no image. A 1200×630 social card image in `public/` and a metadata entry fixes this.

**14. Add `robots.txt` and `sitemap.xml`**
There is no crawl control file. Next.js 16 generates these via `app/robots.ts` and `app/sitemap.ts` — both are one-liners.

**15. Add a skip-to-content link**
For keyboard users, a visually-hidden `<a href="#home">Skip to content</a>` as the first focusable element is a baseline accessibility requirement.

**16. Add ARIA live region for form status**
The contact form success/error message appears in the DOM but is not announced to screen readers. Wrapping it in `role="status"` or `aria-live="polite"` fixes this.

**17. Add Vercel Analytics or a lightweight alternative**
There is no analytics. Vercel's built-in analytics takes two lines to install and has zero tracking consent concerns for simple page-view data.
