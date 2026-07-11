"use client";

import Link from "next/link";

import { useBudget } from "@/context/BudgetContext";

import {
  useFinancialAnalysis,
} from "@/context/FinancialAnalysisContext";

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
    expenses,
  } = useBudget();

  const {
    behaviorSummary,
    recommendations,
    financialScore,
    financialProfile,
    safeDailyLimit,
  } = useFinancialAnalysis();

  const hasFinancialData =
    expenses.length > 0;

  const numericScore =
    Number(financialScore);

  const displayedScore =
    hasFinancialData &&
    Number.isFinite(
      numericScore
    )
      ? Math.round(
          numericScore
        )
      : "—";

  const displayedProfile =
    hasFinancialData
      ? financialProfile ||
        "Financial activity detected"

      : "Waiting for real financial data";

  const displayedSummary =
    hasFinancialData
      ? behaviorSummary ||
        "Your financial activity is ready for analysis."

      : "Record your first real expense to activate personalized financial analysis.";

  const dailyLimit =
    Math.max(
      Number(
        safeDailyLimit
      ) || 0,
      0
    );

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
          {displayedScore}
        </div>
      </div>

      <div className={styles.summary}>
        <div className={styles.icon}>
          💡
        </div>

        <div>
          <h3>
            {displayedProfile}
          </h3>

          <p>
            {displayedSummary}
          </p>

          {hasFinancialData && (
            <span>
              Suggested daily limit:{" "}

              <strong>
                {dailyLimit.toLocaleString(
                  "en-US",
                  {
                    maximumFractionDigits:
                      2,
                  }
                )}{" "}
                SAR
              </strong>
            </span>
          )}
        </div>
      </div>

      <div
        className={
          styles.recommendations
        }
      >
        {!hasFinancialData ? (
          <p className={styles.empty}>
            Record real financial
            activity to receive
            personalized recommendations.
          </p>
        ) : recommendations.length ===
          0 ? (
          <p className={styles.empty}>
            More financial activity is
            needed before recommendations
            can be generated.
          </p>
        ) : (
          recommendations.map(
            (
              recommendation,
              index
            ) => (
              <article
                key={`${recommendation.title}-${index}`}
                className={`${styles.recommendation} ${
                  styles[
                    recommendation.impact
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

                  {recommendation.action && (
                    <strong>
                      {
                        recommendation.action
                      }
                    </strong>
                  )}
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
          View AI Insights
        </Link>
      </div>
    </section>
  );
}