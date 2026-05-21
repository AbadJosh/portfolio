"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Mail, MapPin, Loader2, CheckCircle2 } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons";

type Status = "idle" | "sending" | "success" | "error";

export default function Contact() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0 });
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [form, setForm] = useState({ name: "", email: "", message: "", website: "" });

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, message: form.message, subject: "Portfolio Contact", website: form.website }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to send.");
      }
      setStatus("success");
      setForm({ name: "", email: "", message: "", website: "" });
      setTimeout(() => setStatus("idle"), 6000);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  const isBusy = status === "sending" || status === "success";

  return (
    <section id="contact" style={{ background: "var(--th-bg)", padding: "100px 0" }}>
      <style>{`
        @keyframes ct-spin  { to { transform: rotate(360deg); } }
        @keyframes ct-pulse { 0%,100%{opacity:1;box-shadow:0 0 8px #10b981} 50%{opacity:0.5;box-shadow:0 0 3px #10b981} }
        .ct-input {
          width:100%; background:var(--th-input-bg);
          border:1.5px solid var(--th-border); border-radius:10px;
          padding:12px 16px; font-size:14px; color:var(--th-text1);
          outline:none; box-sizing:border-box; font-family:inherit;
          -webkit-appearance:none; appearance:none;
          transition:border-color 0.25s, box-shadow 0.25s;
        }
        .ct-input:focus { border-color:var(--th-blue); box-shadow:0 0 0 3px rgba(59,130,246,0.1), 0 0 16px rgba(59,130,246,0.1); }
        .ct-input::placeholder { color:var(--th-text4); }
        .ct-input:disabled { opacity:0.4; cursor:not-allowed; }
        .ct-social {
          width:44px; height:44px; border-radius:10px;
          background:var(--th-card-bg); border:1.5px solid var(--th-border);
          display:flex; align-items:center; justify-content:center;
          color:var(--th-text3); text-decoration:none;
          transition:border-color 0.25s, color 0.25s, box-shadow 0.25s;
        }
        .ct-social:hover { border-color:var(--th-blue); color:var(--th-blue); box-shadow:0 0 16px rgba(59,130,246,0.3); }
        .ct-info-card {
          display:flex; align-items:center; gap:16px;
          padding:18px 22px; border-radius:14px;
          transition:border-color 0.25s, box-shadow 0.25s;
        }
        .ct-grid { display:flex; flex-direction:column; gap:52px; }
        @media (min-width:820px) {
          .ct-grid { display:grid; grid-template-columns:1fr 400px; gap:72px; }
        }
      `}</style>

      <div style={{ maxWidth: 1060, margin: "0 auto", padding: "0 48px" }} ref={ref}>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          style={{ textAlign: "center", marginBottom: 72 }}
        >
          <h2 className="section-heading">Get In Touch</h2>
          <p style={{ color: "var(--th-text3)", fontSize: 14, marginTop: 12 }}>
            Have a project in mind or just want to connect? Drop me a message.
          </p>
        </motion.div>

        <div className="ct-grid">

          {/* ── Form ── */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.1 }}
          >
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase", color: "var(--th-text3)" }}>Name</label>
                <input type="text" required className="ct-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} disabled={isBusy} placeholder="Your name" suppressHydrationWarning />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase", color: "var(--th-text3)" }}>Email</label>
                <input type="email" required className="ct-input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} disabled={isBusy} placeholder="your@email.com" suppressHydrationWarning />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase", color: "var(--th-text3)" }}>Message</label>
                <textarea required rows={6} className="ct-input" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} disabled={isBusy} placeholder="What's on your mind?" style={{ resize: "none" }} />
              </div>

              {/* Honeypot */}
              <div style={{ position: "absolute", left: "-9999px", opacity: 0, pointerEvents: "none" }} aria-hidden="true">
                <label htmlFor="website">Website</label>
                <input id="website" type="text" name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
              </div>

              {status === "error" && <p style={{ fontSize: 13, color: "#f87171" }}>{errorMsg}</p>}
              {status === "success" && (
                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderRadius: 10, background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.3)" }}>
                  <CheckCircle2 size={16} style={{ color: "#10b981", flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: "#10b981" }}>Message sent! I&apos;ll get back to you soon.</span>
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 4 }}>
                <button type="submit" disabled={isBusy} className="btn-primary" style={{ opacity: isBusy ? 0.6 : 1, cursor: isBusy ? "not-allowed" : "pointer" }}>
                  {status === "sending" ? (
                    <><Loader2 size={14} style={{ animation: "ct-spin 1s linear infinite" }} />Sending...</>
                  ) : status === "success" ? "Sent!" : "Send Message"}
                </button>
              </div>
            </form>
          </motion.div>

          {/* ── Info panel ── */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.2 }}
            style={{ display: "flex", flexDirection: "column", gap: 20 }}
          >
            {/* Availability pill */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: 9, padding: "8px 18px", borderRadius: 99, alignSelf: "flex-start", background: "rgba(16,185,129,0.07)", border: "1px solid rgba(16,185,129,0.22)", boxShadow: "0 0 18px rgba(16,185,129,0.1)" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", flexShrink: 0, background: "#10b981", animation: "ct-pulse 2.2s ease-in-out infinite", display: "inline-block" }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: "#10b981" }}>Available for new opportunities</span>
            </div>

            {/* Email card */}
            <a href="mailto:joshua.abad.development@gmail.com" style={{ textDecoration: "none" }}>
              <div
                className="ct-info-card"
                style={{ background: "rgba(59,130,246,0.04)", border: "1px solid rgba(59,130,246,0.18)", boxShadow: "0 0 20px rgba(59,130,246,0.06)" }}
                onMouseEnter={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = "rgba(59,130,246,0.45)"; el.style.boxShadow = "0 0 30px rgba(59,130,246,0.16)"; }}
                onMouseLeave={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = "rgba(59,130,246,0.18)"; el.style.boxShadow = "0 0 20px rgba(59,130,246,0.06)"; }}
              >
                <div style={{ width: 44, height: 44, borderRadius: 11, flexShrink: 0, background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Mail size={18} style={{ color: "var(--th-blue)", filter: "drop-shadow(0 0 5px var(--th-blue))" }} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--th-text4)", marginBottom: 4 }}>Email</p>
                  <p style={{ fontSize: 13, color: "var(--th-text2)", fontWeight: 500, wordBreak: "break-all" }}>joshua.abad.development@gmail.com</p>
                </div>
              </div>
            </a>

            {/* Location card */}
            <div className="ct-info-card" style={{ background: "rgba(139,92,246,0.04)", border: "1px solid rgba(139,92,246,0.18)", boxShadow: "0 0 20px rgba(139,92,246,0.06)" }}>
              <div style={{ width: 44, height: 44, borderRadius: 11, flexShrink: 0, background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <MapPin size={18} style={{ color: "var(--th-violet)", filter: "drop-shadow(0 0 5px var(--th-violet))" }} />
              </div>
              <div>
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--th-text4)", marginBottom: 4 }}>Location</p>
                <p style={{ fontSize: 13, color: "var(--th-text2)", fontWeight: 500 }}>Calabarzon, Philippines · Remote</p>
              </div>
            </div>

            {/* Social links */}
            <div style={{ padding: "20px 22px", borderRadius: 14, background: "var(--th-card-bg)", border: "1px solid var(--th-border)" }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--th-text4)", marginBottom: 16 }}>Connect</p>
              <div style={{ display: "flex", gap: 12 }}>
                <a href="https://github.com/AbadJosh"              target="_blank" rel="noopener noreferrer" className="ct-social" aria-label="GitHub"><GithubIcon size={18} /></a>
                <a href="https://www.linkedin.com/in/joshua-abad/" target="_blank" rel="noopener noreferrer" className="ct-social" aria-label="LinkedIn"><LinkedinIcon size={18} /></a>
                <a href="mailto:joshua.abad.development@gmail.com"  className="ct-social" aria-label="Email"><Mail size={18} /></a>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
