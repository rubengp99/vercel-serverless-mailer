import * as React from "react";
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Heading,
} from "@react-email/components";

export interface JobSignalEmailProps {
  name: string;
  email: string;
  message: string;
}

export const JobSignalEmail: React.FC<JobSignalEmailProps> = ({
  name,
  email,
  message,
}) =>  {
  return (
    <Html>
      <Head />
      {/* Preheader (hidden preview text in email clients) */}
      <Preview>📡 New Job Signal from {name}</Preview>

      <Body style={{ backgroundColor: "#010409", fontFamily: "Roboto Mono, monospace" }}>
        <Container style={{ margin: "40px auto", padding: "20px", background: "#080c12", borderRadius: "8px", maxWidth: "600px" }}>
          <Heading
            style={{
              fontFamily: "Orbitron, sans-serif",
              fontSize: "32px",
              fontWeight: "900",
              textAlign: "center",
              color: "#fff",
              textShadow: "2px 2px 0px #ff005d, -2px -2px 0px #00f6ff",
            }}
          >
            JOB SIGNAL
          </Heading>

          <Section style={{ padding: "20px" }}>
            <Text style={{ color: "#d1d5db", fontSize: "14px", lineHeight: "22px" }}>
              <strong style={{ color: "#67f38c" }}>{name}</strong> (
              <a href={`mailto:${email}`} style={{ color: "#00f6ff" }}>
                {email}
              </a>
              ) says:
            </Text>
            <Text style={{ color: "#fff", marginTop: "10px" }}>{message}</Text>
          </Section>

          <Section style={{ textAlign: "center", marginTop: "30px" }}>
            <a
              href="#"
              style={{
                color: "#ff005d",
                border: "1px solid #ff005d",
                padding: "8px 16px",
                marginRight: "8px",
                textDecoration: "none",
              }}
            >
              PURGE_CACHE
            </a>
            <a
              href="#"
              style={{
                color: "#00f6ff",
                border: "1px solid #00f6ff",
                padding: "8px 16px",
                textDecoration: "none",
              }}
            >
              VIEW_RAW_DATA
            </a>
          </Section>

          <Text style={{ color: "#6b7280", fontSize: "12px", textAlign: "center", marginTop: "40px" }}>
            [Signal source: RUBENGP99 // Quadrant 4 // Sub-level 9] <br />
            This transmission is an anomaly. Discretion advised. <br />
            © 2025 RUBENGP99. All rights reserved... probably.
          </Text>
        </Container>
      </Body>
    </Html>
  ) as React.JSX.Element;
};
