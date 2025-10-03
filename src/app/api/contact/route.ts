// app/api/mailer/route.ts
import { NextResponse } from "next/server";
import { render } from "@react-email/render";
import nodemailer from "nodemailer";
import { JobSignalEmail } from "@/emails/JobSignalEmail";

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

    // Render the email React component to HTML
    const element = await JobSignalEmail({
      name: body.name,
      email: body.email,
      message: body.message,
    });
    const html = await render(element);

    // Configure SMTP transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST, // e.g., smtp.protonmail.ch
      port: parseInt(process.env.SMTP_PORT || "587", 10), // 587 for STARTTLS, 465 for SSL
      secure: process.env.SMTP_SECURE === "true", // true for 465, false for 587
      auth: {
        user: process.env.SMTP_USER, // your email address (e.g., user@proton.me)
        pass: process.env.SMTP_PASS, // SMTP password or token
      },
    });

    // Send the email
    const info = await transporter.sendMail({
      from: `"${body.name}" <${body.email}>`, // Sender (user input)
      to: process.env.SMTP_USER as string, // Receiver (your inbox)
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
