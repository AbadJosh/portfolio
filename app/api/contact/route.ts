import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    const { error } = await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: ["joshua.abad.development@gmail.com"],
      replyTo: email,
      subject: `[Portfolio] ${subject}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #050b18; color: #e2e8f0; border-radius: 12px;">
          <h2 style="color: #00a8ff; margin-bottom: 24px; font-size: 20px;">New Contact Form Submission</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #94a3b8; font-size: 13px; width: 80px;">Name</td><td style="padding: 8px 0; color: #e2e8f0; font-size: 13px;">${name}</td></tr>
            <tr><td style="padding: 8px 0; color: #94a3b8; font-size: 13px;">Email</td><td style="padding: 8px 0; color: #e2e8f0; font-size: 13px;">${email}</td></tr>
            <tr><td style="padding: 8px 0; color: #94a3b8; font-size: 13px;">Subject</td><td style="padding: 8px 0; color: #e2e8f0; font-size: 13px;">${subject}</td></tr>
          </table>
          <hr style="border: none; border-top: 1px solid #1e3a5f; margin: 20px 0;" />
          <p style="color: #94a3b8; font-size: 13px; margin-bottom: 8px;">Message:</p>
          <p style="color: #e2e8f0; font-size: 14px; line-height: 1.7; white-space: pre-wrap;">${message}</p>
          <hr style="border: none; border-top: 1px solid #1e3a5f; margin: 24px 0;" />
          <p style="color: #475569; font-size: 11px;">Sent from your portfolio at joshuaabad.dev · Reply directly to this email to respond.</p>
        </div>
      `,
    });

    if (error) {
      return NextResponse.json({ error: "Failed to send email. Please try again." }, { status: 500 });
    }

    return NextResponse.json({ message: "Message sent successfully." });
  } catch {
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}
