import { NextResponse } from "next/server";
import { render } from "@react-email/render";
import nodemailer from "nodemailer";
import { JobSignalEmail } from "@/emails/JobSignalEmail";
import { error } from "node:console";

interface MailerRequestBody {
  name: string;
  email: string;
  message: string;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: Request) {
  try {
    const body: MailerRequestBody = await req.json();

    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Render email template
    const element = await JobSignalEmail({
      name: body.name,
      email: body.email,
      message: body.message,
    });
    const html = await render(element);

    if (process.env.SMTP_PASS?.length != 16 || !process.env.SMTP_USER) {
      throw error("invalid credentials")
    }

    // Configure Gmail SMTP transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // upgrade later with STARTTLS
      auth: {
        user: process.env.SMTP_USER, // your Gmail address
        pass: process.env.SMTP_PASS, // your Gmail App Password
      },
    });

    // Send email
    const info = await transporter.sendMail({
      from: `"${body.name}" <${process.env.SMTP_USER}>`, // Gmail enforces authenticated sender
      replyTo: body.email, // so replies go to the user's email
      to: process.env.SMTP_USER, // send to yourself (your Gmail)
      subject: "📡 New Job Signal Message",
      html,
    });

    return NextResponse.json(
      { success: true, info },
      { status: 200, headers: corsHeaders }
    );
  } catch (err) {
    console.error("Mailer error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: corsHeaders }
    );
  }
}
