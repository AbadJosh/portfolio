import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          background: "#050b18",
          padding: "72px 96px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Top accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: "linear-gradient(90deg, #3b82f6 0%, #7c3aed 60%, transparent 100%)",
            display: "flex",
          }}
        />

        {/* Background glow — top right */}
        <div
          style={{
            position: "absolute",
            top: -180,
            right: -180,
            width: 640,
            height: 640,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(59,130,246,0.10) 0%, transparent 65%)",
            display: "flex",
          }}
        />

        {/* Background glow — bottom left */}
        <div
          style={{
            position: "absolute",
            bottom: -140,
            left: -80,
            width: 480,
            height: 480,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(124,58,237,0.09) 0%, transparent 65%)",
            display: "flex",
          }}
        />

        {/* Available badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 36,
            padding: "8px 22px",
            borderRadius: 99,
            border: "1px solid rgba(52,211,153,0.3)",
            background: "rgba(52,211,153,0.07)",
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#34d399",
              display: "flex",
            }}
          />
          <span style={{ fontSize: 17, color: "#34d399", fontWeight: 600 }}>
            Available for opportunities
          </span>
        </div>

        {/* Name */}
        <div
          style={{
            fontSize: 82,
            fontWeight: 800,
            color: "#e2e8f0",
            lineHeight: 1,
            marginBottom: 14,
            display: "flex",
            letterSpacing: "-2px",
          }}
        >
          Joshua D. Abad
        </div>

        {/* Role with accent dot */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 52,
          }}
        >
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#3b82f6",
              display: "flex",
              boxShadow: "0 0 8px #3b82f6",
            }}
          />
          <span style={{ fontSize: 30, fontWeight: 600, color: "#3b82f6" }}>
            Senior Data Engineer
          </span>
        </div>

        {/* Tags */}
        <div style={{ display: "flex", gap: 12 }}>
          {["ETL / ELT", "Cloud Platforms", "Data Pipelines", "Azure · AWS · GCP"].map((tag) => (
            <div
              key={tag}
              style={{
                padding: "10px 22px",
                borderRadius: 8,
                fontSize: 18,
                fontWeight: 500,
                color: "#64748b",
                border: "1px solid rgba(30,58,95,0.9)",
                background: "rgba(13,30,53,0.6)",
                display: "flex",
              }}
            >
              {tag}
            </div>
          ))}
        </div>

        {/* URL — bottom right */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            right: 96,
            fontSize: 20,
            color: "#334155",
            fontWeight: 500,
            display: "flex",
          }}
        >
          abadjosh.dev
        </div>
      </div>
    ),
    { ...size }
  );
}
