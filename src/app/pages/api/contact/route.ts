// app/api/mailer/route.ts (App Router style)
import type { NextApiRequest, NextApiResponse } from "next";
import { Resend } from "resend";
import { render } from "@react-email/render";
import { JobSignalEmail } from "@/emails/JobSignalEmail";

interface MailerRequestBody {
  name: string;
  email: string;
  message: string;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // or restrict to your Vite domain
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "OPTIONS") {
    // ✅ Handle CORS preflight
    res.writeHead(200, corsHeaders);
    return res.end();
  }

  if (req.method !== "POST") {
    res.writeHead(405, corsHeaders);
    return res.end(JSON.stringify({ error: "Method not allowed" }));
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const body: MailerRequestBody = req.body

    if (!body.name || !body.email || !body.message) {
      return res.end(JSON.stringify({ error: "Missing required fields" }));
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
      res.writeHead(500, corsHeaders);
      return res.end(JSON.stringify({ error: "Failed to send email" }));
    }

    res.writeHead(200, corsHeaders);
    return res.end(JSON.stringify({ success: true, data }));
  } catch (err) {
    console.error("Mailer error:", err);
    res.writeHead(500, corsHeaders);
    return res.end(JSON.stringify({ error: "Internal server error" }));
  }
}