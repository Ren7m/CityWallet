"use client";

import Link from "next/link";

import { useFinancialAnalysis } from "@/context/FinancialAnalysisContext";

import styles from "./CityFinanceStatus.module.css";

export default function CityFinanceStatus() {
  const {
    cityState,
    cityMessage,
    financialScore,
    financialLevel,
    financialProfile,
    weeklyChallenge,
  } = useFinancialAnalysis();

  return (
    <section
      className={`${styles.card} ${
        styles[cityState]
      }`}
    >
      <div className={styles.information}>
        <span>
          CITY FINANCIAL CONDITION
        </span>

        <h2>
          {cityState === "flourishing"
            ? "🌳 Flourishing City"
            : cityState === "stable"
              ? "🏙️ Stable City"
              : cityState === "warning"
                ? "⚠️ City Needs Attention"
                : "🚨 Recovery Mode"}
        </h2>

        <p>{cityMessage}</p>
      </div>

      <div className={styles.stats}>
        <div>
          <span>Financial score</span>
          <strong>
            {financialScore}/100
          </strong>
        </div>

        <div>
          <span>Financial level</span>
          <strong>
            Level {financialLevel}
          </strong>
        </div>

        <div>
          <span>Profile</span>
          <strong>
            {financialProfile}
          </strong>
        </div>
      </div>

      <div className={styles.challenge}>
        <div>
          <span>
            WEEKLY CHALLENGE
          </span>

          <h3>
            {weeklyChallenge.title}
          </h3>

          <p>
            {
              weeklyChallenge.description
            }
          </p>
        </div>

        <div className={styles.progress}>
          <div>
            <span>Progress</span>

            <strong>
              {
                weeklyChallenge.progress
              }
              %
            </strong>
          </div>

          <div className={styles.track}>
            <span
              style={{
                width: `${weeklyChallenge.progress}%`,
              }}
            />
          </div>

          <small>
            {weeklyChallenge.target} · +
            {weeklyChallenge.rewardXp} XP
          </small>
        </div>
      </div>

      <Link
        href="/city/insights"
        className={styles.link}
      >
        Open Financial Report
      </Link>
    </section>
  );
}