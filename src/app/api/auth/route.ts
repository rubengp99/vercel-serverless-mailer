import { NextResponse } from "next/server";
import { signJwt } from "@/lib/jwt";
import { corsHeaders } from "@/lib/cors";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASS) {
    const token = signJwt({ userId: "1", email });
    return NextResponse.json({ token }, { headers: corsHeaders });
  }

  return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
}
