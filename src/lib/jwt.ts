import jwt, { SignOptions, JwtPayload as DefaultJwtPayload } from "jsonwebtoken";

const SECRET_BASE = process.env.JWT_SECRET_BASE as string

function getDynamicSecret(): string {
  const now = Math.floor(Date.now() / (1000 * 60 * 10)); // 10 min "window"
  return `${SECRET_BASE}-${now}`;
}

export interface JwtPayload extends DefaultJwtPayload {
  userId: string;
  email: string;
}

export function signJwt(payload: JwtPayload,expiresIn: SignOptions["expiresIn"] = "10m"): string {
  const options: SignOptions = { expiresIn };
  return jwt.sign(payload, getDynamicSecret(), options);
}

export function verifyJwt(token: string): JwtPayload | null {
  try {
    // Try with current secret
    return jwt.verify(token, getDynamicSecret()) as JwtPayload;
  } catch (err) {
    // Optionally, try the "previous window" to avoid race conditions
    try {
      const prevSecret = `${SECRET_BASE}-${Math.floor(Date.now() / (1000 * 60 * 10)) - 1}`;
      return jwt.verify(token, prevSecret) as JwtPayload;
    } catch {
      return null;
    }
  }
}
