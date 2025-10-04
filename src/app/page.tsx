// app/page.tsx
import { JobSignalEmail } from "@/emails/JobSignalEmail";

export default function Home() {
  return (
    <div style={{ background: "#000", minHeight: "100vh", padding: "2rem" }}>
      {/* Header Preview Banner */}
      <header
        style={{
          textAlign: "center",
          marginBottom: "1rem",
          fontFamily: "'Orbitron', sans-serif",
          fontSize: "28px",
          fontWeight: 900,
          color: "#ffffff",
        }}
      >
        ⚡ This is the email template I am sending ⚡
      </header>

      {/* Small note */}
      <p style={{ textAlign: "center", color: "#9ca3af", marginBottom: "2rem" }}>
        (In production, this template is only sent by email. What you see here is just a preview.)
      </p>

      {/* Render the email in preview mode */}
      <JobSignalEmail
        name="Visitor"
        email="visitor@example.com"
        message="This is a preview of your JobSignalEmail template."
      />
    </div>
  );
}
