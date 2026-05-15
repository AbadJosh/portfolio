"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Download, Award, GraduationCap } from "lucide-react";

const experience = [
  {
    role: "Data Engineer",
    company: "FLNT",
    period: "Jan 2024 – Present",
    location: "Australia · Remote",
    bullets: [
      "Architected cloud-native pipelines handling 10M+ daily events on Azure",
      "Led migration of legacy ETL to dbt + Airflow, reducing runtime by 45%",
      "Built reusable ETL framework adopted by 3 product teams, cutting onboarding 60%",
      "Designed Snowflake schema supporting 200+ downstream analytics tables",
    ],
    color: "#3b82f6",
  },
  {
    role: "Senior Data Engineer",
    company: "TechVantage Solutions",
    period: "Mar 2021 – Dec 2023",
    location: "Philippines",
    bullets: [
      "Owned company data platform on Azure and GCP serving 15+ stakeholders",
      "Great Expectations quality layer reduced pipeline incident response by 60%",
      "Delivered BigQuery warehouse for retail client, cutting query costs 70%",
      "Mentored 3 junior engineers on data modeling and cloud architecture",
    ],
    color: "#8b5cf6",
  },
  {
    role: "Data Engineer",
    company: "DataBridge Analytics",
    period: "Jun 2019 – Feb 2021",
    location: "Philippines",
    bullets: [
      "Built AWS Redshift warehouse (5TB+) with row-level security for enterprise clients",
      "Automated 12 manual data processes with AWS Glue ETL workflows",
      "Designed star-schema models powering Tableau dashboards for 50+ users",
    ],
    color: "#06b6d4",
  },
  {
    role: "Junior Data Engineer",
    company: "CloudSphere",
    period: "Jul 2018 – May 2019",
    location: "Philippines",
    bullets: [
      "Built ETL scripts in Python and SQL ingesting from 8+ REST API sources",
      "Optimized PostgreSQL queries, reducing report generation time by 40%",
    ],
    color: "#6366f1",
  },
];

const certifications = [
  { name: "Azure Data Engineer Associate (DP-203)", issuer: "Microsoft", color: "#0078d4" },
  { name: "Professional Data Engineer", issuer: "Google Cloud", color: "#4285f4" },
  { name: "Data Analytics Specialty", issuer: "Amazon Web Services", color: "#ff9900" },
  { name: "dbt Fundamentals Certification", issuer: "dbt Labs", color: "#ff694a" },
];

export default function Resume() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="resume" className="py-24 bg-[#050b18]">
      <div className="max-w-6xl mx-auto px-6 sm:px-10" ref={ref}>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-14"
        >
          <h2 className="section-heading !text-left">Resume</h2>
          <a
            href="/resume.pdf"
            download
            className="btn-ghost flex-shrink-0"
          >
            <Download size={14} /> Download PDF
          </a>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_320px] gap-12">
          {/* Experience */}
          <div>
            <h3 className="section-subheading">Professional Experience</h3>

            <div className="space-y-6 mt-6">
              {experience.map((job, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.1 + i * 0.09 }}
                  className="card p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                    <div>
                      <p className="text-white font-semibold text-sm">{job.role}</p>
                      <p className="text-xs font-medium mt-0.5" style={{ color: job.color }}>{job.company}</p>
                    </div>
                    <div className="text-right text-xs text-slate-500">
                      <p>{job.period}</p>
                      <p className="mt-0.5">{job.location}</p>
                    </div>
                  </div>
                  <ul className="space-y-1.5 mt-3">
                    {job.bullets.map((b, j) => (
                      <li key={j} className="flex items-start gap-2 text-xs text-slate-400 leading-relaxed">
                        <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0 bg-[#3b82f6]" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right: education + certs */}
          <div className="space-y-10">
            {/* Education */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.2 }}
            >
              <h3 className="section-subheading flex items-center gap-2">
                <GraduationCap size={16} /> Education
              </h3>
              <div className="card p-4 mt-4">
                <p className="text-white font-semibold text-sm">BS Information Technology</p>
                <p className="text-[#3b82f6] text-xs mt-1">Technological Institute of the Philippines</p>
                <p className="text-slate-500 text-xs mt-1">2013 – 2018 · Philippines</p>
              </div>
            </motion.div>

            {/* Certifications */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.3 }}
            >
              <h3 className="section-subheading flex items-center gap-2">
                <Award size={16} /> Certifications
              </h3>
              <div className="space-y-3 mt-4">
                {certifications.map((c, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.35 + i * 0.06 }}
                    className="card p-3 flex items-center gap-3"
                  >
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: c.color }}
                    />
                    <div>
                      <p className="text-slate-300 text-xs font-medium">{c.name}</p>
                      <p className="text-slate-600 text-[11px] mt-0.5">{c.issuer}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
