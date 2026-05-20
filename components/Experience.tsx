"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView, useAnimation } from "framer-motion";
import { Briefcase, GraduationCap, Code2, TrendingUp, Cpu } from "lucide-react";

const timeline = [
  {
    year: "2013",
    period: "Jun 2013 – May 2018",
    role: "BS Computer Engineering",
    company: "Technological Institute of the Philippines",
    location: "Philippines",
    icon: GraduationCap,
    color: "#94a3b8",
    tag: "Education",
    bullets: [
      "Foundation in computer science, database systems, algorithms, and software engineering.",
      "Champion – Global Problem Solver Skills Competition, Cisco Networking Academy PH 2017.",
      "Gold Merit Award – Best Design Projects, 27th CpE Design Project Exhibit 2018.",
    ],
  },
  {
    year: "2018",
    period: "Jul 2018 – Sep 2019",
    role: "Data Engineer",
    company: "W-tech Solutions Inc.",
    location: "Makati City, Philippines",
    icon: Code2,
    color: "#6366f1",
    tag: "Work",
    bullets: [
      "Built automated reporting pipelines (daily, weekly, monthly, annual) delivering analytical insights to stakeholders.",
      "Designed KPI dashboards tracking business performance metrics across departments.",
      "Developed Python scripts for automated data ingestion and cleansing powering business reports.",
      "Built a risk detection system to identify and flag fraudulent customer activity across transactional data.",
    ],
  },
  {
    year: "2019",
    period: "Dec 2019 – Jul 2021",
    role: "Software Engineer",
    company: "Bayview Technologies Inc.",
    location: "Makati City, Philippines",
    icon: Cpu,
    color: "#3b82f6",
    tag: "Work",
    bullets: [
      "Delivered full-stack features and components for a customer-facing MEAN stack web application.",
      "Architected a customer service data warehouse in BigQuery with department-scoped data marts and ingestion pipelines.",
      "Deployed Apache Superset as a self-serve analytics platform, enabling data analysts to explore and query data independently.",
      "Built stakeholder dashboards in Data Studio (now Looker Studio) covering infrastructure cost, fraudulent customer activity, and chatbot performance monitoring.",
    ],
  },
  {
    year: "2021",
    period: "Jul 2021 – Sep 2024",
    role: "Consultant Senior Data Engineer",
    company: "FLNT",
    location: "Remote",
    icon: TrendingUp,
    color: "#8b5cf6",
    tag: "Work",
    bullets: [
      "Built data pipelines and integrations for real estate data as core product data services.",
      "Developed CI/CD pipelines in Azure DevOps for ADF; integrated Application Insights for monitoring.",
      "Led migration of data stack to Azure Databricks and built executive analytical reports in Power BI.",
    ],
  },
  {
    year: "2023",
    period: "Jun 2023 – Mar 2024",
    role: "Consultant Senior Data Engineer",
    company: "LTVplus",
    location: "Remote",
    icon: Briefcase,
    color: "#06b6d4",
    tag: "Work",
    bullets: [
      "Developed data pipelines and led API integration for the store's POS system.",
      "Built end-to-end Azure data infrastructure supporting all Microsoft 365 systems.",
      "Designed data models and delivered operational sales reporting using Power BI.",
    ],
  },
  {
    year: "2024",
    period: "Oct 2024 – Present",
    role: "Senior Data Engineer",
    company: "TitanFX",
    location: "Remote",
    icon: Briefcase,
    color: "#3b82f6",
    tag: "Current",
    bullets: [
      "Designed microservice-based backend apps on AWS using Terraform for fault-tolerant deployments.",
      "Built advanced Redshift data models in DBT with modular, version-controlled transformations.",
      "Implemented RESTful and event-driven APIs with secure auth, data contracts, and schema governance.",
    ],
  },
];

const SLANT = 28; // base rotateY degrees

export default function Experience() {
  const [active, setActive]       = useState(timeline.length - 1);
  const [direction, setDirection] = useState(1);
  const ref                       = useRef(null);
  const inView                    = useInView(ref, { once: true, margin: "-80px" });
  const stackControls             = useAnimation();

  const select = async (i: number) => {
    if (i === active) return;
    const fwd = i > active;
    setDirection(fwd ? 1 : -1);

    // Phase 1 — shuffle: tilt stack further back (forward) or pull toward viewer (backward)
    await stackControls.start({
      rotateY: fwd ? SLANT + 22 : SLANT - 18,
      transition: { duration: 0.18, ease: "easeIn" },
    });

    // Phase 2 — swap content at peak of animation
    setActive(i);

    // Phase 3 — settle back to resting slant
    stackControls.start({
      rotateY: SLANT,
      transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] },
    });
  };

  const item = timeline[active];
  const c    = item.color;

  return (
    <section id="experience" style={{ background: "#050b18", padding: "100px 0", overflowX: "hidden" }}>
      <style>{`
        .exp-dot-btn {
          display: flex; flex-direction: column; align-items: center; gap: 8px;
          background: none; border: none; cursor: pointer; padding: 4px 6px;
          position: relative; z-index: 1; min-width: 44px;
        }
        .exp-dot-btn:focus-visible { outline: 2px solid #3b82f6; border-radius: 4px; }
        @media (max-width: 479px) {
          .exp-inner       { padding: 0 20px !important; }
          .exp-card-body   { padding: 22px 20px !important; }
        }
      `}</style>

      <div className="exp-inner" style={{ maxWidth: 1000, margin: "0 auto", padding: "0 48px" }} ref={ref}>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          style={{ textAlign: "center", marginBottom: 80 }}
        >
          <h2 className="section-heading">Experience &amp; Education</h2>
        </motion.div>

        {/* ── 3D Board Stack ── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15 }}
          style={{
            perspective: "2000px",
            perspectiveOrigin: "35% 50%",
            marginBottom: 88,
          }}
        >
          {/* tilted stack wrapper — animated by stackControls */}
          <motion.div
            animate={stackControls}
            initial={{ rotateY: SLANT }}
            style={{
              position: "relative",
              height: 480,
              transformStyle: "preserve-3d",
            }}
          >
            {/* Board 3 — back (stacks to the LEFT) */}
            <div style={{
              position: "absolute", inset: 0,
              transform: "translateZ(-110px) translateX(-58px) translateY(12px)",
              borderRadius: 20,
              background: "#060c1a",
              border: `1px solid ${c}1e`,
              boxShadow: `0 0 6px ${c}1e, 0 0 18px ${c}0f`,
              transition: "border-color 0.4s, box-shadow 0.4s",
            }} />

            {/* Board 2 — mid */}
            <div style={{
              position: "absolute", inset: 0,
              transform: "translateZ(-55px) translateX(-29px) translateY(6px)",
              borderRadius: 20,
              background: "#07101f",
              border: `1px solid ${c}50`,
              boxShadow: `0 0 8px ${c}44, 0 0 22px ${c}22`,
              transition: "border-color 0.4s, box-shadow 0.4s",
            }} />

            {/* Board 1 — front (full width) */}
            <div style={{
              position: "absolute", inset: 0,
              transform: "translateZ(0)",
              borderRadius: 20,
              background: "linear-gradient(150deg, #0d1530 0%, #07101f 100%)",
              border: `1.5px solid ${c}`,
              boxShadow: `0 0 10px ${c}, 0 0 28px ${c}99, 0 0 60px ${c}44, inset 0 0 24px ${c}0a`,
              overflow: "hidden",
              transition: "border-color 0.4s, box-shadow 0.4s",
            }}>
              {/* corner accents */}
              {([
                { top: 10,    left: 10,  bt: true,  bl: true,  br: "6px 0 0 0" },
                { top: 10,    right: 10, bt: true,  br_: true, br: "0 6px 0 0" },
                { bottom: 10, left: 10,  bb: true,  bl: true,  br: "0 0 0 6px" },
                { bottom: 10, right: 10, bb: true,  br_: true, br: "0 0 6px 0" },
              ] as const).map((corner, i) => (
                <div key={i} style={{
                  position: "absolute",
                  top: (corner as any).top, left: (corner as any).left,
                  right: (corner as any).right, bottom: (corner as any).bottom,
                  width: 22, height: 22,
                  borderTop:    (corner as any).bt  ? `2px solid ${c}cc` : undefined,
                  borderBottom: (corner as any).bb  ? `2px solid ${c}cc` : undefined,
                  borderLeft:   (corner as any).bl  ? `2px solid ${c}cc` : undefined,
                  borderRight:  (corner as any).br_ ? `2px solid ${c}cc` : undefined,
                  borderRadius: corner.br,
                  pointerEvents: "none",
                }} />
              ))}

              {/* ambient glow */}
              <div style={{
                position: "absolute", top: -100, right: -100,
                width: 320, height: 320, borderRadius: "50%",
                background: `radial-gradient(circle, ${c}12 0%, transparent 65%)`,
                pointerEvents: "none",
                transition: "background 0.4s",
              }} />

              {/* content */}
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={active}
                  custom={direction}
                  initial={{ opacity: 0, x: direction * 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction * -40 }}
                  transition={{ duration: 0.22, ease: "easeInOut" }}
                  className="exp-card-body"
                  style={{ padding: "34px 40px", height: "100%", boxSizing: "border-box" }}
                >
                  {/* tag + period */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                    <span style={{
                      fontSize: 10, fontWeight: 700, letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      padding: "4px 12px", borderRadius: 99,
                      background: `${c}18`, color: c,
                      border: `1px solid ${c}55`,
                      boxShadow: `0 0 8px ${c}55`,
                    }}>{item.tag}</span>
                    <span style={{ color: "#475569", fontSize: 12 }}>{item.period}</span>
                  </div>

                  {/* role + company */}
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 24 }}>
                    <div style={{
                      width: 52, height: 52, borderRadius: 14, flexShrink: 0,
                      background: `${c}15`, border: `1px solid ${c}44`,
                      boxShadow: `0 0 12px ${c}33`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <item.icon size={22} style={{ color: c }} />
                    </div>
                    <div>
                      <h3 style={{ margin: "0 0 4px", fontSize: 21, fontWeight: 700, color: "#fff", lineHeight: 1.2 }}>
                        {item.role}
                      </h3>
                      <p style={{ margin: "0 0 2px", fontSize: 14, fontWeight: 600, color: c, textShadow: `0 0 10px ${c}88` }}>
                        {item.company}
                      </p>
                      <p style={{ margin: 0, fontSize: 12, color: "#475569" }}>{item.location}</p>
                    </div>
                  </div>

                  {/* bullets */}
                  <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                    {item.bullets.map((b, i) => (
                      <li key={i} style={{ display: "flex", gap: 11, alignItems: "flex-start" }}>
                        <span style={{
                          marginTop: 8, width: 5, height: 5, borderRadius: "50%",
                          background: c, boxShadow: `0 0 5px ${c}`, flexShrink: 0,
                        }} />
                        <span style={{ fontSize: 13.5, color: "#94a3b8", lineHeight: 1.7 }}>{b}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>

        {/* ── Horizontal Timeline ── */}
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.35 }}
          style={{ position: "relative", padding: "0 16px" }}
        >
          {/* track */}
          <div style={{
            position: "absolute", top: 14, left: 48, right: 48,
            height: 3, background: "#0d1e35", borderRadius: 3,
          }} />

          {/* fill */}
          <div style={{
            position: "absolute", top: 14, left: 48,
            height: 3, borderRadius: 3,
            background: `linear-gradient(90deg, #3b82f6, ${c})`,
            width: `calc(${(active / (timeline.length - 1)) * 100}% * ((100% - 96px) / 100%))`,
            transition: "width 0.4s ease, background 0.4s ease",
            boxShadow: `0 0 8px ${c}99`,
          }} />

          {/* dots */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            {timeline.map((t, i) => {
              const isActive = i === active;
              const isPast   = i < active;
              return (
                <button key={i} className="exp-dot-btn" onClick={() => select(i)} title={`${t.role} · ${t.company}`}>
                  <div style={{ position: "relative", width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {isActive && (
                      <motion.div
                        animate={{ scale: [1, 1.7], opacity: [0.7, 0] }}
                        transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
                        style={{
                          position: "absolute", inset: -2, borderRadius: "50%",
                          border: `1.5px solid ${t.color}`, pointerEvents: "none",
                        }}
                      />
                    )}
                    <div style={{
                      width: 28, height: 28, borderRadius: "50%",
                      border: `2px solid ${isActive ? t.color : isPast ? "#1e3a5f" : "#0d1e35"}`,
                      background: "#050b18",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      boxShadow: isActive ? `0 0 12px ${t.color}, 0 0 28px ${t.color}88` : "none",
                      transform: isActive ? "scale(1.25)" : "scale(1)",
                      transition: "all 0.3s ease",
                    }}>
                      <div style={{
                        width: 11, height: 11, borderRadius: "50%",
                        background: isActive ? t.color : isPast ? "#1e3a5f" : "#0d1e35",
                        boxShadow: isActive ? `0 0 6px ${t.color}` : "none",
                        transition: "all 0.3s ease",
                      }} />
                    </div>
                  </div>

                  <span style={{
                    fontSize: 12, fontWeight: isActive ? 700 : 500,
                    color: isActive ? t.color : "#334155",
                    textShadow: isActive ? `0 0 10px ${t.color}` : "none",
                    transition: "color 0.3s", whiteSpace: "nowrap",
                  }}>{t.year}</span>

                  {isActive && (
                    <motion.span
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{ fontSize: 10, color: "#64748b", textAlign: "center", lineHeight: 1.3, maxWidth: 88, display: "block" }}
                    >
                      {t.company}
                    </motion.span>
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>
        </div>

      </div>
    </section>
  );
}
