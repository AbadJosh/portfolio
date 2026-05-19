"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Download, Award } from "lucide-react";

const certifications = [
  {
    name: "Azure Data Engineer Associate",
    badge: "DP-203",
    issuer: "Microsoft",
    color: "#0078d4",
  },
  {
    name: "Professional Data Engineer",
    badge: "GCP",
    issuer: "Google Cloud",
    color: "#4285f4",
  },
  {
    name: "Data Analytics Specialty",
    badge: "AWS",
    issuer: "Amazon Web Services",
    color: "#ff9900",
  },
  {
    name: "dbt Fundamentals",
    badge: "dbt",
    issuer: "dbt Labs",
    color: "#ff694a",
  },
];

export default function Resume() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="resume" style={{ background: "#060d1f", padding: "100px 0" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 48px" }} ref={ref}>

        {/* Heading + Download */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          style={{
            display: "flex", alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap", gap: 16,
            marginBottom: 64,
          }}
        >
          <h2 className="section-heading" style={{ margin: 0 }}>Certifications</h2>
          <a
            href="/resume.pdf"
            download
            className="btn-ghost"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none" }}
          >
            <Download size={14} />
            Download Resume
          </a>
        </motion.div>

        {/* Cert cards grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 20,
        }}>
          {certifications.map((cert, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.09, duration: 0.5 }}
              style={{
                padding: "24px 26px",
                borderRadius: 16,
                background: "#050b18",
                borderTop: `1px solid ${cert.color}35`,
                borderRight: `1px solid ${cert.color}35`,
                borderBottom: `1px solid ${cert.color}35`,
                borderLeft: `3px solid ${cert.color}`,
                boxShadow: `0 0 24px ${cert.color}0e, inset 0 0 20px ${cert.color}06`,
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Corner glow */}
              <div style={{
                position: "absolute", top: -24, right: -24,
                width: 96, height: 96, borderRadius: "50%",
                background: `radial-gradient(circle, ${cert.color}12 0%, transparent 70%)`,
                pointerEvents: "none",
              }} />

              <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                <div style={{
                  width: 46, height: 46, borderRadius: 12, flexShrink: 0,
                  background: `${cert.color}12`,
                  border: `1px solid ${cert.color}35`,
                  boxShadow: `0 0 14px ${cert.color}25`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Award size={20} style={{ color: cert.color, filter: `drop-shadow(0 0 5px ${cert.color})` }} />
                </div>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9", marginBottom: 6, lineHeight: 1.3 }}>
                    {cert.name}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{
                      fontSize: 10, fontWeight: 700, letterSpacing: "0.1em",
                      padding: "2px 8px", borderRadius: 99,
                      background: `${cert.color}18`,
                      border: `1px solid ${cert.color}45`,
                      color: cert.color,
                      textTransform: "uppercase",
                    }}>{cert.badge}</span>
                    <span style={{ fontSize: 12, color: "#475569" }}>{cert.issuer}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
