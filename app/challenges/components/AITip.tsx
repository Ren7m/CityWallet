"use client";

import Link from "next/link";

import { useFinancialAnalysis } from "@/context/FinancialAnalysisContext";

import styles from "./AITip.module.css";

function getImpactIcon(
  impact:
    | "positive"
    | "warning"
    | "danger"
) {
  if (impact === "positive") {
    return "✅";
  }

  if (impact === "danger") {
    return "🚨";
  }

  return "⚠️";
}

export default function AITip() {
  const {
    behaviorSummary,
    recommendations,
    financialScore,
    financialProfile,
    safeDailyLimit,
  } = useFinancialAnalysis();

  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <div>
          <span>
            SMART ANALYSIS
          </span>

          <h2>
            Smart Financial Coach
          </h2>
        </div>

        <div className={styles.score}>
          {financialScore}
        </div>
      </div>

      <div className={styles.summary}>
        <div className={styles.icon}>
          💡
        </div>

        <div>
          <h3>{financialProfile}</h3>

          <p>{behaviorSummary}</p>

          <span>
            Suggested daily limit:{" "}
            <strong>
              {safeDailyLimit.toLocaleString(
                "en-US"
              )}{" "}
              SAR
            </strong>
          </span>
        </div>
      </div>

      <div
        className={
          styles.recommendations
        }
      >
        {recommendations.length === 0 ? (
          <p className={styles.empty}>
            Enter your income, budget and
            expenses to receive
            personalized recommendations.
          </p>
        ) : (
          recommendations.map(
            (recommendation) => (
              <article
                key={
                  recommendation.title
                }
                className={`${styles.recommendation} ${
                  styles[
                    recommendation
                      .impact
                  ]
                }`}
              >
                <div
                  className={
                    styles.recommendationIcon
                  }
                >
                  {getImpactIcon(
                    recommendation.impact
                  )}
                </div>

                <div>
                  <h4>
                    {
                      recommendation.title
                    }
                  </h4>

                  <p>
                    {
                      recommendation.description
                    }
                  </p>

                  <strong>
                    {
                      recommendation.action
                    }
                  </strong>
                </div>
              </article>
            )
          )
        )}
      </div>

      <div className={styles.actions}>
        <Link href="/city/financial-profile">
          Update Survey
        </Link>

        <Link href="/city/insights">
          View Report
        </Link>
      </div>
    </section>
  );
}