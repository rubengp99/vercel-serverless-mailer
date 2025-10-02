// app/api/mailer/route.ts (App Router style)
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import { JobSignalEmail } from "@/emails/JobSignalEmail";

interface MailerRequestBody {
  name: string;
  email: string;
  message: string;
}

export async function POST(req: Request) {
  try {
    const body: MailerRequestBody = await req.json();

    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // ✅ render by calling the component function
    const element = await JobSignalEmail({
      name: body.name,
      email: body.email,
      message: body.message,
    });

    const html = await render(element);

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
      html,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Mailer error:", err);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
