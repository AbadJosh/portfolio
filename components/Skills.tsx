"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const categories = [
  {
    title: "Data Engineering",
    color: "#3b82f6",
    skills: ["Apache Kafka", "Apache Spark", "Apache Airflow", "dbt", "ETL / ELT Design", "Data Modeling", "Stream Processing"],
  },
  {
    title: "Cloud & Infrastructure",
    color: "#8b5cf6",
    skills: ["Microsoft Azure", "AWS", "Google Cloud", "Azure Data Factory", "Azure Synapse", "AWS Glue", "Terraform"],
  },
  {
    title: "Languages & Databases",
    color: "#06b6d4",
    skills: ["Python", "SQL / T-SQL", "PostgreSQL", "Snowflake", "BigQuery", "AWS Redshift", "Redis"],
  },
  {
    title: "Quality & Observability",
    color: "#f59e0b",
    skills: ["Great Expectations", "Data Contracts", "Pipeline Monitoring", "Data Lineage", "Alerting", "dbt Tests"],
  },
];

export default function Skills() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="skills" className="py-24 bg-[#050b18]">
      <div className="max-w-6xl mx-auto px-6 sm:px-10" ref={ref}>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="section-heading">Skills</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          className="mb-10"
        >
          <h3 className="section-subheading">Technologies and Tools</h3>
          <p className="text-slate-400 text-sm max-w-xl">
            A toolkit built over 7+ years designing and shipping production data systems
            across cloud platforms, languages, and frameworks.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, ci) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15 + ci * 0.07 }}
              className="card p-5"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full" style={{ background: cat.color }} />
                <p className="text-white font-semibold text-sm">{cat.title}</p>
              </div>
              <div className="flex flex-col gap-2">
                {cat.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 bg-[#060d1f] border border-[#1e3a5f] rounded-md text-slate-400 text-xs hover:text-slate-200 hover:border-[#3b82f6]/40 transition-colors cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
