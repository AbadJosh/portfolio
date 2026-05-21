"use client";

import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Moon, Sun } from "lucide-react";
import Image from "next/image";
import { useTheme } from "@/lib/ThemeContext";

const navLinks = [
  { label: "Home",       href: "#home" },
  { label: "About",      href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Skills",     href: "#skills" },
  { label: "Contact",    href: "#contact" },
];

function Logo({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      suppressHydrationWarning
      style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", padding: 0, flexShrink: 0 }}
    >
      <Image src="/jda-logo.png" alt="JDA Logo" width={48} height={48} style={{ objectFit: "contain" }} priority />
    </button>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive]         = useState("home");
  const clickLock                   = useRef(false);
  const { isDark, toggle }          = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = navLinks.map((l) => l.href.replace("#", ""));
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting && !clickLock.current) setActive(e.target.id); }),
      { threshold: 0.2, rootMargin: "-64px 0px 0px 0px" }
    );
    ids.forEach((id) => { const el = document.getElementById(id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  const go = (href: string) => {
    setMobileOpen(false);
    setActive(href.replace("#", ""));
    clickLock.current = true;
    setTimeout(() => { clickLock.current = false; }, 900);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  const iconBtnStyle: React.CSSProperties = {
    background: "none",
    border: "1px solid var(--th-border)",
    borderRadius: 8,
    cursor: "pointer",
    color: "var(--th-text2)",
    padding: "11px 13px",
    minWidth: 44,
    minHeight: 44,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "border-color 0.2s, color 0.2s",
  };

  return (
    <>
      <style>{`
        .nav-links-desktop { display: none !important; }
        .nav-burger        { display: flex !important; }
        @media (min-width: 768px) {
          .nav-links-desktop { display: flex !important; }
          .nav-burger        { display: none !important; }
        }
        .nav-links-desktop button:focus-visible {
          outline: 2px solid var(--th-blue);
          outline-offset: 2px;
          border-radius: 4px;
        }
        /* On mobile, the right-group (toggle + burger) pushes to edge via margin-left auto.
           On desktop, nav-links already consume the auto margin so right-group follows naturally. */
        .nav-right-group { display: flex; align-items: center; gap: 8px; }
        @media (max-width: 767px) { .nav-right-group { margin-left: auto; } }
        @media (max-width: 479px) {
          .nav-inner       { padding: 0 20px !important; }
          .nav-mobile-menu { padding-left: 20px !important; padding-right: 20px !important; }
        }
        .nav-icon-btn:hover { border-color: var(--th-blue) !important; color: var(--th-blue) !important; }
      `}</style>

      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        transition: "background 0.3s, box-shadow 0.3s",
        background: scrolled ? "var(--th-nav-bg)" : "transparent",
        backdropFilter: scrolled ? "blur(14px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(14px)" : "none",
        borderBottom: scrolled ? "1px solid var(--th-nav-border)" : "none",
        boxShadow: scrolled ? "var(--th-nav-shadow)" : "none",
      }}>
        <div className="nav-inner" style={{ width: "100%", padding: "0 48px", height: 68, display: "flex", alignItems: "center", position: "relative" }}>

          <Logo onClick={() => go("#home")} />

          {/* Desktop nav links */}
          <div className="nav-links-desktop" style={{ marginLeft: "auto", alignItems: "center", gap: 6, marginRight: 16 }}>
            {navLinks.map(({ label, href }) => {
              const isActive = active === href.replace("#", "");
              return (
                <button
                  key={href}
                  onClick={() => go(href)}
                  style={{
                    background: "none", border: "none", cursor: "pointer", position: "relative",
                    padding: "8px 18px", fontSize: 15,
                    fontWeight: isActive ? 600 : 400,
                    letterSpacing: "0.01em",
                    color: isActive ? "var(--th-text1)" : "var(--th-text3)",
                    transition: "color 0.15s",
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.color = "var(--th-text1)"; }}
                  onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.color = "var(--th-text3)"; }}
                >
                  {label}
                  <span style={{
                    position: "absolute", bottom: 5, left: "50%", transform: "translateX(-50%)",
                    height: 2, width: isActive ? 22 : 0,
                    background: "linear-gradient(90deg, var(--th-blue), var(--th-violet))",
                    borderRadius: 99, transition: "width 0.25s ease", display: "block",
                  }} />
                </button>
              );
            })}
          </div>

          {/* Right group — theme toggle + mobile burger */}
          <div className="nav-right-group">
            {/* Theme toggle */}
            <button
              onClick={toggle}
              aria-label="Toggle theme"
              className="nav-icon-btn"
              style={iconBtnStyle}
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Mobile burger */}
            <div className="nav-burger">
              <button
                onClick={() => setMobileOpen((v) => !v)}
                aria-label="Toggle menu"
                className="nav-icon-btn"
                style={iconBtnStyle}
              >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
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
                background: "var(--th-mobile-menu-bg)",
                backdropFilter: "blur(14px)",
                borderBottom: "1px solid var(--th-nav-border)",
              }}
            >
              <div className="nav-mobile-menu" style={{ padding: "12px 48px 20px", display: "flex", flexDirection: "column", gap: 4 }}>
                {navLinks.map(({ label, href }) => {
                  const isActive = active === href.replace("#", "");
                  return (
                    <button
                      key={href}
                      onClick={() => go(href)}
                      style={{
                        background: isActive ? "rgba(99,102,241,0.07)" : "none",
                        border: "none",
                        borderLeft: isActive ? "2px solid var(--th-blue)" : "2px solid transparent",
                        borderRadius: "0 8px 8px 0",
                        cursor: "pointer",
                        textAlign: "left",
                        padding: "10px 16px",
                        fontSize: 14,
                        fontWeight: isActive ? 600 : 500,
                        color: isActive ? "var(--th-text1)" : "var(--th-text2)",
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
