# 🚀 JobSignal Mailer API — (Updated: Auth + Rate Limit + Env)

This repository hosts a **Next.js (App Router)** backend that exposes a protected `/api/mailer` endpoint which:
- Renders an HTML email from a React email template (`JobSignalEmail`) using `@react-email/render`.
- Sends email through **Gmail SMTP** (via `nodemailer`).
- Protects the endpoint with **JWT session auth** (tokens expire in 10 minutes).
- Applies **Redis-backed rate limiting** (Upstash / Vercel Redis).
- Provides CORS headers so a separate frontend (e.g. Vite) can call the API.

> This README expands the project structure, adds concrete auth examples, frontend login + send examples, and lists the **complete environment variables** required.

---

## 📂 Project structure (updated)

```
src/
  app/
    api/
      auth/
        route.ts            # POST: /api/auth -> login (issues JWT)
      mailer/
        route.ts            # POST: /api/mailer -> protected, rate-limited mailer
  emails/
    JobSignalEmail.tsx      # React Email template used for rendering HTML
  lib/
    jwt.ts                  # JWT helpers (sign & verify) with rotating secret
    redis.ts                # Upstash redis client
    rate-limit.ts           # simple redis-backed rate limiter
  components/
    ...                     # UI components (if any)
  page.tsx                  # optional preview route that renders JobSignalEmail in preview mode
```

---

## 🔐 How Auth Works (JWT sessions)

- A client authenticates with a simple login endpoint (`POST /api/auth`) supplying credentials (email/password).
- Server issues a **JWT** with payload like `{ userId, email }`.
- **Token expiry** is set to **10 minutes** (`expiresIn: "10m"`).
- The JWT **signing secret rotates** per time window using a base secret (`JWT_SECRET_BASE`) + a window index. This increases security by limiting the lifetime of secrets.
  - When verifying, the server tries the **current window secret** and the **previous window secret** to avoid edge-case race conditions.
- Client must include token in the `Authorization` header as `Bearer <token>` when calling `/api/mailer`.

### Why rotating secret?
- Rotating the secret ensures tokens cannot be used beyond a narrow window if the base secret leaks.
- We still allow previous-window verification to avoid issues during small clock drifts.

---

## 🧾 Complete environment variables (what to set)

> **Server (.env.local for Next.js / Vercel environment variables)**

```env
# Mail (Gmail SMTP)
SMTP_USER=your_gmail_account@gmail.com
SMTP_PASS=your_gmail_app_password_or_app_password

# Redis (Upstash)
KV_REST_URL=https://<region>.upstash.io
KV_REST_TOKEN=<upstash-token>

# JWT secret base (used to create rotating secrets)
JWT_SECRET_BASE=your-strong-base-secret

# Admin (example minimal login)
ADMIN_EMAIL=admin@example.com
ADMIN_PASS=super-strong-password

```

> **Frontend (Vite) — `.env` (build-time variables)**

```env
VITE_API_URL=https://your-next-backend.vercel.app
```

**Important notes**
- For Gmail SMTP, if you have 2FA enabled, create an **App Password** or use a proper SMTP account.
- Set Upstash Redis credentials in your Vercel project (Environment Variables).
- Add `JWT_SECRET_BASE` to Vercel (do **not** commit it to git).

---


## 🧭 Frontend (Vite) examples

> First, make sure `VITE_API_URL` is set in your Vite `.env` or in your deployment pipeline (build-time).

### Login (get JWT)
```ts
// call /api/auth to receive token
async function login(email, password) {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (res.ok) {
    localStorage.setItem("jwt", data.token);
    return true;
  }
  return false;
}
```

### Send mail with JWT
```ts
async function sendMail(formData) {
  const token = localStorage.getItem("jwt");
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/mailer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(formData),
  });

  if (res.status === 401) {
    // prompt login again
    throw new Error("Unauthorized – please log in again");
  }
  if (res.status === 429) {
    // rate limited
    const j = await res.json();
    throw new Error(j.error || "Rate limit exceeded");
  }
  if (!res.ok) {
    throw new Error("Failed to send");
  }
  return await res.json();
}
```

### Dev helper: Vite proxy (avoid CORS during local dev)
```ts
// vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});
```

---

## 🛠 Deployment notes

- Add all server env vars (SMTP, Upstash, JWT secret base, admin creds) in your Vercel project settings.
- For the Vite frontend, set `VITE_API_URL` in your frontend's deployment environment.
- If you keep `Access-Control-Allow-Origin: "*"`, it will accept calls from any origin — for production, restrict to your frontend domain.

---

## 🔒 Security considerations

- Prefer storing JWT in **secure, httpOnly cookies** in production (this README uses localStorage for simplicity).
- Rotating secrets make token invalidation stricter — ensure your window length matches your token expiry and UX.
- Consider adding strong server-side validation (email format, request body size) and honeypot fields to prevent abuse.

Coded With <3
