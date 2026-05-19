# Security Audit — Portfolio Site

> Audit scope: deployed Next.js 16 SPA + `/api/contact` serverless route.  
> Date: May 2026. Performed on source code, not live traffic.

---

## Risk Summary

| # | Finding | Severity | Effort to Fix |
|---|---------|----------|---------------|
| 1 | HTML injection in email template | High | Low |
| 2 | No rate limiting on contact endpoint | High | Low |
| 3 | No email format validation | Medium | Low |
| 4 | Missing HTTP security headers | Medium | Low |
| 5 | No input length limits | Medium | Low |
| 6 | Personal email hardcoded in source | Low | Low |
| 7 | Sender domain is Resend sandbox | Low | Medium |
| 8 | No bot / spam protection | Low | Medium |
| 9 | Unused `swiper` dependency surface area | Informational | Low |
| 10 | No `robots.txt` | Informational | Low |

---

## Finding 1 — HTML Injection in Email Template (High)

**File:** [app/api/contact/route.ts](../app/api/contact/route.ts#L20-L34)

**What's happening:**
User-supplied `name`, `email`, `subject`, and `message` are interpolated directly into an HTML string that is sent as an email:

```ts
html: `
  ...
  <td ...>${name}</td>
  <td ...>${email}</td>
  <td ...>${subject}</td>
  <p ...>${message}</p>
  ...
`
```

**The risk:**
An attacker submits a form with a payload like:

```
name: <img src="https://attacker.com/track.gif" />
message: </p><h1 style="color:red">This email is compromised</h1>
```

The email client renders arbitrary HTML. Consequences:
- **Tracking pixels** — external image requests reveal your IP and email client metadata to the attacker's server.
- **Visual phishing** — the email body can be made to look like a legitimate warning or prompt.
- **CSS injection** — some email clients allow style injection that can obscure content or exfiltrate data via CSS tricks.

Gmail strips `<script>` tags but HTML/CSS injection still lands. The `white-space: pre-wrap` style on the `${message}` paragraph makes this worse.

**Fix:**
Escape HTML special characters before interpolation. A simple utility function:

```ts
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
```

Apply to every field: `escapeHtml(name)`, `escapeHtml(email)`, etc.

---

## Finding 2 — No Rate Limiting on `/api/contact` (High)

**File:** [app/api/contact/route.ts](../app/api/contact/route.ts)

**What's happening:**
The endpoint accepts any number of POST requests from any IP without restriction.

**The risk:**
- **Email bombing:** An attacker can loop-send to the endpoint, flooding your Gmail inbox with hundreds of contact emails within seconds.
- **Resend quota exhaustion:** The Resend free tier allows 100 emails/day and 3,000/month. A script sending 100 requests exhausts the daily quota in under a minute, making your contact form non-functional for the rest of the day.
- **Cost amplification:** On paid Resend plans, a sustained attack generates unexpected charges.

**Fix (Vercel deployment):**
Vercel provides built-in rate limiting via middleware. Add an `app/middleware.ts`:

```ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const requestCounts = new Map<string, { count: number; reset: number }>();
const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 3;

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/api/contact") {
    const ip = request.headers.get("x-forwarded-for") ?? "unknown";
    const now = Date.now();
    const record = requestCounts.get(ip);

    if (!record || now > record.reset) {
      requestCounts.set(ip, { count: 1, reset: now + WINDOW_MS });
    } else if (record.count >= MAX_REQUESTS) {
      return NextResponse.json(
        { error: "Too many requests. Please wait before trying again." },
        { status: 429 }
      );
    } else {
      record.count++;
    }
  }
  return NextResponse.next();
}

export const config = { matcher: ["/api/contact"] };
```

> Note: for production, use a persistent store like Upstash Redis instead of the in-memory `Map` (which resets on cold starts). The `@upstash/ratelimit` package has a drop-in Vercel integration.

---

## Finding 3 — No Email Format Validation (Medium)

**File:** [app/api/contact/route.ts](../app/api/contact/route.ts#L11)

**What's happening:**
The API checks `if (!email)` but does not validate that `email` is a syntactically valid email address. The value is then passed directly to `replyTo: email`.

**The risk:**
- A malformed or malicious `replyTo` value could cause unexpected behavior depending on how Resend's internals handle SMTP headers. SMTP header injection via `replyTo` has historically been a class of vulnerability.
- If someone submits `replyTo: ""` or `replyTo: "attacker@evil.com\nBcc: everyone@list.com"`, behavior depends entirely on Resend's SDK sanitizing this (which it likely does, but it's untested on your side).

**Fix:**
Add a regex or use Zod:

```ts
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
}
```

---

## Finding 4 — Missing HTTP Security Headers (Medium)

**What's happening:**
The site does not set any of the standard security response headers. Vercel injects some defaults, but several critical ones require explicit configuration.

**Headers missing or unverified:**

| Header | Risk Without It |
|--------|----------------|
| `X-Frame-Options: DENY` | Site can be embedded in an iframe on another domain (clickjacking) |
| `X-Content-Type-Options: nosniff` | Browser may MIME-sniff responses and execute unexpected content |
| `Content-Security-Policy` | No constraint on what scripts/styles/frames can load |
| `Referrer-Policy: strict-origin-when-cross-origin` | Full URL sent as Referer to third parties |
| `Permissions-Policy` | No restrictions on camera/microphone/geolocation APIs |

**Fix:**
Add a `headers()` export to `next.config.ts`:

```ts
const nextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline'",  // needed for Next.js inline scripts
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob:",
              "connect-src 'self'",
              "frame-ancestors 'none'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};
```

> Verify with [securityheaders.com](https://securityheaders.com) after deployment.

---

## Finding 5 — No Input Length Limits (Medium)

**File:** [app/api/contact/route.ts](../app/api/contact/route.ts#L11)

**What's happening:**
There are no maximum length checks on any field. A request with a 10 MB `message` body is accepted.

**The risk:**
- Large payloads consume memory in the serverless function (Vercel default limit: 4.5 MB request body).
- A targeted payload near the limit could cause the function to fail with a 500, making the form appear broken.
- The oversized content gets forwarded to Resend, which may reject it or create an enormous email.

**Fix:**
Check body size and add per-field max lengths:

```ts
if (name.length > 100 || email.length > 200 || subject.length > 200 || message.length > 5000) {
  return NextResponse.json({ error: "Input exceeds maximum allowed length." }, { status: 400 });
}
```

Also enforce `maxLength` attributes on the form inputs in `Contact.tsx` so the client rejects this before the server ever sees it.

---

## Finding 6 — Personal Email Hardcoded in Source Code (Low)

**File:** [app/api/contact/route.ts](../app/api/contact/route.ts#L16)

**What's happening:**
```ts
to: ["joshua.abad.development@gmail.com"],
```

This email address is committed to the repository and will be visible in git history forever.

**The risk:**
If the repository is public (e.g., hosted on GitHub as a portfolio), this is a scraped target for spam lists. The address is the one displayed on your portfolio anyway, so the exposure is limited — but it's still a code quality issue to have personal data hardcoded.

**Fix:**
Move it to an environment variable:

```ts
// .env.local
CONTACT_EMAIL=joshua.abad.development@gmail.com
```

```ts
// route.ts
to: [process.env.CONTACT_EMAIL!],
```

---

## Finding 7 — Sender Domain is Resend Sandbox (Low)

**File:** [app/api/contact/route.ts](../app/api/contact/route.ts#L15)

**What's happening:**
```ts
from: "Portfolio Contact <onboarding@resend.dev>",
```

The `onboarding@resend.dev` sender is Resend's shared sandbox domain, not a domain you own. This is fine for development and testing but has two problems in production:

1. **Spam filtering** — Emails sent from shared domains are more likely to land in spam because you share the sender reputation with every other Resend sandbox user.
2. **Trust signal** — Recipients see `onboarding@resend.dev` in their email client, which looks suspicious and unprofessional.

**Fix:**
Verify a custom domain in the Resend dashboard (e.g., `mail.joshuaabad.dev` or your actual domain), then update the `from` field:

```ts
from: "Joshua Abad Portfolio <noreply@joshuaabad.dev>",
```

---

## Finding 8 — No Bot / Spam Protection (Low)

**What's happening:**
The contact form has no CAPTCHA, honeypot field, or time-based submission guard. Any automated script can submit it repeatedly.

**The risk:**
Spam campaigns can use the form to send arbitrary messages to your inbox. Combined with Finding 2 (no rate limiting), this is a higher risk in practice.

**Fix options (pick one):**

- **Honeypot field** (zero friction for users): Add a hidden form field that real users never fill. If it contains a value, reject the submission silently.
- **Cloudflare Turnstile** (free, no solve challenge): Invisible bot detection that doesn't annoy users.
- **Time-based guard**: Reject submissions that arrive less than 3 seconds after page load — bots submit instantly.

---

## Finding 9 — Unused `swiper` Dependency (Informational)

**File:** [app/globals.css](../app/globals.css#L2-L4)

```css
@import 'swiper/css';
@import 'swiper/css/pagination';
@import 'swiper/css/navigation';
```

Swiper CSS is imported globally but no component uses `<Swiper>` or any swiper class. This adds ~30 KB of CSS to every page load for no benefit. Remove the imports and run `npm uninstall swiper`.

---

## Finding 10 — No `robots.txt` (Informational)

There is no `robots.txt` or `app/robots.ts`. Without it, all search engine crawlers have unrestricted access. For a portfolio this is generally desired, but the absence means you cannot exclude anything (e.g., a future `/admin` path) without adding the file later.

**Fix:**
```ts
// app/robots.ts
import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://joshuaabad.dev/sitemap.xml",
  };
}
```

---

## What Is NOT Exposed

These are concerns that might be suspected but are confirmed safe:

- **`RESEND_API_KEY`** — Correctly kept in `.env.local` (gitignored). Never referenced client-side.
- **API route logic** — The route file is server-only; none of the Resend SDK or API key reaches the browser bundle.
- **No database credentials** — There is no database; no connection strings to leak.
- **No authentication tokens** — There is no auth system; no session secrets to expose.
- **Open Graph data** — Title and description in `layout.tsx` are intentionally public.

---

## Recommended Priority Order

1. Fix HTML injection (Finding 1) — direct security impact, 10-minute fix
2. Add rate limiting (Finding 2) — protect your Resend quota and inbox
3. Add input length limits (Finding 5) — pairs with #2 to close the abuse surface
4. Add email validation (Finding 3) — simple regex, 5-minute fix
5. Add security headers (Finding 4) — one block in `next.config.ts`
6. Move email to env var (Finding 6) — good hygiene
7. Add honeypot (Finding 8) — low-friction spam protection
8. Upgrade sender domain (Finding 7) — requires Resend dashboard work
9. Remove Swiper (Finding 9) — cleanup
10. Add robots.txt (Finding 10) — completeness
