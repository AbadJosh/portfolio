"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { GithubIcon } from "@/components/icons";

const projects = [
  {
    title: "Real-Time Analytics Pipeline",
    description:
      "End-to-end streaming pipeline using Apache Kafka and Spark Streaming. Ingests 10M+ events/day, transforms in real-time, and loads into BigQuery. Reduced data latency from hours to under 1 minute.",
    tags: ["Kafka", "Spark", "BigQuery", "Python", "GCP"],
    github: "https://github.com/jabadDEV",
    metrics: "10M+ events/day · <1 min latency · 99.9% uptime",
  },
  {
    title: "Azure Data Factory ETL Framework",
    description:
      "Reusable, config-driven ETL framework on Azure Data Factory with 20+ source connectors, automated schema drift detection, and parallel execution. Cut development time by 60%.",
    tags: ["Azure Data Factory", "Azure Synapse", "Python", "ARM Templates"],
    github: "https://github.com/jabadDEV",
    metrics: "40+ pipelines · 60% faster dev · 20+ connectors",
  },
  {
    title: "Data Quality Monitoring Platform",
    description:
      "Automated data quality system using Great Expectations + Airflow. Validates contracts at each pipeline stage, triggers Slack alerts on anomalies, and tracks data lineage.",
    tags: ["Great Expectations", "Airflow", "dbt", "PostgreSQL"],
    github: "https://github.com/jabadDEV",
    metrics: "500+ checks/day · 95% coverage · Auto-alerting",
  },
  {
    title: "BigQuery Analytics Warehouse",
    description:
      "Modern data warehouse on BigQuery with partitioned and clustered tables for a retail client. dbt transformations and Looker Studio dashboards cut query costs by 70%.",
    tags: ["BigQuery", "dbt", "Looker Studio", "SQL"],
    github: "https://github.com/jabadDEV",
    metrics: "70% cost reduction · 10x query speed · 200+ tables",
  },
  {
    title: "AWS Redshift Data Warehouse",
    description:
      "Petabyte-scale warehouse on AWS Redshift for an e-commerce platform. Star schema models, automated Glue ETL, and row-level security for multi-tenant data isolation.",
    tags: ["AWS Redshift", "AWS Glue", "S3", "Terraform"],
    github: "https://github.com/jabadDEV",
    metrics: "5 TB+ data · Multi-tenant · Fully automated",
  },
  {
    title: "Snowflake Migration & Optimization",
    description:
      "Led migration from on-premise SQL Server to Snowflake for a fintech client. Re-architected 120+ stored procedures into dbt models, reducing compute costs by 45%.",
    tags: ["Snowflake", "dbt", "Python", "SQL Server"],
    github: "https://github.com/jabadDEV",
    metrics: "120+ models migrated · 45% cost savings · Zero downtime",
  },
];

export default function Projects() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="projects" className="py-24 bg-[#060d1f]">
      <div className="max-w-6xl mx-auto px-6 sm:px-10" ref={ref}>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="section-heading">Projects</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          className="mb-10"
        >
          <h3 className="section-subheading">What I&apos;ve Built</h3>
          <p className="text-slate-400 text-sm">
            Production-grade data systems built to scale and engineered for impact.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-5">
          {projects.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15 + i * 0.07 }}
              className="card p-6 flex flex-col"
            >
              <h3 className="text-white font-semibold text-base mb-2">{p.title}</h3>

              <p className="text-[#3b82f6] text-xs mb-3 font-medium">{p.metrics}</p>

              <p className="text-slate-400 text-sm leading-relaxed flex-1 mb-4">
                {p.description}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {p.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 text-xs border border-[#1e3a5f] rounded text-slate-500 bg-[#060d1f]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <a
                href={p.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[#3b82f6] text-sm font-medium hover:underline"
              >
                Read more <ArrowRight size={13} />
              </a>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="text-center mt-10"
        >
          <a
            href="https://github.com/jabadDEV"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost inline-flex"
          >
            <GithubIcon size={16} /> Show More
          </a>
        </motion.div>
      </div>
    </section>
  );
}
