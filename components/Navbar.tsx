"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Image from "next/image";

const navLinks = [
  { label: "Home",     href: "#home" },
  { label: "About",    href: "#about" },
  { label: "Skills",   href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Resume",   href: "#resume" },
  { label: "Contact",  href: "#contact" },
];

function Logo({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        padding: 0,
        flexShrink: 0,
      }}
    >
      <Image
        src="/jda-logo.png"
        alt="JDA Logo"
        width={48}
        height={48}
        style={{ objectFit: "contain" }}
        priority
      />
    </button>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive]         = useState("home");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = navLinks.map((l) => l.href.replace("#", ""));
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); }),
      { threshold: 0.3, rootMargin: "-64px 0px 0px 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const go = (href: string) => {
    setMobileOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* Scoped responsive rules — no Tailwind needed */}
      <style>{`
        .nav-links-desktop { display: none !important; }
        .nav-burger        { display: flex !important; }
        @media (min-width: 768px) {
          .nav-links-desktop { display: flex !important; }
          .nav-burger        { display: none !important; }
        }
      `}</style>

      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          transition: "background 0.3s, box-shadow 0.3s",
          background: scrolled ? "rgba(5,11,24,0.85)" : "transparent",
          backdropFilter: scrolled ? "blur(14px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(14px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
          boxShadow: scrolled ? "0 4px 30px rgba(0,0,0,0.3)" : "none",
        }}
      >
        <div
          style={{
            width: "100%",
            padding: "0 48px",
            height: 68,
            display: "flex",
            alignItems: "center",
            position: "relative",
          }}
        >
          {/* Logo — hard left */}
          <Logo onClick={() => go("#home")} />

          {/* Nav links — right side, nudged slightly toward center */}
          <div
            className="nav-links-desktop"
            style={{
              marginLeft: "auto",
              marginRight: "80px",
              alignItems: "center",
              gap: 6,
            }}
          >
            {navLinks.map(({ label, href }) => {
              const isActive = active === href.replace("#", "");
              return (
                <button
                  key={href}
                  onClick={() => go(href)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    position: "relative",
                    padding: "8px 18px",
                    fontSize: 15,
                    fontWeight: isActive ? 600 : 400,
                    letterSpacing: "0.01em",
                    color: isActive ? "#fff" : "rgba(148,163,184,0.85)",
                    transition: "color 0.15s",
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) (e.currentTarget as HTMLButtonElement).style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) (e.currentTarget as HTMLButtonElement).style.color = "rgba(148,163,184,0.85)";
                  }}
                >
                  {label}
                  <span
                    style={{
                      position: "absolute",
                      bottom: 5,
                      left: "50%",
                      transform: "translateX(-50%)",
                      height: 2,
                      width: isActive ? 22 : 0,
                      background: "linear-gradient(90deg, #3b82f6, #6d28d9)",
                      borderRadius: 99,
                      transition: "width 0.25s ease",
                      display: "block",
                    }}
                  />
                </button>
              );
            })}
          </div>

          {/* Mobile burger — hidden on desktop via .nav-burger on the wrapper */}
          <div className="nav-burger" style={{ marginLeft: "auto" }}>
            <button
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
              style={{
                background: "none",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 8,
                cursor: "pointer",
                color: "rgba(148,163,184,1)",
                padding: "6px 8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              style={{
                background: "rgba(5,11,24,0.97)",
                backdropFilter: "blur(14px)",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div
                style={{
                  padding: "12px 48px 20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                }}
              >
                {navLinks.map(({ label, href }) => {
                  const isActive = active === href.replace("#", "");
                  return (
                    <button
                      key={href}
                      onClick={() => go(href)}
                      style={{
                        background: isActive ? "rgba(59,130,246,0.1)" : "none",
                        border: "none",
                        borderLeft: isActive ? "2px solid #3b82f6" : "2px solid transparent",
                        borderRadius: "0 8px 8px 0",
                        cursor: "pointer",
                        textAlign: "left",
                        padding: "10px 16px",
                        fontSize: 14,
                        fontWeight: isActive ? 600 : 500,
                        color: isActive ? "#fff" : "rgba(148,163,184,1)",
                        transition: "all 0.15s",
                      }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
