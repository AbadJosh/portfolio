"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Mail, MapPin, Loader2 } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons";

type Status = "idle" | "sending" | "success" | "error";

export default function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, subject: "Portfolio Contact" }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to send.");
      }
      setStatus("success");
      setForm({ name: "", email: "", message: "" });
      setTimeout(() => setStatus("idle"), 5000);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  return (
    <section id="contact" className="py-24 bg-[#060d1f]">
      <div className="max-w-6xl mx-auto px-6 sm:px-10" ref={ref}>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="section-heading">Contact</h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left: form */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.1 }}
          >
            <h3 className="section-subheading">Connect with me</h3>
            <p className="text-slate-400 text-sm mb-6">
              If you want to know more about me or my work, or if you would just like to say hello,
              send me a message. I&apos;d love to hear from you.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-400 text-sm mb-1.5">Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  disabled={status === "sending"}
                  placeholder="Enter your name"
                  suppressHydrationWarning
                  className="w-full bg-[#0a1228] border border-[#1e3a5f] rounded-lg px-4 py-2.5 text-slate-200 text-sm placeholder-slate-700 focus:outline-none focus:border-[#3b82f6]/60 transition-colors disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  disabled={status === "sending"}
                  placeholder="Enter your email"
                  suppressHydrationWarning
                  className="w-full bg-[#0a1228] border border-[#1e3a5f] rounded-lg px-4 py-2.5 text-slate-200 text-sm placeholder-slate-700 focus:outline-none focus:border-[#3b82f6]/60 transition-colors disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-1.5">Message</label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  disabled={status === "sending"}
                  placeholder="Enter your message"
                  className="w-full bg-[#0a1228] border border-[#1e3a5f] rounded-lg px-4 py-2.5 text-slate-200 text-sm placeholder-slate-700 focus:outline-none focus:border-[#3b82f6]/60 transition-colors resize-none disabled:opacity-50"
                />
              </div>

              {status === "error" && (
                <p className="text-red-400 text-xs">{errorMsg}</p>
              )}

              <div className="flex items-center justify-between">
                <a
                  href="mailto:joshua.abad.development@gmail.com"
                  className="text-slate-500 text-sm hover:text-[#3b82f6] transition-colors underline underline-offset-2"
                >
                  Send me email directly
                </a>
                <button
                  type="submit"
                  disabled={status === "sending" || status === "success"}
                  className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {status === "sending" ? (
                    <><Loader2 size={14} className="animate-spin" /> Sending...</>
                  ) : status === "success" ? (
                    "Sent!"
                  ) : (
                    "Submit"
                  )}
                </button>
              </div>
            </form>
          </motion.div>

          {/* Right: contact info */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.15 }}
            className="space-y-8"
          >
            <div>
              <p className="text-white font-bold text-base mb-1">Email</p>
              <a
                href="mailto:joshua.abad.development@gmail.com"
                className="text-[#3b82f6] text-sm hover:underline uppercase tracking-wide"
              >
                joshua.abad.development@gmail.com
              </a>
            </div>

            <div>
              <p className="text-white font-bold text-base mb-1">Address</p>
              <p className="text-[#3b82f6] text-sm uppercase tracking-wide">
                Calabarzon, Philippines
              </p>
            </div>

            <div>
              <p className="text-white font-bold text-base mb-3">Social</p>
              <div className="flex items-center gap-3">
                <a
                  href="https://github.com/jabadDEV"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-lg border border-[#1e3a5f] text-slate-400 hover:text-white hover:border-[#3b82f6] transition-all"
                  aria-label="GitHub"
                >
                  <GithubIcon size={18} />
                </a>
                <a
                  href="https://www.linkedin.com/in/joshua-abad/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-lg border border-[#1e3a5f] text-slate-400 hover:text-white hover:border-[#3b82f6] transition-all"
                  aria-label="LinkedIn"
                >
                  <LinkedinIcon size={18} />
                </a>
                <a
                  href="mailto:joshua.abad.development@gmail.com"
                  className="w-10 h-10 flex items-center justify-center rounded-lg border border-[#1e3a5f] text-slate-400 hover:text-white hover:border-[#3b82f6] transition-all"
                  aria-label="Email"
                >
                  <Mail size={18} />
                </a>
                <a
                  href="https://www.linkedin.com/in/joshua-abad/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-lg border border-[#1e3a5f] text-slate-400 hover:text-white hover:border-[#3b82f6] transition-all"
                  aria-label="Location"
                >
                  <MapPin size={18} />
                </a>
              </div>
            </div>

            {/* Availability */}
            <div className="flex items-center gap-2 pt-4">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-emerald-400 text-sm font-medium">Available for new opportunities</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
