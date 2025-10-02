// pages/api/mailer.ts
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import ReactDOMServer from "react-dom/server";
import { JobSignalEmail } from "@/emails/JobSignalEmail"; // ✅ TSX component

interface MailerRequestBody {
  name: string;
  email: string;
  message: string;
}

export async function POST(req: Request) {
  try {
    const body: MailerRequestBody = await req.json();

    if (!body.name || !body.email || !body.message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const n = await JobSignalEmail({ name: body.name, message: body.message })
    // Render the component to static HTML string
    const html = ReactDOMServer.renderToStaticMarkup(n);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"${body.name}" <${body.email}>`,
      to: process.env.SMTP_USER,
      subject: "📡 New Job Signal Message",
      html, // send rendered HTML
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Mailer error:", err);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}