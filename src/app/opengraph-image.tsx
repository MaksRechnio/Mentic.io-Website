import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Mentic — Autonomous AI Advertising Agent";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(ellipse at 30% 20%, rgba(255,107,92,0.35) 0%, transparent 55%), radial-gradient(ellipse at 75% 85%, rgba(139,242,211,0.35) 0%, transparent 55%), #ffe5e5",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 180,
            fontWeight: 700,
            color: "#ff6b5c",
            letterSpacing: "-0.04em",
            lineHeight: 1,
            display: "flex",
          }}
        >
          mentic
        </div>
        <div
          style={{
            fontSize: 44,
            fontWeight: 500,
            color: "#003c46",
            marginTop: 32,
            display: "flex",
          }}
        >
          Autonomous AI Advertising Agent
        </div>
        <div
          style={{
            fontSize: 28,
            fontWeight: 400,
            color: "#003c46",
            opacity: 0.7,
            marginTop: 20,
            maxWidth: 900,
            textAlign: "center",
            display: "flex",
          }}
        >
          Strategy, campaigns, and optimisation — autonomously.
        </div>
      </div>
    ),
    { ...size }
  );
}
