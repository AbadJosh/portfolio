"use client";

import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import Image from "next/image";
import { GithubIcon, LinkedinIcon } from "@/components/icons";
import { useTheme } from "@/lib/ThemeContext";

export default function Hero() {
  const { isDark } = useTheme();

  const scrollTo = (id: string) =>
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <>
      <style>{`
        @media (max-width: 639px) {
          .hero-content     { padding-left: 20px !important; padding-right: 20px !important; }
          .hero-img-overlay { background: var(--th-hero-grad-mobile) !important; }
        }
        @keyframes hero-pulse { 0%,100%{opacity:1} 50%{opacity:0.45} }
      `}</style>

      <section
        id="home"
        style={{
          position: "relative",
          minHeight: "100vh",
          overflow: "hidden",
          background: "var(--th-bg)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {/* Hero illustration — switches between dark / light version */}
        <motion.div
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: "75%", zIndex: 1 }}
        >
          <Image
            src={isDark ? "/hero.png" : "/hero-white.png"}
            alt="Joshua D. Abad"
            fill
            priority
            style={{ objectFit: "contain", objectPosition: "right center" }}
          />
          <div
            className="hero-img-overlay"
            style={{ position: "absolute", inset: 0, background: "var(--th-hero-grad)" }}
          />
        </motion.div>

        {/* Text content */}
        <div
          className="hero-content"
          style={{ position: "relative", zIndex: 2, width: "100%", padding: "100px 48px 60px" }}
        >
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            style={{ maxWidth: 540 }}
          >
            {/* Available badge */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 24, fontSize: 14, color: "var(--th-text2)" }}>
              <span style={{
                width: 8, height: 8, borderRadius: "50%",
                background: "#34d399",
                display: "inline-block",
                animation: "hero-pulse 2s infinite",
                boxShadow: "0 0 6px #34d399",
              }} />
              Available for part-time opportunities 5PM SGT onwards
            </div>

            <p style={{ color: "var(--th-text2)", fontSize: 18, marginBottom: 8 }}>
              Hi, I&apos;m
            </p>

            <h1 style={{ fontSize: "clamp(3.5rem, 6vw, 5.5rem)", fontWeight: 800, lineHeight: 1.1, marginBottom: 16 }}>
              <span className="gradient-text">Josh</span>
            </h1>

            <div style={{ marginBottom: 24 }}>
              <TypeAnimation
                sequence={["Data Engineer", 2500, "ETL Architect", 2500, "Pipeline Builder", 2500, "Cloud Specialist", 2500]}
                wrapper="span"
                speed={55}
                repeat={Infinity}
                style={{ fontSize: "clamp(1.1rem, 2vw, 1.4rem)", fontWeight: 600, color: "var(--th-blue)" }}
              />
            </div>

            <p style={{ color: "var(--th-hero-body)", fontSize: 18, lineHeight: 1.7, marginBottom: 32, maxWidth: 460 }}>
              I design and build data systems that move, transform, and deliver insights at
              scale. With 7+ years of experience across ETL architecture, cloud platforms,
              and real-time pipelines — I turn complex data challenges into clean, reliable
              solutions that drive real business impact.
            </p>

            {/* Social icons */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
              {[
                { href: "https://github.com/AbadJosh",             Icon: GithubIcon },
                { href: "https://www.linkedin.com/in/joshua-abad/", Icon: LinkedinIcon },
              ].map(({ href, Icon }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    width: 44, height: 44,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    borderRadius: 8,
                    border: "1px solid var(--th-border)",
                    background: "var(--th-surface)",
                    color: "var(--th-text2)",
                    textDecoration: "none",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.borderColor = "var(--th-blue)";
                    el.style.color = "var(--th-blue)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.borderColor = "var(--th-border)";
                    el.style.color = "var(--th-text2)";
                  }}
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>

            {/* CTA buttons */}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button onClick={() => scrollTo("#experience")} className="btn-primary">
                View My Work
              </button>
              <button onClick={() => scrollTo("#contact")} className="btn-ghost">
                Get In Touch
              </button>
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
              borderTop: "1px solid var(--th-border)",
              maxWidth: 480,
              position: "relative",
              zIndex: 2,
            }}
          >
            {[
              { value: "7+",             label: "Years Experience" },
              { value: "200+",           label: "Pipelines Built" },
              { value: "Terabyte-Scale", label: "Data Processed" },
              { value: "3",             label: "Cloud Platforms" },
            ].map((s) => (
              <div key={s.label}>
                <p style={{ fontSize: s.value.length > 4 ? 16 : 24, fontWeight: 800, color: "var(--th-text1)", letterSpacing: s.value.length > 4 ? "-0.02em" : "normal" }}>{s.value}</p>
                <p style={{ fontSize: 12, color: "var(--th-text3)", marginTop: 2 }}>{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
}
