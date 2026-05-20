"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Layers, Cloud, Database, Code2, Activity } from "lucide-react";

const RADIUS = 160;
const CX = 260;
const CY = 225;
const SVG_W = 520;
const SVG_H = 430;
const NODE_R = 44;

const pts = Array.from({ length: 5 }, (_, i) => {
  const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
  return { x: CX + RADIUS * Math.cos(a), y: CY + RADIUS * Math.sin(a) };
});

// Each star line skips one vertex: i → i+2 (mod 5) — forms the inner star
const starLines: [number, number][] = [[0, 2], [1, 3], [2, 4], [3, 0], [4, 1]];

const categories = [
  {
    title: "Data Engineering",
    label: "Data Eng",
    color: "#3b82f6",
    Icon: Layers,
    skills: [
      "Apache Kafka", "Apache Spark", "Apache Airflow", "dbt",
      "ETL / ELT Design", "Data Modeling", "Stream Processing", "Power BI",
    ],
  },
  {
    title: "Cloud & Infrastructure",
    label: "Cloud",
    color: "#8b5cf6",
    Icon: Cloud,
    skills: [
      "Microsoft Azure", "AWS", "Google Cloud", "Terraform",
      "Azure DevOps", "CI/CD Pipelines", "Infrastructure as Code",
    ],
  },
  {
    title: "Databases",
    label: "Databases",
    color: "#06b6d4",
    Icon: Database,
    skills: [
      "PostgreSQL", "Snowflake", "BigQuery", "AWS Redshift",
      "SQL Server", "Azure SQL", "Redis", "MySQL",
    ],
  },
  {
    title: "Languages & Frameworks",
    label: "Languages",
    color: "#10b981",
    Icon: Code2,
    skills: [
      "Python", "SQL / T-SQL", "TypeScript", "JavaScript",
      "Node.js", "Angular", "REST APIs", "Event-Driven APIs",
    ],
  },
  {
    title: "Quality & Observability",
    label: "Quality",
    color: "#f59e0b",
    Icon: Activity,
    skills: [
      "Great Expectations", "Data Contracts", "Pipeline Monitoring",
      "Data Lineage", "dbt Tests", "App Insights", "Schema Governance",
    ],
  },
];

export default function Skills() {
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0 });
  const cat = categories[active];

  return (
    <section id="skills" style={{ background: "#050b18", padding: "100px 0" }}>
      <style>{`
        .sk-node { cursor: pointer; background: none; border: none; padding: 0; position: absolute; }
        .sk-node:focus-visible { outline: 2px solid #3b82f6; border-radius: 50%; }
        /* flex centering lets justify-content:center handle overflow symmetrically,
           fixing the broken margin:0 auto when element > parent width */
        @media (max-width: 540px) {
          .sk-penta-container { display: flex; justify-content: center; }
          .sk-penta { flex-shrink: 0; margin: 0 !important; transform: scale(0.58); transform-origin: top center; margin-bottom: -182px !important; }
        }
        @media (min-width: 541px) and (max-width: 820px) {
          .sk-penta-container { display: flex; justify-content: center; }
          .sk-penta { flex-shrink: 0; margin: 0 !important; transform: scale(0.78); transform-origin: top center; margin-bottom: -95px !important; }
        }
      `}</style>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 24px" }} ref={ref}>

        {/* ── Heading ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          style={{ textAlign: "center", marginBottom: 60 }}
        >
          <h2 className="section-heading">Skills</h2>
          <p style={{ color: "#475569", fontSize: 14, marginTop: 12 }}>
            7+ years across data engineering, cloud infrastructure, and software development
          </p>
        </motion.div>

        {/* ── Pentagon wrapper (motion handles fade-in; CSS class handles responsive scale) ── */}
        <motion.div
          className="sk-penta-container"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            className="sk-penta"
            style={{ position: "relative", width: SVG_W, height: SVG_H, margin: "0 auto" }}
          >
            {/* ── SVG backdrop: pentagon + pentagram lines ── */}
            <svg
              viewBox={`0 0 ${SVG_W} ${SVG_H}`}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
            >
              <defs>
                <filter id="sk-glow" x="-40%" y="-40%" width="180%" height="180%">
                  <feGaussianBlur stdDeviation="3.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Dim base pentagon outline */}
              <polygon
                points={pts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ")}
                fill="none"
                stroke="#0d1e35"
                strokeWidth="1.5"
              />

              {/* Dim base star lines */}
              {starLines.map(([a, b], i) => (
                <line
                  key={i}
                  x1={pts[a].x} y1={pts[a].y}
                  x2={pts[b].x} y2={pts[b].y}
                  stroke="#0a1628"
                  strokeWidth="1"
                />
              ))}

              {/* Glowing pentagon edges adjacent to active node */}
              {[0, 1, 2, 3, 4].map(i => {
                const j = (i + 1) % 5;
                if (i !== active && j !== active) return null;
                return (
                  <line key={`ae${i}`}
                    x1={pts[i].x} y1={pts[i].y}
                    x2={pts[j].x} y2={pts[j].y}
                    stroke={cat.color} strokeWidth="1.5" opacity="0.75"
                    filter="url(#sk-glow)"
                  />
                );
              })}

              {/* Glowing star lines from active node */}
              {starLines.map(([a, b], i) => {
                if (a !== active && b !== active) return null;
                return (
                  <line key={`as${i}`}
                    x1={pts[a].x} y1={pts[a].y}
                    x2={pts[b].x} y2={pts[b].y}
                    stroke={cat.color} strokeWidth="1" opacity="0.45"
                    filter="url(#sk-glow)"
                  />
                );
              })}

              {/* Center accent */}
              <circle cx={CX} cy={CY} r="22" fill={cat.color} opacity="0.05" filter="url(#sk-glow)" />
              <circle cx={CX} cy={CY} r="4" fill={cat.color} opacity="0.55" />
            </svg>

            {/* ── Clickable node circles ── */}
            {categories.map((c, i) => {
              const p = pts[i];
              const on = i === active;
              const { Icon } = c;
              return (
                <motion.button
                  key={i}
                  className="sk-node"
                  onClick={() => setActive(i)}
                  title={c.title}
                  style={{ left: p.x - NODE_R, top: p.y - NODE_R, width: NODE_R * 2, height: NODE_R * 2 }}
                  animate={{ scale: on ? 1.1 : 1 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  {/* Pulse ring on active */}
                  {on && (
                    <motion.div
                      animate={{ scale: [1, 1.8], opacity: [0.5, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                      style={{
                        position: "absolute", inset: -6, borderRadius: "50%",
                        border: `1.5px solid ${c.color}`, pointerEvents: "none",
                      }}
                    />
                  )}

                  {/* Circle body */}
                  <div style={{
                    width: "100%", height: "100%", borderRadius: "50%",
                    background: on
                      ? `radial-gradient(circle at 38% 35%, ${c.color}28 0%, #06101e 65%)`
                      : "radial-gradient(circle at 38% 35%, #0d1e3538 0%, #050b18 75%)",
                    border: `2px solid ${on ? c.color : "#172a42"}`,
                    boxShadow: on
                      ? `0 0 18px ${c.color}dd, 0 0 48px ${c.color}66, 0 0 90px ${c.color}22, inset 0 0 20px ${c.color}12`
                      : "inset 0 0 10px #00000060",
                    display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center", gap: 5,
                    transition: "all 0.35s ease",
                  }}>
                    <Icon
                      size={22}
                      style={{
                        color: on ? c.color : "#243650",
                        filter: on ? `drop-shadow(0 0 7px ${c.color})` : "none",
                        transition: "all 0.35s",
                      }}
                    />
                    <span style={{
                      fontSize: 8, fontWeight: 700, letterSpacing: "0.07em",
                      textTransform: "uppercase", textAlign: "center",
                      color: on ? c.color : "#243650",
                      textShadow: on ? `0 0 10px ${c.color}` : "none",
                      lineHeight: 1.25, maxWidth: 72,
                      transition: "all 0.35s",
                    }}>{c.label}</span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* ── Skills reveal panel ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.45 }}
          style={{ marginTop: 40 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* Category badge */}
              <div style={{ textAlign: "center", marginBottom: 22 }}>
                <span style={{
                  display: "inline-block",
                  padding: "6px 22px", borderRadius: 99,
                  fontSize: 11, fontWeight: 700, letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: cat.color,
                  textShadow: `0 0 14px ${cat.color}`,
                  border: `1px solid ${cat.color}55`,
                  background: `${cat.color}0e`,
                  boxShadow: `0 0 20px ${cat.color}22`,
                }}>{cat.title}</span>
              </div>

              {/* Skill tags */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
                {cat.skills.map((skill, i) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0.82 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.045, duration: 0.22, ease: "easeOut" }}
                    style={{
                      padding: "8px 18px", borderRadius: 7,
                      fontSize: 13, fontWeight: 500,
                      background: `${cat.color}0d`,
                      border: `1px solid ${cat.color}3c`,
                      color: "#94a3b8",
                      boxShadow: `0 0 10px ${cat.color}14`,
                      letterSpacing: "0.02em",
                    }}
                  >{skill}</motion.span>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  );
}
