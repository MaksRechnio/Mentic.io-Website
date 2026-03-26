"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <head>
        <title>mentic</title>
        <link rel="icon" href="/favicon.png" />
        <link href="https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@300;400;600;700&display=swap" rel="stylesheet" />
      </head>
      <body style={{ margin: 0 }}>
        <div style={{
          minHeight: "100vh",
          background: "#ff6b5c",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Nunito Sans', 'Helvetica Neue', Arial, sans-serif",
          padding: "40px 24px",
          textAlign: "center",
        }}>
          {/* Plain img — no Next.js Image since layout may be broken */}
          <img
            src="/images/mentic-icon-mint.png"
            alt="Mentic"
            width={80}
            height={80}
            style={{ marginBottom: 32, filter: "drop-shadow(2px 2px 16px rgba(0,0,0,0.12))" }}
          />

          <h1 style={{
            fontSize: "clamp(80px, 15vw, 160px)",
            fontWeight: 700,
            color: "#003c46",
            lineHeight: 1,
            margin: "0 0 8px",
            fontFamily: "serif",
          }}>
            Oops
          </h1>

          <p style={{
            fontSize: "clamp(16px, 3vw, 24px)",
            fontWeight: 600,
            color: "#faf9f6",
            margin: "0 0 8px",
          }}>
            Something broke badly.
          </p>

          <p style={{
            fontSize: "clamp(13px, 2vw, 16px)",
            fontWeight: 300,
            color: "rgba(250,249,246,0.6)",
            margin: "0 0 40px",
            maxWidth: 360,
          }}>
            We&apos;re on it. Try refreshing the page.
          </p>

          <button
            onClick={reset}
            style={{
              display: "inline-block",
              background: "#003c46",
              color: "#8bf2d3",
              fontSize: "clamp(14px, 2vw, 16px)",
              fontWeight: 700,
              fontFamily: "'Nunito Sans', sans-serif",
              padding: "14px 36px",
              borderRadius: 12,
              border: "none",
              cursor: "pointer",
              boxShadow: "2px 2px 16px rgba(0,0,0,0.2)",
            }}
          >
            Refresh
          </button>

          <p style={{
            position: "absolute",
            bottom: 24,
            fontSize: 12,
            color: "rgba(0,60,70,0.4)",
            fontWeight: 600,
          }}>
            mentic.io
          </p>
        </div>
      </body>
    </html>
  );
}
