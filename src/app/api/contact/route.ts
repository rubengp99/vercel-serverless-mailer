import { NextResponse } from "next/server";
import { render } from "@react-email/render";
import nodemailer from "nodemailer";
import { JobSignalEmail } from "@/emails/JobSignalEmail";
import { error } from "node:console";
import { rateLimit } from "@/lib/rate-limit";
import { verifyJwt } from "@/lib/jwt";
import { corsHeaders } from "@/lib/cors";

interface MailerRequestBody {
  name: string;
  email: string;
  message: string;
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: Request) {
  try {
    // check auth header
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyJwt(token);

    if (!decoded) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401, headers: corsHeaders }
      );
    }

    // check exp manually
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      return NextResponse.json(
        { error: "Token expired" },
        { status: 401, headers: corsHeaders }
      );
    }

    // Identify requester (IP-based rate limiting)
    const ip =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "unknown";

    const limit = await rateLimit(ip, 5, 600); // 5 requests / 10 min

    if (!limit.success) {
      return NextResponse.json(
        { error: "Too many requests, please try again later." },
        { status: 429, headers: corsHeaders  }
      );
    }

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
