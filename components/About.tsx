"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { MapPin } from "lucide-react";
import Image from "next/image";
import { useTheme } from "@/lib/ThemeContext";

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0 });
  const { isDark } = useTheme();

  return (
    <section id="about" style={{ background: "var(--th-surface)", padding: "96px 0" }}>
      <style>{`
        .about-grid { display:grid; grid-template-columns:1fr; gap:48px; align-items:center; }
        @media (min-width:768px) { .about-grid { grid-template-columns:1fr 1fr; gap:64px; } }
      `}</style>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 48px" }} ref={ref}>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          style={{ textAlign: "center", marginBottom: 56 }}
        >
          <h2 className="section-heading">About Me</h2>
        </motion.div>

        <div className="about-grid">

          {/* Left — illustration */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.1 }}
            style={{ position: "relative", borderRadius: 16, overflow: "hidden", lineHeight: 0 }}
          >
            <Image
              src={isDark ? "/about-me-page.png" : "/about-me-page-white.png"}
              alt="Josh relaxing — gamer at heart"
              width={680}
              height={510}
              style={{ width: "100%", height: "auto", borderRadius: 16, display: "block" }}
            />
            <div style={{
              position: "absolute", bottom: 0, left: 0, right: 0, height: 80,
              background: "linear-gradient(to top, var(--th-about-fade), transparent)",
              borderRadius: "0 0 16px 16px",
            }} />
          </motion.div>

          {/* Right — bio */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.15 }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 16, color: "var(--th-about-body)", fontSize: 15, lineHeight: 1.85, marginBottom: 32 }}>
              <p style={{ margin: 0 }}>
                I&apos;m <strong style={{ color: "var(--th-about-strong)" }}>Joshua D. Abad</strong> — most people call me{" "}
                <strong style={{ color: "var(--th-about-strong)" }}>Josh</strong>, or just{" "}
                <strong style={{ color: "var(--th-about-strong)" }}>Bad</strong> (short for Abad, the nickname that stuck).
                I&apos;m a Data Engineer based in Calabarzon, Philippines, working remotely with clients internationally.
              </p>
              <p style={{ margin: 0 }}>
                With 7+ years of hands-on experience, I specialize in designing and building scalable data pipelines,
                cloud data platforms, and ETL/ELT frameworks that transform raw data into reliable signals for business
                decisions. Every system I ship is held to one standard:{" "}
                <span style={{ color: "var(--th-about-strong)" }}>reliable, robust, and ready to scale.</span>
              </p>
              <p style={{ margin: 0 }}>
                I care deeply about data quality, observability, and building infrastructure that teams genuinely enjoy
                maintaining. Data infrastructure is something I can talk about for hours — it&apos;s not just work,
                it&apos;s a craft.
              </p>
              <p style={{ margin: 0 }}>
                Outside of engineering, I&apos;m a passionate gamer — PC and mobile both. You&apos;ll also find me
                watching anime or action/military films, hitting the gym, or deep-diving into something new. If none
                of the above, I&apos;m probably sleeping.
              </p>
            </div>

            {/* Quote callout */}
            <div style={{
              position: "relative",
              marginBottom: 28,
              padding: "18px 24px",
              background: "rgba(59,130,246,0.06)",
              borderRadius: 12,
              border: "1px solid rgba(59,130,246,0.15)",
            }}>
              <div style={{
                position: "absolute", left: 0, top: 0, bottom: 0, width: 3,
                borderRadius: "12px 0 0 12px",
                background: "linear-gradient(180deg, var(--th-blue), var(--th-violet))",
              }} />
              <p style={{ margin: 0, fontSize: 14, fontStyle: "italic", color: "var(--th-about-quote)", lineHeight: 1.7 }}>
                &ldquo;Data is only as valuable as the infrastructure built to move and shape it.&rdquo;
              </p>
            </div>

            {/* Location */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--th-text3)", fontSize: 13 }}>
              <MapPin size={13} style={{ color: "var(--th-blue)", flexShrink: 0 }} />
              Calabarzon, Philippines · Open to Remote Worldwide
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
