"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Briefcase, GraduationCap, Code2, TrendingUp, MapPin } from "lucide-react";

const timeline = [
  {
    period: "Jan 2024 – Present",
    role: "Data Engineer",
    company: "FLNT",
    location: "Australia · Remote",
    desc: "Architecting cloud-native data pipelines handling 10M+ daily events on Azure. Leading ETL framework design adopted across 3 product teams.",
    icon: Briefcase,
    color: "#3b82f6",
  },
  {
    period: "Mar 2021 – Dec 2023",
    role: "Senior Data Engineer",
    company: "TechVantage Solutions",
    location: "Philippines",
    desc: "Owned the company data platform on Azure and GCP. Introduced Great Expectations quality layer that reduced pipeline incidents by 60%.",
    icon: TrendingUp,
    color: "#8b5cf6",
  },
  {
    period: "Jun 2019 – Feb 2021",
    role: "Data Engineer",
    company: "DataBridge Analytics",
    location: "Philippines",
    desc: "Delivered AWS Redshift data warehouse (5TB+) for enterprise clients. Automated Glue ETL workflows and built Tableau dashboards for 50+ users.",
    icon: Code2,
    color: "#3b82f6",
  },
  {
    period: "Jul 2018 – May 2019",
    role: "Junior Data Engineer",
    company: "CloudSphere",
    location: "Philippines",
    desc: "Built ETL scripts in Python and SQL. Optimized PostgreSQL queries, reducing report generation time by 40%.",
    icon: Code2,
    color: "#6366f1",
  },
  {
    period: "2013 – 2018",
    role: "BS Information Technology",
    company: "Technological Institute of the Philippines",
    location: "Philippines",
    desc: "Foundation in computer science, database systems, algorithms, and software engineering principles.",
    icon: GraduationCap,
    color: "#64748b",
  },
];

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="about" className="py-24 bg-[#060d1f]">
      <div className="max-w-6xl mx-auto px-6 sm:px-10" ref={ref}>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="section-heading">About Me</h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left: bio */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.1 }}
          >
            <h3 className="section-subheading">A bit about me</h3>
            <div className="space-y-4 text-slate-400 text-sm leading-7 mb-8">
              <p>
                I&apos;m <span className="text-white font-semibold">Joshua D. Abad</span>, a Data Engineer
                based in Calabarzon, Philippines, working remotely with{" "}
                <span className="text-[#3b82f6]">FLNT</span> in Australia.
              </p>
              <p>
                With 7+ years of hands-on experience, I specialize in designing and building scalable
                data pipelines, cloud data platforms, and ETL/ELT frameworks that transform raw data
                into reliable signals for business decisions.
              </p>
              <p>
                I care deeply about data quality, observability, and building systems that teams
                love maintaining. My philosophy:{" "}
                <em className="text-slate-300">
                  &quot;Data is only as valuable as the infrastructure built to move and shape it.&quot;
                </em>
              </p>
            </div>

            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <MapPin size={14} className="text-[#3b82f6]" />
              Calabarzon, Philippines · Open to Remote Worldwide
            </div>
          </motion.div>

          {/* Right: timeline */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.15 }}
          >
            <h3 className="section-subheading">Experience &amp; Education</h3>

            <div className="relative">
              <div className="absolute left-4 top-2 bottom-2 w-px bg-[#1e3a5f]" />

              <div className="space-y-6">
                {timeline.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.2 + i * 0.08 }}
                    className="relative pl-12"
                  >
                    {/* dot */}
                    <div
                      className="absolute left-0 top-1 w-8 h-8 rounded-lg flex items-center justify-center bg-[#0a1228] border border-[#1e3a5f]"
                    >
                      <item.icon size={14} style={{ color: item.color }} />
                    </div>

                    <div className="card p-4">
                      <div className="flex flex-wrap items-start justify-between gap-1 mb-1">
                        <div>
                          <p className="text-white font-semibold text-sm">{item.role}</p>
                          <p className="text-[#3b82f6] text-xs font-medium">{item.company}</p>
                        </div>
                        <span className="text-slate-600 text-xs">{item.period}</span>
                      </div>
                      <p className="text-slate-600 text-xs mb-2">{item.location}</p>
                      <p className="text-slate-400 text-xs leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
