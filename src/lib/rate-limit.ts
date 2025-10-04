// lib/rate-limit.ts
import { redis } from "./redis";

// this limits to 5 requets every 10 minutes, i don't want abuse of this API
export async function rateLimit(identifier: string, limit = 5, window = 600) {
  const key = `rate_limit:${identifier}`;
  
  const tx = redis.multi(); // transaction
  tx.incr(key);             // increment counter
  tx.expire(key, window);   // expire after window
  const [count] = await tx.exec<number[]>();

  return {
    success: count <= limit,
    remaining: Math.max(0, limit - count),
    count,
  };
}
