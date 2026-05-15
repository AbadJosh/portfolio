"use client";

import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import Image from "next/image";
import { ArrowRight, Download } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons";

export default function Hero() {
  const scrollTo = (id: string) =>
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      id="home"
      style={{
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden",
        background: "#050b18",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      {/* Hero illustration — right 75% of screen */}
      <motion.div
        initial={{ opacity: 0, x: 80 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9, delay: 0.2 }}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          width: "75%",
          zIndex: 1,
        }}
      >
        <Image
          src="/hero.png"
          alt="Joshua D. Abad"
          fill
          priority
          style={{ objectFit: "contain", objectPosition: "right center" }}
        />
        {/* Gradient: dark on left → transparent on right so text stays readable */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to right, #050b18 0%, rgba(5,11,24,0.5) 3%, rgba(5,11,24,0.1) 6%, transparent 10%)",
          }}
        />
      </motion.div>

      {/* Text content — left side, layered above image */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          padding: "100px 48px 60px",
        }}
      >
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          style={{ maxWidth: 540 }}
        >
          {/* Available badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 24,
              fontSize: 14,
              color: "rgba(148,163,184,1)",
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#34d399",
                display: "inline-block",
                animation: "pulse 2s infinite",
              }}
            />
            Available for part-time opportunities 5PM SGT onwards
          </div>

          <p style={{ color: "rgba(148,163,184,1)", fontSize: 18, marginBottom: 8 }}>
            Hi, I&apos;m
          </p>

          <h1
            style={{
              fontSize: "clamp(3.5rem, 6vw, 5.5rem)",
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: 16,
            }}
          >
            <span className="gradient-text">Josh</span>
          </h1>

          {/* Typewriter role */}
          <div style={{ marginBottom: 24 }}>
            <TypeAnimation
              sequence={[
                "Data Engineer", 2500,
                "ETL Architect", 2500,
                "Pipeline Builder", 2500,
                "Cloud Specialist", 2500,
              ]}
              wrapper="span"
              speed={55}
              repeat={Infinity}
              style={{
                fontSize: "clamp(1.1rem, 2vw, 1.4rem)",
                fontWeight: 600,
                color: "#3b82f6",
              }}
            />
          </div>

          <p
            style={{
              color: "rgba(255,255,255,0.85)",
              fontSize: 18,
              lineHeight: 1.7,
              marginBottom: 32,
              maxWidth: 460,
            }}
          >
            I design and build data systems that move, transform, and deliver insights at
            scale. With 7+ years of experience across ETL architecture, cloud platforms,
            and real-time pipelines — I turn complex data challenges into clean, reliable
            solutions that drive real business impact.
          </p>

          {/* Social icons */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
            <a
              href="https://github.com/jabadDEV"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                width: 40,
                height: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 8,
                border: "1px solid #1e3a5f",
                color: "rgba(148,163,184,1)",
                textDecoration: "none",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "#3b82f6";
                (e.currentTarget as HTMLAnchorElement).style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "#1e3a5f";
                (e.currentTarget as HTMLAnchorElement).style.color = "rgba(148,163,184,1)";
              }}
            >
              <GithubIcon size={18} />
            </a>
            <a
              href="https://www.linkedin.com/in/joshua-abad/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                width: 40,
                height: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 8,
                border: "1px solid #1e3a5f",
                color: "rgba(148,163,184,1)",
                textDecoration: "none",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "#3b82f6";
                (e.currentTarget as HTMLAnchorElement).style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "#1e3a5f";
                (e.currentTarget as HTMLAnchorElement).style.color = "rgba(148,163,184,1)";
              }}
            >
              <LinkedinIcon size={18} />
            </a>
          </div>

          {/* CTAs */}
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12 }}>
            <button onClick={() => scrollTo("#projects")} className="btn-primary">
              View My Work <ArrowRight size={15} />
            </button>
            <a href="/resume.pdf" download className="btn-ghost">
              <Download size={15} /> Resume
            </a>
          </div>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 40,
            marginTop: 48,
            paddingTop: 28,
            borderTop: "1px solid rgba(30,58,95,0.5)",
            maxWidth: 480,
            position: "relative",
            zIndex: 2,
          }}
        >
          {[
            { value: "7+",            label: "Years Experience" },
            { value: "200+",          label: "Pipelines Built" },
            { value: "Terabyte-Scale", label: "Data Processed" },
            { value: "3",             label: "Cloud Platforms" },
          ].map((s) => (
            <div key={s.label}>
              <p style={{ fontSize: s.value.length > 4 ? 16 : 24, fontWeight: 800, color: "#fff", letterSpacing: s.value.length > 4 ? "-0.02em" : "normal" }}>{s.value}</p>
              <p style={{ fontSize: 12, color: "rgba(100,116,139,1)", marginTop: 2 }}>{s.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
