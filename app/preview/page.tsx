"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import Image from "next/image";
import { TypeAnimation } from "react-type-animation";
import {
  Briefcase, Mail, MapPin, Layers, Cloud, Database,
  Code2, Activity, ArrowLeft,
} from "lucide-react";

// ── LIGHT THEME TOKENS ───────────────────────────────────────────
const T = {
  bg:         "#ffffff",   // pure white
  surface:    "#ffffff",
  surfaceAlt: "#f3f4f6",
  border:     "rgba(0,0,0,0.09)",
  borderMid:  "rgba(0,0,0,0.16)",
  text1:      "#0a0a0b",   // near-black
  text2:      "#374151",   // gray-700 — strong enough on white
  text3:      "#6b7280",   // gray-500 — readable secondary
  text4:      "#9ca3af",   // gray-400 — placeholders / very muted
  // Neon accents — slightly saturated for light-bg readability
  blue:    "#2563eb",
  violet:  "#7c3aed",
  cyan:    "#0891b2",
  green:   "#16a34a",
  emerald: "#059669",
  amber:   "#d97706",
};

const GithubIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);
const LinkedinIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

// ── Skills pentagon (same geometry as Skills.tsx) ────────────────
const RADIUS = 160, CX = 260, CY = 225, SVG_W = 520, SVG_H = 430, NODE_R = 44;
const pts = Array.from({ length: 5 }, (_, i) => {
  const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
  return { x: CX + RADIUS * Math.cos(a), y: CY + RADIUS * Math.sin(a) };
});
const starLines: [number, number][] = [[0, 2], [1, 3], [2, 4], [3, 0], [4, 1]];

const categories = [
  { title: "Data Engineering",       label: "Data Eng",  color: T.blue,    Icon: Layers,   skills: ["Apache Kafka","Apache Spark","Apache Airflow","dbt","ETL / ELT Design","Data Modeling","Stream Processing","Power BI"] },
  { title: "Cloud & Infrastructure", label: "Cloud",     color: T.violet,  Icon: Cloud,    skills: ["Microsoft Azure","AWS","Google Cloud","Terraform","Azure DevOps","CI/CD Pipelines","Infrastructure as Code"] },
  { title: "Databases",              label: "Databases", color: T.cyan,    Icon: Database, skills: ["PostgreSQL","Snowflake","BigQuery","AWS Redshift","SQL Server","Azure SQL","Redis","MySQL"] },
  { title: "Languages & Frameworks", label: "Languages", color: T.green,   Icon: Code2,    skills: ["Python","SQL / T-SQL","TypeScript","JavaScript","Node.js","Angular","REST APIs","Event-Driven APIs"] },
  { title: "Quality & Observability",label: "Quality",   color: T.amber,   Icon: Activity, skills: ["Great Expectations","Data Contracts","Pipeline Monitoring","Data Lineage","dbt Tests","App Insights","Schema Governance"] },
];

const CURRENT = {
  period: "Oct 2024 – Present",
  role: "Senior Data Engineer",
  company: "TitanFX",
  location: "Remote",
  Icon: Briefcase,
  color: T.blue,
  tag: "Current",
  bullets: [
    "Designed microservice-based backend apps on AWS using Terraform for fault-tolerant deployments.",
    "Built advanced Redshift data models in DBT with modular, version-controlled transformations.",
    "Implemented RESTful and event-driven APIs with secure auth, data contracts, and schema governance.",
  ],
};

const CORNER_DEFS = [
  { top: 10,    left:  10, bt: true,  bl: true,  br_: false, bb: false, br: "6px 0 0 0" },
  { top: 10,    right: 10, bt: true,  bl: false, br_: true,  bb: false, br: "0 6px 0 0" },
  { bottom: 10, left:  10, bt: false, bl: true,  br_: false, bb: true,  br: "0 0 0 6px" },
  { bottom: 10, right: 10, bt: false, bl: false, br_: true,  bb: true,  br: "0 0 6px 0" },
] as const;

const YEARS = ["2013","2018","2019","2021","2023","2024"];

export default function ThemePreview() {
  const [activeSkill, setActiveSkill] = useState(0);
  const skillsRef  = useRef<HTMLDivElement>(null);
  const skillsInView = useInView(skillsRef, { once: true, amount: 0 });
  const cat = categories[activeSkill];

  return (
    <>
      <style>{`
        .lp { background:${T.bg}; color:${T.text1}; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif; min-height:100vh; overflow-x:hidden; }

        /* scrollbar */
        .lp ::-webkit-scrollbar { width:5px; }
        .lp ::-webkit-scrollbar-track  { background:${T.bg}; }
        .lp ::-webkit-scrollbar-thumb  { background:${T.border}; border-radius:3px; }
        .lp ::-webkit-scrollbar-thumb:hover { background:${T.blue}; }

        /* gradient text */
        .lp-grad { background:linear-gradient(135deg,${T.blue},${T.violet}); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }

        /* primary button — gradient stays, but border darkens slightly */
        .lp-btn-primary {
          display:inline-flex !important; align-items:center !important; gap:8px !important;
          padding:11px 28px !important; border-radius:8px !important; cursor:pointer !important;
          text-decoration:none !important; white-space:nowrap !important;
          font-weight:600 !important; font-size:0.875rem !important; color:#fff !important;
          background:linear-gradient(135deg,${T.blue} 0%,${T.violet} 100%) !important;
          border:1px solid rgba(124,58,237,0.4) !important;
          box-shadow:0 2px 16px rgba(37,99,235,0.3), 0 0 0 0 transparent !important;
          transition:box-shadow 0.25s, filter 0.25s !important;
        }
        .lp-btn-primary:hover { filter:brightness(1.1) !important; box-shadow:0 4px 24px rgba(37,99,235,0.45) !important; }

        /* ghost button — black border, no glass */
        .lp-btn-ghost {
          display:inline-flex !important; align-items:center !important; gap:8px !important;
          padding:11px 28px !important; border-radius:8px !important; cursor:pointer !important;
          text-decoration:none !important; white-space:nowrap !important;
          font-weight:600 !important; font-size:0.875rem !important;
          color:${T.text1} !important; background:transparent !important;
          border:1.5px solid ${T.borderMid} !important;
          transition:all 0.2s !important;
        }
        .lp-btn-ghost:hover { border-color:${T.blue} !important; color:${T.blue} !important; }

        /* nav */
        .lp-nav-desktop { display:none !important; }
        .lp-nav-burger  { display:flex !important; }
        @media (min-width:768px) {
          .lp-nav-desktop { display:flex !important; }
          .lp-nav-burger  { display:none !important; }
        }

        /* section headings */
        .lp-h2 { font-size:1.875rem; font-weight:800; color:${T.text1}; text-align:center; }
        @media (min-width:768px) { .lp-h2 { font-size:2.25rem; } }

        /* hero */
        @keyframes lp-pulse { 0%,100%{opacity:1} 50%{opacity:0.45} }
        @media (max-width:639px) {
          .lp-hero-content { padding-left:20px !important; padding-right:20px !important; }
        }

        /* skill nodes */
        .lp-sk-node { cursor:pointer; background:none; border:none; padding:0; position:absolute; }
        .lp-sk-node:focus-visible { outline:2px solid ${T.blue}; border-radius:50%; }
        @media (max-width:540px) {
          .lp-sk-wrap  { display:flex; justify-content:center; }
          .lp-sk-inner { flex-shrink:0; transform:scale(0.58); transform-origin:top center; margin-bottom:-182px !important; }
        }
        @media (min-width:541px) and (max-width:820px) {
          .lp-sk-wrap  { display:flex; justify-content:center; }
          .lp-sk-inner { flex-shrink:0; transform:scale(0.78); transform-origin:top center; margin-bottom:-95px !important; }
        }

        /* contact inputs */
        .lp-input {
          width:100%; background:${T.surface}; border:1.5px solid ${T.border};
          border-radius:10px; padding:12px 16px; font-size:14px; color:${T.text1};
          outline:none; box-sizing:border-box; font-family:inherit;
          transition:border-color 0.2s, box-shadow 0.2s;
        }
        .lp-input:focus { border-color:${T.blue}; box-shadow:0 0 0 3px rgba(37,99,235,0.12); }
        .lp-input::placeholder { color:${T.text4}; }

        /* social icons */
        .lp-social {
          width:44px; height:44px; border-radius:10px; background:${T.surface};
          border:1.5px solid ${T.border}; display:flex; align-items:center; justify-content:center;
          color:${T.text3}; text-decoration:none; transition:border-color 0.2s, color 0.2s, box-shadow 0.2s;
        }
        .lp-social:hover { border-color:${T.blue}; color:${T.blue}; box-shadow:0 2px 12px rgba(37,99,235,0.18); }

        /* contact grid */
        .lp-ct-grid { display:flex; flex-direction:column; gap:52px; }
        @media (min-width:820px) { .lp-ct-grid { display:grid; grid-template-columns:1fr 400px; gap:72px; } }

        /* availability pulse */
        @keyframes lp-avail { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>

      <div className="lp">

        {/* ── BANNER ─────────────────────────────────────────────── */}
        <div style={{
          background: `rgba(37,99,235,0.06)`,
          borderBottom: `1px solid ${T.border}`,
          padding: "10px 24px",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
        }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 8, color: T.text2, textDecoration: "none", fontSize: 13, fontWeight: 500 }}>
            <ArrowLeft size={14} /> Back to live portfolio
          </a>
          <span style={{ fontSize: 12, fontWeight: 700, color: T.blue, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Theme Preview · Light Mode
          </span>
          <div style={{ width: 160 }} />
        </div>

        {/* ── NAVBAR ─────────────────────────────────────────────── */}
        <nav style={{
          position: "sticky", top: 0, zIndex: 50,
          background: "rgba(255,255,255,0.92)", backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          borderBottom: `1px solid ${T.border}`,
          boxShadow: "0 1px 12px rgba(0,0,0,0.06)",
        }}>
          <div style={{ width: "100%", padding: "0 48px", height: 68, display: "flex", alignItems: "center" }}>
            <Image src="/jda-logo.png" alt="JDA Logo" width={48} height={48} style={{ objectFit: "contain" }} />

            <div className="lp-nav-desktop" style={{ marginLeft: "auto", marginRight: 80, alignItems: "center", gap: 6 }}>
              {["Home","About","Experience","Skills","Contact"].map((label, i) => (
                <button key={label} style={{
                  background: "none", border: "none", cursor: "pointer", position: "relative",
                  padding: "8px 18px", fontSize: 15,
                  fontWeight: i === 0 ? 600 : 400,
                  color: i === 0 ? T.text1 : T.text2,
                  transition: "color 0.15s",
                }}>
                  {label}
                  {i === 0 && (
                    <span style={{
                      position: "absolute", bottom: 5, left: "50%", transform: "translateX(-50%)",
                      height: 2, width: 22, borderRadius: 99,
                      background: `linear-gradient(90deg,${T.blue},${T.violet})`,
                      display: "block",
                    }} />
                  )}
                </button>
              ))}
            </div>

            <div className="lp-nav-burger" style={{ marginLeft: "auto" }}>
              <button style={{
                background: "none", border: `1px solid ${T.border}`, borderRadius: 8,
                cursor: "pointer", color: T.text2, padding: "11px 13px",
                minWidth: 44, minHeight: 44, display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
                </svg>
              </button>
            </div>
          </div>
        </nav>

        {/* ── HERO ───────────────────────────────────────────────── */}
        <section style={{
          position: "relative", minHeight: "100vh", overflow: "hidden",
          background: T.bg, display: "flex", flexDirection: "column", justifyContent: "center",
        }}>
          {/* Illustration — white fade instead of dark */}
          <motion.div
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: "75%", zIndex: 1 }}
          >
            <Image src="/hero-white.png" alt="Joshua D. Abad" fill priority style={{ objectFit: "contain", objectPosition: "right center" }} />
            {/* White gradient fade — matches white background */}
            <div style={{
              position: "absolute", inset: 0,
              background: `linear-gradient(to right, #fff 0%, rgba(255,255,255,0.6) 4%, rgba(255,255,255,0.15) 9%, transparent 14%)`,
            }} />
          </motion.div>

          {/* Text content */}
          <div className="lp-hero-content" style={{ position: "relative", zIndex: 2, width: "100%", padding: "100px 48px 60px" }}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              style={{ maxWidth: 540 }}
            >
              {/* Available badge */}
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 24, fontSize: 14, color: T.text2 }}>
                <span style={{
                  width: 8, height: 8, borderRadius: "50%", background: T.green,
                  display: "inline-block", animation: "lp-pulse 2s infinite",
                  boxShadow: `0 0 6px ${T.green}`,
                }} />
                Available for part-time opportunities 5PM SGT onwards
              </div>

              <p style={{ color: T.text2, fontSize: 18, marginBottom: 8 }}>Hi, I&apos;m</p>

              <h1 style={{ fontSize: "clamp(3.5rem,6vw,5.5rem)", fontWeight: 800, lineHeight: 1.1, marginBottom: 16 }}>
                <span className="lp-grad">Josh</span>
              </h1>

              <div style={{ marginBottom: 24 }}>
                <TypeAnimation
                  sequence={["Data Engineer",2500,"ETL Architect",2500,"Pipeline Builder",2500,"Cloud Specialist",2500]}
                  wrapper="span"
                  speed={55}
                  repeat={Infinity}
                  style={{ fontSize: "clamp(1.1rem,2vw,1.4rem)", fontWeight: 600, color: T.blue }}
                />
              </div>

              <p style={{ color: "#374151", fontSize: 18, lineHeight: 1.7, marginBottom: 32, maxWidth: 460 }}>
                I design and build data systems that move, transform, and deliver insights at scale.
                With 7+ years of experience across ETL architecture, cloud platforms, and real-time
                pipelines — I turn complex data challenges into clean, reliable solutions.
              </p>

              {/* Social icons */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
                {[
                  { href: "https://github.com/AbadJosh",             Icon: GithubIcon },
                  { href: "https://www.linkedin.com/in/joshua-abad/", Icon: LinkedinIcon },
                ].map(({ href, Icon }) => (
                  <a key={href} href={href} target="_blank" rel="noopener noreferrer"
                    style={{
                      width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center",
                      borderRadius: 8, border: `1px solid ${T.border}`, background: T.surface,
                      color: T.text2, textDecoration: "none", transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLAnchorElement;
                      el.style.borderColor = T.blue; el.style.color = T.blue;
                      el.style.boxShadow = "0 2px 10px rgba(37,99,235,0.18)";
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLAnchorElement;
                      el.style.borderColor = T.border; el.style.color = T.text2;
                      el.style.boxShadow = "none";
                    }}
                  >
                    <Icon size={18} />
                  </a>
                ))}
              </div>

              {/* Buttons */}
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <a href="#experience" className="lp-btn-primary">View My Work</a>
                <a href="#contact"    className="lp-btn-ghost">Get In Touch</a>
              </div>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              style={{
                display: "flex", flexWrap: "wrap", gap: 40,
                marginTop: 48, paddingTop: 28,
                borderTop: `1px solid ${T.border}`,
                maxWidth: 480, position: "relative", zIndex: 2,
              }}
            >
              {[
                { value: "7+",             label: "Years Experience" },
                { value: "200+",           label: "Pipelines Built" },
                { value: "Terabyte-Scale", label: "Data Processed" },
                { value: "3",             label: "Cloud Platforms" },
              ].map((s) => (
                <div key={s.label}>
                  <p style={{ fontSize: s.value.length > 4 ? 16 : 24, fontWeight: 800, color: T.text1, letterSpacing: s.value.length > 4 ? "-0.02em" : "normal" }}>{s.value}</p>
                  <p style={{ fontSize: 12, color: T.text3, marginTop: 2 }}>{s.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── EXPERIENCE ─────────────────────────────────────────── */}
        <section id="experience" style={{ background: T.bg, padding: "100px 0", overflowX: "hidden" }}>
          <style>{`
            .exp-dot-btn {
              display:flex; flex-direction:column; align-items:center; gap:8px;
              background:none; border:none; cursor:pointer; padding:4px 6px;
              position:relative; z-index:1; min-width:44px;
            }
            .exp-dot-btn:focus-visible { outline:2px solid ${CURRENT.color}; border-radius:4px; }
          `}</style>
          <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 48px" }}>
            <div style={{ textAlign: "center", marginBottom: 60 }}>
              <h2 className="lp-h2">Experience &amp; Education</h2>
            </div>

            {/* ── Same dark 3D card as original ── */}
            <div style={{ position: "relative", borderRadius: 20, overflow: "hidden",
              background: "linear-gradient(150deg, #0d1530 0%, #07101f 100%)",
              border: `1.5px solid ${CURRENT.color}`,
              boxShadow: `0 0 10px ${CURRENT.color}, 0 0 28px ${CURRENT.color}99, 0 0 60px ${CURRENT.color}44, inset 0 0 24px ${CURRENT.color}0a`,
            }}>
              {/* Corner accents */}
              {CORNER_DEFS.map((c, i) => (
                <div key={i} style={{
                  position: "absolute",
                  top: (c as any).top, left: (c as any).left,
                  right: (c as any).right, bottom: (c as any).bottom,
                  width: 22, height: 22,
                  borderTop:    c.bt  ? `2px solid ${CURRENT.color}cc` : undefined,
                  borderBottom: c.bb  ? `2px solid ${CURRENT.color}cc` : undefined,
                  borderLeft:   c.bl  ? `2px solid ${CURRENT.color}cc` : undefined,
                  borderRight:  c.br_ ? `2px solid ${CURRENT.color}cc` : undefined,
                  borderRadius: c.br,
                  pointerEvents: "none",
                }} />
              ))}
              {/* Ambient glow */}
              <div style={{ position: "absolute", top: -100, right: -100, width: 320, height: 320, borderRadius: "50%",
                background: `radial-gradient(circle, ${CURRENT.color}12 0%, transparent 65%)`, pointerEvents: "none" }} />

              <div style={{ padding: "34px 40px" }}>
                {/* Tag + period */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                  <span style={{
                    fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
                    padding: "4px 12px", borderRadius: 99,
                    background: `${CURRENT.color}18`, color: CURRENT.color,
                    border: `1px solid ${CURRENT.color}55`,
                    boxShadow: `0 0 8px ${CURRENT.color}55`,
                  }}>{CURRENT.tag}</span>
                  <span style={{ color: "#475569", fontSize: 12 }}>{CURRENT.period}</span>
                </div>

                {/* Role + company */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 24 }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: 14, flexShrink: 0,
                    background: `${CURRENT.color}15`, border: `1px solid ${CURRENT.color}44`,
                    boxShadow: `0 0 12px ${CURRENT.color}33`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <CURRENT.Icon size={22} style={{ color: CURRENT.color }} />
                  </div>
                  <div>
                    <h3 style={{ margin: "0 0 4px", fontSize: 21, fontWeight: 700, color: "#fff", lineHeight: 1.2 }}>{CURRENT.role}</h3>
                    <p style={{ margin: "0 0 2px", fontSize: 14, fontWeight: 600, color: CURRENT.color, textShadow: `0 0 10px ${CURRENT.color}88` }}>{CURRENT.company}</p>
                    <p style={{ margin: 0, fontSize: 12, color: "#475569" }}>{CURRENT.location}</p>
                  </div>
                </div>

                {/* Bullets */}
                <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                  {CURRENT.bullets.map((b, i) => (
                    <li key={i} style={{ display: "flex", gap: 11, alignItems: "flex-start" }}>
                      <span style={{ marginTop: 8, width: 5, height: 5, borderRadius: "50%", background: CURRENT.color, boxShadow: `0 0 5px ${CURRENT.color}`, flexShrink: 0 }} />
                      <span style={{ fontSize: 13.5, color: "#94a3b8", lineHeight: 1.7 }}>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* ── Horizontal timeline — same as original ── */}
            <div style={{ maxWidth: 700, margin: "64px auto 0" }}>
              <div style={{ position: "relative", padding: "0 16px" }}>
                {/* Track */}
                <div style={{ position: "absolute", top: 14, left: 48, right: 48, height: 3, background: "#0d1e35", borderRadius: 3 }} />
                {/* Fill */}
                <div style={{
                  position: "absolute", top: 14, left: 48, height: 3, borderRadius: 3,
                  background: `linear-gradient(90deg, ${T.blue}, ${CURRENT.color})`,
                  width: "calc(100% - 96px)",
                  boxShadow: `0 0 8px ${CURRENT.color}99`,
                }} />
                {/* Dots */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  {YEARS.map((year, i) => {
                    const isActive = i === 5;
                    const isPast   = i < 5;
                    return (
                      <button key={i} className="exp-dot-btn" title={year}>
                        <div style={{ position: "relative", width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {isActive && (
                            <motion.div
                              animate={{ scale: [1, 1.7], opacity: [0.7, 0] }}
                              transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
                              style={{ position: "absolute", inset: -2, borderRadius: "50%", border: `1.5px solid ${CURRENT.color}`, pointerEvents: "none" }}
                            />
                          )}
                          <div style={{
                            width: 28, height: 28, borderRadius: "50%",
                            border: `2px solid ${isActive ? CURRENT.color : isPast ? "#1e3a5f" : "#0d1e35"}`,
                            background: "#050b18",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            boxShadow: isActive ? `0 0 12px ${CURRENT.color}, 0 0 28px ${CURRENT.color}88` : "none",
                            transform: isActive ? "scale(1.25)" : "scale(1)",
                            transition: "all 0.3s ease",
                          }}>
                            <div style={{
                              width: 11, height: 11, borderRadius: "50%",
                              background: isActive ? CURRENT.color : isPast ? "#1e3a5f" : "#0d1e35",
                              boxShadow: isActive ? `0 0 6px ${CURRENT.color}` : "none",
                              transition: "all 0.3s ease",
                            }} />
                          </div>
                        </div>
                        <span style={{
                          fontSize: 12, fontWeight: isActive ? 700 : 500,
                          color: isActive ? CURRENT.color : "#334155",
                          textShadow: isActive ? `0 0 10px ${CURRENT.color}` : "none",
                          whiteSpace: "nowrap",
                        }}>{year}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SKILLS ─────────────────────────────────────────────── */}
        <section id="skills" style={{ background: T.bg, padding: "100px 0" }}>
          {/* Thin top divider */}
          <div style={{ height: 1, background: T.border, marginBottom: 0 }} />
          <div style={{ maxWidth: 760, margin: "0 auto", padding: "100px 24px 0" }} ref={skillsRef}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={skillsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              style={{ textAlign: "center", marginBottom: 60 }}
            >
              <h2 className="lp-h2">Skills</h2>
              <p style={{ color: T.text3, fontSize: 14, marginTop: 12 }}>
                7+ years across data engineering, cloud infrastructure, and software development
              </p>
            </motion.div>

            <motion.div
              className="lp-sk-wrap"
              initial={{ opacity: 0, y: 24 }}
              animate={skillsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <div className="lp-sk-inner" style={{ position: "relative", width: SVG_W, height: SVG_H, margin: "0 auto" }}>
                <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
                  <defs>
                    <filter id="lp-sk-glow" x="-40%" y="-40%" width="180%" height="180%">
                      <feGaussianBlur stdDeviation="2.5" result="blur" />
                      <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                  </defs>
                  {/* Base polygon — light gray on white */}
                  <polygon
                    points={pts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ")}
                    fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="1.5"
                  />
                  {/* Base star lines */}
                  {starLines.map(([a, b], i) => (
                    <line key={i} x1={pts[a].x} y1={pts[a].y} x2={pts[b].x} y2={pts[b].y}
                      stroke="rgba(0,0,0,0.06)" strokeWidth="1" />
                  ))}
                  {/* Active polygon edges — colored + glowing */}
                  {[0,1,2,3,4].map(i => {
                    const j = (i + 1) % 5;
                    if (i !== activeSkill && j !== activeSkill) return null;
                    return <line key={`ae${i}`} x1={pts[i].x} y1={pts[i].y} x2={pts[j].x} y2={pts[j].y}
                      stroke={cat.color} strokeWidth="2" opacity="0.85" filter="url(#lp-sk-glow)" />;
                  })}
                  {/* Active star lines */}
                  {starLines.map(([a, b], i) => {
                    if (a !== activeSkill && b !== activeSkill) return null;
                    return <line key={`as${i}`} x1={pts[a].x} y1={pts[a].y} x2={pts[b].x} y2={pts[b].y}
                      stroke={cat.color} strokeWidth="1.5" opacity="0.5" filter="url(#lp-sk-glow)" />;
                  })}
                  <circle cx={CX} cy={CY} r="6" fill={cat.color} opacity="0.7" />
                </svg>

                {categories.map((c, i) => {
                  const p  = pts[i];
                  const on = i === activeSkill;
                  const { Icon } = c;
                  return (
                    <motion.button
                      key={i}
                      className="lp-sk-node"
                      onClick={() => setActiveSkill(i)}
                      title={c.title}
                      style={{ left: p.x - NODE_R, top: p.y - NODE_R, width: NODE_R * 2, height: NODE_R * 2 }}
                      animate={{ scale: on ? 1.1 : 1 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                      {on && (
                        <motion.div
                          animate={{ scale: [1, 1.8], opacity: [0.4, 0] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                          style={{ position: "absolute", inset: -6, borderRadius: "50%", border: `1.5px solid ${c.color}`, pointerEvents: "none" }}
                        />
                      )}
                      <div style={{
                        width: "100%", height: "100%", borderRadius: "50%",
                        background: on ? T.surface : T.bg,
                        border: `2px solid ${on ? c.color : T.border}`,
                        boxShadow: on
                          ? `0 0 0 1px ${c.color}40, 0 4px 20px ${c.color}30, 0 0 28px ${c.color}20`
                          : `0 1px 4px rgba(0,0,0,0.08)`,
                        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 5,
                        transition: "all 0.35s ease",
                      }}>
                        <Icon size={22} style={{
                          color: on ? c.color : T.text3,
                          transition: "all 0.35s",
                        }} />
                        <span style={{
                          fontSize: 8, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase",
                          textAlign: "center", color: on ? c.color : T.text3,
                          lineHeight: 1.25, maxWidth: 72, transition: "all 0.35s",
                        }}>{c.label}</span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>

            {/* Skills reveal panel */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={skillsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.45 }}
              style={{ marginTop: 40 }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSkill}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div style={{ textAlign: "center", marginBottom: 22 }}>
                    <span style={{
                      display: "inline-block", padding: "6px 22px", borderRadius: 99,
                      fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase",
                      color: cat.color, border: `1px solid ${cat.color}50`,
                      background: `${cat.color}0c`,
                    }}>{cat.title}</span>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
                    {cat.skills.map((skill, i) => (
                      <motion.span
                        key={skill}
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.045, duration: 0.2 }}
                        style={{
                          padding: "8px 18px", borderRadius: 7,
                          fontSize: 13, fontWeight: 500,
                          background: T.surface,
                          border: `1px solid ${cat.color}35`,
                          color: T.text2,
                          boxShadow: `0 1px 4px rgba(0,0,0,0.06)`,
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

        {/* ── CONTACT ────────────────────────────────────────────── */}
        <section id="contact" style={{ background: T.bg, padding: "100px 0", borderTop: `1px solid ${T.border}` }}>
          <div style={{ maxWidth: 1060, margin: "0 auto", padding: "0 48px" }}>
            <div style={{ textAlign: "center", marginBottom: 72 }}>
              <h2 className="lp-h2">Get In Touch</h2>
              <p style={{ color: T.text3, fontSize: 14, marginTop: 12 }}>Have a project in mind or just want to connect? Drop me a message.</p>
            </div>

            <div className="lp-ct-grid">
              {/* Form */}
              <form onSubmit={(e) => e.preventDefault()} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {[
                  { label: "Name",    type: "text",  ph: "Your name" },
                  { label: "Email",   type: "email", ph: "your@email.com" },
                  { label: "Message", type: "area",  ph: "What's on your mind?" },
                ].map(({ label, type, ph }) => (
                  <div key={label} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase", color: T.text2 }}>{label}</label>
                    {type === "area"
                      ? <textarea rows={6} className="lp-input" placeholder={ph} style={{ resize: "none" }} />
                      : <input type={type} className="lp-input" placeholder={ph} />
                    }
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 4 }}>
                  <button type="submit" className="lp-btn-primary">Send Message</button>
                </div>
              </form>

              {/* Info panel */}
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {/* Availability */}
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 9,
                  padding: "8px 18px", borderRadius: 99, alignSelf: "flex-start",
                  background: `${T.emerald}0e`, border: `1px solid ${T.emerald}35`,
                }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: T.emerald, display: "inline-block", animation: "lp-avail 2.2s ease-in-out infinite", boxShadow: `0 0 5px ${T.emerald}` }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: T.emerald }}>Available for new opportunities</span>
                </div>

                {/* Email card */}
                <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "18px 22px", borderRadius: 14, background: T.surface, border: `1px solid ${T.border}`, boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
                  <div style={{ width: 44, height: 44, borderRadius: 11, flexShrink: 0, background: `${T.blue}10`, border: `1px solid ${T.blue}30`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Mail size={18} style={{ color: T.blue }} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.text3, marginBottom: 4 }}>Email</p>
                    <p style={{ fontSize: 13, color: T.text2, fontWeight: 500, wordBreak: "break-all" }}>joshua.abad.development@gmail.com</p>
                  </div>
                </div>

                {/* Location card */}
                <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "18px 22px", borderRadius: 14, background: T.surface, border: `1px solid ${T.border}`, boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
                  <div style={{ width: 44, height: 44, borderRadius: 11, flexShrink: 0, background: `${T.violet}10`, border: `1px solid ${T.violet}30`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <MapPin size={18} style={{ color: T.violet }} />
                  </div>
                  <div>
                    <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.text3, marginBottom: 4 }}>Location</p>
                    <p style={{ fontSize: 13, color: T.text2, fontWeight: 500 }}>Calabarzon, Philippines · Remote</p>
                  </div>
                </div>

                {/* Socials */}
                <div style={{ padding: "20px 22px", borderRadius: 14, background: T.surface, border: `1px solid ${T.border}`, boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
                  <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.text3, marginBottom: 16 }}>Connect</p>
                  <div style={{ display: "flex", gap: 12 }}>
                    <a href="https://github.com/AbadJosh"              target="_blank" rel="noopener noreferrer" className="lp-social"><GithubIcon size={18} /></a>
                    <a href="https://www.linkedin.com/in/joshua-abad/" target="_blank" rel="noopener noreferrer" className="lp-social"><LinkedinIcon size={18} /></a>
                    <a href="mailto:joshua.abad.development@gmail.com"  className="lp-social"><Mail size={18} /></a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FOOTER ─────────────────────────────────────────────── */}
        <footer style={{ background: T.surface, borderTop: `1px solid ${T.border}`, padding: "32px 48px", textAlign: "center" }}>
          <p style={{ fontSize: 13, color: T.text3 }}>© 2026 Joshua D. Abad · Built with Next.js</p>
          <p style={{ fontSize: 12, color: T.text4, marginTop: 8 }}>
            ← <a href="/" style={{ color: T.blue, textDecoration: "none" }}>Back to live portfolio</a> to compare
          </p>
        </footer>

      </div>
    </>
  );
}
