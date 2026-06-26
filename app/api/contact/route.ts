import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const { name, email, message } = body as Record<string, unknown>;

  if (!name || typeof name !== "string" || !name.trim()) {
    return NextResponse.json({ error: "Name is required." }, { status: 422 });
  }
  if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return NextResponse.json({ error: "A valid email is required." }, { status: 422 });
  }
  if (!message || typeof message !== "string" || message.trim().length < 10) {
    return NextResponse.json({ error: "Message must be at least 10 characters." }, { status: 422 });
  }

  const n = name.trim();
  const e = email.trim();
  const m = message.trim();

  try {
    await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: "supratim347@gmail.com",
      replyTo: e,
      subject: `Portfolio message from ${n}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
          <h2 style="color:#7c3aed;margin-bottom:4px">New message from your portfolio</h2>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0"/>
          <p><strong>Name:</strong> ${n}</p>
          <p><strong>Email:</strong> <a href="mailto:${e}">${e}</a></p>
          <p><strong>Message:</strong></p>
          <p style="background:#f9fafb;border-left:4px solid #7c3aed;padding:12px 16px;border-radius:4px;white-space:pre-wrap">${m}</p>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0"/>
          <p style="color:#9ca3af;font-size:12px">Sent via supratimsarkar.dev</p>
        </div>
      `,
    });
  } catch (err) {
    console.error("Resend error:", err);
    return NextResponse.json({ error: "Failed to send message. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
