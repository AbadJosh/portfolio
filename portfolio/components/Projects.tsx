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
  const inView = useInView(ref, { once: true, amount: 0 });

  return (
    <section id="projects" style={{ background: "var(--th-bg)", padding: "96px 0" }}>
      <style>{`
        .proj-grid { display: grid; grid-template-columns: 1fr; gap: 20px; }
        @media (min-width: 640px) { .proj-grid { grid-template-columns: 1fr 1fr; } }
        .proj-tag {
          padding: 2px 10px; border-radius: 6px; font-size: 11px;
          border: 1px solid var(--th-border); color: var(--th-text4);
          background: var(--th-surface-alt);
        }
      `}</style>

      <div style={{ maxWidth: 1152, margin: "0 auto", padding: "0 40px" }} ref={ref}>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          style={{ textAlign: "center", marginBottom: 56 }}
        >
          <h2 className="section-heading">Projects</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          style={{ marginBottom: 40 }}
        >
          <h3 className="section-subheading">What I&apos;ve Built</h3>
          <p style={{ color: "var(--th-text3)", fontSize: 14 }}>
            Production-grade data systems built to scale and engineered for impact.
          </p>
        </motion.div>

        <div className="proj-grid">
          {projects.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15 + i * 0.07 }}
              className="card"
              style={{ padding: "24px", display: "flex", flexDirection: "column" }}
            >
              <h3 style={{ color: "var(--th-text1)", fontWeight: 600, fontSize: 15, marginBottom: 8 }}>{p.title}</h3>

              <p style={{ color: "var(--th-blue)", fontSize: 12, marginBottom: 12, fontWeight: 500 }}>{p.metrics}</p>

              <p style={{ color: "var(--th-text3)", fontSize: 14, lineHeight: 1.65, flex: 1, marginBottom: 16 }}>
                {p.description}
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
                {p.tags.map((tag) => (
                  <span key={tag} className="proj-tag">{tag}</span>
                ))}
              </div>

              <a
                href={p.github}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--th-blue)", fontSize: 14, fontWeight: 500, textDecoration: "none" }}
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
          style={{ textAlign: "center", marginTop: 40 }}
        >
          <a
            href="https://github.com/jabadDEV"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none" }}
          >
            <GithubIcon size={16} /> Show More
          </a>
        </motion.div>
      </div>
    </section>
  );
}
