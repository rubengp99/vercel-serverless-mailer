/* eslint-disable @next/next/no-head-element */

import React from "react";

interface JobSignalEmailProps {
  name: string;
  message: string;
}

export const JobSignalEmail: React.FC<JobSignalEmailProps> = ({ name, message }) => {
  return (
    <html lang="en">
      {/* CSS */}
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="x-apple-disable-message-reformatting" />

        {/* CSS */}
        <style>
        {`
            @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Roboto+Mono:wght@400;700&display=swap');
            html, body {
                margin: 0 auto !important;
                padding: 0 !important;
                height: 100% !important;
                width: 100% !important;
                background: #010409;
            }
            * {
                -ms-text-size-adjust: 100%;
                -webkit-text-size-adjust: 100%;
            }
            table, td {
                mso-table-lspace: 0pt !important;
                mso-table-rspace: 0pt !important;
            }
            table {
                border-spacing: 0 !important;
                border-collapse: collapse !important;
                table-layout: fixed !important;
                margin: 0 auto !important;
            }
            img {
                -ms-interpolation-mode:bicubic;
            }
            a {
                text-decoration: none;
                color: #00f6ff;
            }
            .glitch-text {
                text-shadow: 2px 2px 0px #ff005d, -2px -2px 0px #00f6ff;
            }
            .button-a-primary {
                transition: all 150ms ease-in-out;
            }
            .button-td-primary:hover .button-a-primary {
                background: #fff !important;
                color: #000 !important;
                box-shadow: 0 0 35px #fff !important;
                text-shadow: none !important;
            }
            @media screen and (max-width: 600px) {
                .email-container {
                width: 100% !important;
                margin: auto !important;
                }
                .stack-column,
                .stack-column-center {
                display: block !important;
                width: 100% !important;
                max-width: 100% !important;
                direction: ltr !important;
                }
                .stack-column-center {
                text-align: center !important;
                }
                .stack-column-center .feature-text {
                padding: 20px 10px 0 10px !important;
                text-align: center !important;
                }
                .hero-h1 {
                font-size: 38px !important;
                line-height: 48px !important;
                }
                .main-content-wrapper {
                border: none !important;
                }
            }
        `}</style>
      </head>

      <body
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: "#010409",
        }}
      >
        <center style={{ width: "100%", backgroundColor: "#010409" }}>
          {/* Preheader */}
          <div
            style={{
              display: "none",
              fontSize: "1px",
              lineHeight: "1px",
              maxHeight: "0px",
              maxWidth: "0px",
              opacity: 0,
              overflow: "hidden",
              fontFamily: "sans-serif",
            }}
          >
            Signal corrupted... Reality deconstructed.
          </div>

          <table
            align="center"
            role="presentation"
            cellSpacing={0}
            cellPadding={0}
            border={0}
            width={600}
            style={{ margin: "0 auto" }}
            className="email-container"
          >
            {/* Header */}
            <tr>
              <td style={{ padding: "40px 0", textAlign: "center" }}>
                <h1
                  style={{
                    fontFamily: "'Orbitron', sans-serif",
                    fontSize: "24px",
                    color: "#ffffff",
                    margin: 0,
                  }}
                  className="glitch-text"
                >
                  [RUBENGP99]
                </h1>
              </td>
            </tr>

            {/* Hero */}
            <tr>
              <td
                style={{
                  padding: "50px 40px",
                  textAlign: "center",
                  fontFamily: "'Roboto Mono', monospace",
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1751810118115-5fbda1965534')",
                  backgroundSize: "cover",
                  backgroundPosition: "center center",
                }}
              >
                <h1
                  className="hero-h1 glitch-text"
                  style={{
                    margin: "0 0 15px",
                    fontFamily: "'Orbitron', sans-serif",
                    fontSize: "52px",
                    lineHeight: "60px",
                    color: "#ffffff",
                    fontWeight: 900,
                  }}
                >
                  JOB SIGNAL
                </h1>
                <p
                  style={{
                    margin: "0 0 40px",
                    fontSize: "16px",
                    lineHeight: "26px",
                    color: "#d1d5db",
                  }}
                >
                  Signal integrity compromised. Reality protocols failing. A new
                  paradigm is emerging from the noise.
                </p>
              </td>
            </tr>

            {/* Body */}
            <tr>
              <td
                style={{
                  padding: "40px 20px",
                  backgroundColor: "#080c12",
                }}
              >
                <table
                  role="presentation"
                  cellSpacing={0}
                  cellPadding={0}
                  border={0}
                  width="100%"
                >
                  <tr>
                    <td width="5%" className="stack-column-center"></td>
                    <td
                      width="50%"
                      className="stack-column-center feature-text"
                      style={{
                        fontFamily: "'Roboto Mono', monospace",
                        fontSize: "14px",
                        lineHeight: "22px",
                        color: "#d1d5db",
                        textAlign: "left",
                        paddingLeft: "20px",
                      }}
                    >
                      <h2
                        style={{
                          margin: "0 0 10px",
                          fontFamily: "'Orbitron', sans-serif",
                          fontSize: "20px",
                          lineHeight: "26px",
                          color: "#ffffff",
                          fontWeight: 700,
                        }}
                        className="glitch-text"
                      >
                        {name} says:
                      </h2>
                      <p style={{ margin: 0 }}>{message}</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            {/* Footer */}
            <tr>
              <td
                style={{
                  padding: "40px",
                  textAlign: "center",
                  fontFamily: "'Roboto Mono', monospace",
                  fontSize: "12px",
                  lineHeight: "18px",
                  color: "#6b7280",
                }}
              >
                <p style={{ margin: "0 0 15px" }}>
                  [Signal source: RUBENGP99 // Quadrant 4 // Sub-level 9]
                </p>
                <p style={{ margin: "0 0 20px" }}>
                  This transmission is an anomaly. Standard protocols do not
                  apply. Discretion is advised.
                </p>
                <a
                  href="#"
                  style={{
                    color: "#ff005d",
                    textDecoration: "none",
                    border: "1px solid #ff005d",
                    padding: "5px 10px",
                    margin: "0 5px",
                  }}
                >
                  PURGE_CACHE
                </a>
                <a
                  href="#"
                  style={{
                    color: "#00f6ff",
                    textDecoration: "none",
                    border: "1px solid #00f6ff",
                    padding: "5px 10px",
                    margin: "0 5px",
                  }}
                >
                  VIEW_RAW_DATA
                </a>
                <br />
                <br />
                <br />
                © 2025 RUBENGP99. All rights reserved... probably.
              </td>
            </tr>
          </table>
        </center>
      </body>
    </html>
  );
};
