import { NextResponse } from "next/server";
import { signJwt } from "@/lib/jwt";
import { corsHeaders } from "@/lib/cors";
import { rateLimit } from "@/lib/rate-limit";
import { decryptPassword, EncryptedPassword} from "@/lib/crypto";

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: Request) {
  /*
  const ip = req.headers.get("x-forwarded-for") || "unknown";

  // Limit login requests to 1 per 1 minutes per IP
  const limit = await rateLimit(ip, 1, 60); // 1 request / 1 min
  if (!limit.success) {
    return NextResponse.json(
      { error: "Too many requests, please try again later." },
      { status: 429, headers: corsHeaders }
    );
  }
*/
  const { email, password } = await req.json();

  const pwd = await decryptPassword(password as EncryptedPassword)

  if (email === process.env.ADMIN_EMAIL && pwd === process.env.ADMIN_PASS) {
    const token = signJwt({ userId: "1", email });
    return NextResponse.json({ token }, { headers: corsHeaders });
  }

  return NextResponse.json({ error: "Invalid credentials" }, { status: 401, headers: corsHeaders });
}
