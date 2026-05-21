import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

function requireEnv(name: string): string {
  const val = process.env[name];
  if (!val) throw new Error(`${name} environment variable is not set`);
  return val;
}

const resend = new Resend(requireEnv("RESEND_API_KEY"));
const contactEmail = requireEnv("CONTACT_EMAIL");
const contactFrom = requireEnv("CONTACT_FROM");

// In-memory rate limiter: 5 requests per IP per hour
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (rateLimitMap.get(ip) ?? []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS
  );
  if (timestamps.length >= RATE_LIMIT_MAX) return true;
  timestamps.push(now);
  rateLimitMap.set(ip, timestamps);
  return false;
}

function h(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// RFC 5321 compliant email regex
const emailRegex =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;

export async function POST(request: NextRequest) {
  // CSRF: verify request originates from same host
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  try {
    const originHost = new URL(origin ?? "").host;
    if (!host || originHost !== host) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }
  } catch {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  // Rate limiting by IP
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const { name, email, subject, message, website } = body;

    // Honeypot — real users never fill this field; bots do
    if (website) {
      return NextResponse.json({ message: "Message sent successfully." });
    }

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    if (
      typeof name !== "string" ||
      name.length > 200 ||
      typeof email !== "string" ||
      email.length > 320 ||
      typeof subject !== "string" ||
      subject.length > 300 ||
      typeof message !== "string" ||
      message.length > 5000
    ) {
      return NextResponse.json(
        { error: "Input exceeds allowed length." },
        { status: 400 }
      );
    }

    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address." },
        { status: 400 }
      );
    }

    if (!/^[\w\s\-.,!?&()'":@#]+$/.test(subject)) {
      return NextResponse.json(
        { error: "Subject contains invalid characters." },
        { status: 400 }
      );
    }

    const { error } = await resend.emails.send({
      from: contactFrom,
      to: [contactEmail],
      replyTo: email,
      subject: `[Portfolio] ${h(subject)}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #050b18; color: #e2e8f0; border-radius: 12px;">
          <h2 style="color: #00a8ff; margin-bottom: 24px; font-size: 20px;">New Contact Form Submission</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #94a3b8; font-size: 13px; width: 80px;">Name</td><td style="padding: 8px 0; color: #e2e8f0; font-size: 13px;">${h(name)}</td></tr>
            <tr><td style="padding: 8px 0; color: #94a3b8; font-size: 13px;">Email</td><td style="padding: 8px 0; color: #e2e8f0; font-size: 13px;">${h(email)}</td></tr>
            <tr><td style="padding: 8px 0; color: #94a3b8; font-size: 13px;">Subject</td><td style="padding: 8px 0; color: #e2e8f0; font-size: 13px;">${h(subject)}</td></tr>
          </table>
          <hr style="border: none; border-top: 1px solid #1e3a5f; margin: 20px 0;" />
          <p style="color: #94a3b8; font-size: 13px; margin-bottom: 8px;">Message:</p>
          <p style="color: #e2e8f0; font-size: 14px; line-height: 1.7; white-space: pre-wrap;">${h(message)}</p>
          <hr style="border: none; border-top: 1px solid #1e3a5f; margin: 24px 0;" />
          <p style="color: #475569; font-size: 11px;">Sent from your portfolio · Reply directly to this email to respond.</p>
        </div>
      `,
    });

    if (error) {
      return NextResponse.json(
        { error: "Failed to send email. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Message sent successfully." });
  } catch {
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
