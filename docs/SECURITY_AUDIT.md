# Security Audit — Portfolio Site

> Audit scope: deployed Next.js 16 SPA + `/api/contact` serverless route.  
> Last updated: May 2026. Performed on source code, not live traffic.

---

## Risk Summary

| # | Finding | Severity | Status |
|---|---------|----------|--------|
| 1 | HTML injection in email template | High | ✅ Fixed (Audit 1) |
| 2 | No rate limiting on contact endpoint | High | ✅ Fixed (Audit 2) |
| 3 | No email format validation | Medium | ✅ Fixed (Audit 2) |
| 4 | Missing HTTP security headers | Medium | ✅ Fixed (Audit 2) |
| 5 | No input length limits | Medium | ✅ Fixed (Audit 1) |
| 6 | No CSRF protection on contact endpoint | Medium | ✅ Fixed (Audit 2) |
| 7 | No subject sanitization | Medium | ✅ Fixed (Audit 2) |
| 8 | No env var validation at startup | Medium | ✅ Fixed (Audit 2) |
| 9 | Personal email hardcoded in source | Low | ✅ Fixed (Audit 3) |
| 10 | Sender domain is Resend sandbox | Low | ✅ Fixed (Audit 3) |
| 11 | No bot / spam protection | Low | ✅ Fixed (Audit 3) |
| 12 | PostCSS XSS (GHSA-qx2v-qp2m-jg93) | Medium | ✅ Fixed (Audit 3) |
| 13 | Unused `swiper` dependency surface area | Informational | ✅ Fixed (Audit 3) |
| 14 | No `robots.txt` | Informational | ✅ Fixed (Audit 3) |

**All findings resolved. Zero npm audit vulnerabilities.**

---

## Audit 3 Fixes (May 2026)

### Fix G — Env Vars for Email Addresses (Finding 9 + 10)

**Files:** [app/api/contact/route.ts](../app/api/contact/route.ts), [.env.local](../.env.local), [.env.example](../.env.example)

`joshua.abad.development@gmail.com` and the Resend sender address are no longer hardcoded in source. Both are read from environment variables at startup via a typed `requireEnv` helper:

```ts
function requireEnv(name: string): string {
  const val = process.env[name];
  if (!val) throw new Error(`${name} environment variable is not set`);
  return val;
}

const resend = new Resend(requireEnv("RESEND_API_KEY"));
const contactEmail = requireEnv("CONTACT_EMAIL");
const contactFrom  = requireEnv("CONTACT_FROM");
```

Update `.env.local` to change the destination inbox or switch from the Resend sandbox to a verified custom domain:

```
CONTACT_EMAIL=you@yourdomain.com
CONTACT_FROM=Your Name <noreply@yourdomain.dev>
```

---

### Fix H — Honeypot Spam Protection (Finding 11)

**Files:** [components/Contact.tsx](../components/Contact.tsx), [app/api/contact/route.ts](../app/api/contact/route.ts)

A visually-hidden `website` field is added to the form. Real users never see or fill it; bots auto-populate it. If the field arrives non-empty, the server returns a silent `200 OK` (so bots don't know they were caught).

**Client** — off-screen input, `tabIndex={-1}`, `aria-hidden`:
```tsx
<div style={{ position: "absolute", left: "-9999px", opacity: 0, pointerEvents: "none" }} aria-hidden="true">
  <input type="text" name="website" tabIndex={-1} autoComplete="off" ... />
</div>
```

**Server** — silent reject:
```ts
if (website) {
  return NextResponse.json({ message: "Message sent successfully." });
}
```

---

### Fix I — PostCSS XSS via `overrides` (Finding 12)

**File:** [package.json](../package.json)

`npm overrides` forces all nested PostCSS instances (including the one bundled inside Next.js 16.2.6) to resolve to `>=8.5.10`, patching GHSA-qx2v-qp2m-jg93 without upgrading or downgrading Next.js:

```json
"overrides": {
  "postcss": ">=8.5.10"
}
```

`npm audit` now reports **0 vulnerabilities**.

---

### Fix J — Removed Swiper (Finding 13)

`swiper` was listed in `dependencies` but not imported anywhere. Removed with `npm uninstall swiper` — eliminated 5 packages and ~30 KB from the dependency tree.

---

### Fix K — Added robots.ts (Finding 14)

**File:** [app/robots.ts](../app/robots.ts) *(new)*

```ts
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
  };
}
```

Serves `GET /robots.txt` and makes crawl intent explicit. Add a `sitemap` entry once a custom domain is deployed.

---

## Audit 2 Fixes (May 2026)

### Fix A — Rate Limiting (Finding 2)

**File:** [app/api/contact/route.ts](../app/api/contact/route.ts)

In-memory rate limiter: **5 requests per IP per hour**. Subsequent requests receive HTTP 429.

> **Note:** For production on Vercel with multiple serverless instances, replace the in-memory Map with Upstash Redis + `@upstash/ratelimit` for distributed enforcement.

---

### Fix B — CSRF Protection (Finding 6)

**File:** [app/api/contact/route.ts](../app/api/contact/route.ts)

Origin header validated against the request `Host` header. Cross-origin POST requests are rejected with HTTP 403.

---

### Fix C — Stronger Email Validation (Finding 3)

**File:** [app/api/contact/route.ts](../app/api/contact/route.ts)

Replaced loose regex with RFC 5321 compliant pattern requiring a valid TLD.

---

### Fix D — Subject Sanitization (Finding 7)

**File:** [app/api/contact/route.ts](../app/api/contact/route.ts)

Subject validated against an allowlist of safe characters. Returns HTTP 400 on violation.

---

### Fix E — Security Headers via Middleware (Finding 4)

**File:** [middleware.ts](../middleware.ts) *(new)*

| Header | Value |
|--------|-------|
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `DENY` |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `geolocation=(), microphone=(), camera=()` |
| `Content-Security-Policy` | `default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'` |

> `next/font/google` self-hosts Inter at build time — no external font CDN domains needed.

---

### Fix F — Env Var Validation at Startup (Finding 8)

**File:** [app/api/contact/route.ts](../app/api/contact/route.ts)

`requireEnv()` helper throws immediately on missing vars instead of failing silently.

---

## What Is NOT Exposed

- **`RESEND_API_KEY`** — In `.env.local` (gitignored), never referenced client-side.
- **API route logic** — Server-only; Resend SDK never reaches the browser bundle.
- **No database credentials** — No database in this project.
- **No authentication tokens** — No auth system, no session secrets.
