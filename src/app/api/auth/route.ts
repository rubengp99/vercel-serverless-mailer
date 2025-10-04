import { NextResponse } from "next/server";
import { signJwt } from "@/lib/jwt";
import { corsHeaders } from "@/lib/cors";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";

  // Limit login requests to 1 per 1 minutes per IP
  const limit = await rateLimit(ip, 1, 60); // 1 request / 1 min
  if (!limit.success) {
    return NextResponse.json(
      { error: "Too many requests, please try again later." },
      { status: 429 }
    );
  }

  const { email, password } = await req.json();

  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASS) {
    const token = signJwt({ userId: "1", email });
    return NextResponse.json({ token }, { headers: corsHeaders });
  }

  return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
}
