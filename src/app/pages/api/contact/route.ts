// app/api/mailer/route.ts (App Router style)
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { render } from "@react-email/render";
import { JobSignalEmail } from "@/emails/JobSignalEmail";

interface MailerRequestBody {
  name: string;
  email: string;
  message: string;
}

export async function POST(req: Request) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const body: MailerRequestBody = await req.json();

    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // render by calling the component function
    const element = await JobSignalEmail({
      name: body.name,
      email: body.email,
      message: body.message,
    });

    const html = await render(element);

    const { data, error } = await resend.emails.send({
      from: `"${body.name}" <${body.email}>`,
      to: process.env.SMTP_USER as string,
      subject: "📡 New Job Signal Message",
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, data },
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*", // 👈 allow frontend
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      }
    );
  } catch (err) {
    console.error("Mailer error:", err);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}