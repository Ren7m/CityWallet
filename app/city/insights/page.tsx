"use client";

import Link from "next/link";
import { useMemo } from "react";

import { useBudget } from "@/context/BudgetContext";
import { useFinancialAnalysis } from "@/context/FinancialAnalysisContext";

import {
  useAIInsights,
} from "./hooks/useAIInsights";

import styles from "./insights.module.css";

/* =========================
   TYPES
========================= */

type CategoryData = {
  name: string;
  amount: number;
  percent: number;
  color: string;
};

/* =========================
   CONSTANTS
========================= */

const CATEGORY_COLORS = [
  "#8b5cf6",
  "#22c55e",
  "#f59e0b",
  "#38bdf8",
  "#f43f5e",
  "#14b8a6",
  "#6366f1",
  "#64748b",
];

/* =========================
   HELPERS
========================= */

function clamp(
  value: number,
  minimum: number,
  maximum: number
) {
  return Math.min(
    Math.max(value, minimum),
    maximum
  );
}

/* =========================
   ICONS
========================= */

function SparkIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="m12 3 1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3Z" />

      <path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M12 3v12" />

      <path d="m7 10 5 5 5-5" />

      <path d="M5 20h14" />
    </svg>
  );
}

function TargetIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="8"
      />

      <circle
        cx="12"
        cy="12"
        r="4"
      />

      <path d="m14 10 6-6" />

      <path d="M17 4h3v3" />
    </svg>
  );
}

function ReceiptIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z" />

      <path d="M9 8h6M9 12h6M9 16h3" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M5 12h14" />

      <path d="m14 7 5 5-5 5" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M12 3 20 6v6c0 5-3.4 8-8 9-4.6-1-8-4-8-9V6l8-3Z" />

      <path d="m8.5 12 2.2 2.2 4.8-5" />
    </svg>
  );
}

function CoinIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <ellipse
        cx="12"
        cy="7"
        rx="7"
        ry="3.5"
      />

      <path d="M5 7v5c0 2 3.1 3.5 7 3.5s7-1.5 7-3.5V7" />

      <path d="M5 12v5c0 2 3.1 3.5 7 3.5s7-1.5 7-3.5v-5" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M12 3 2.8 20h18.4L12 3Z" />

      <path d="M12 9v5M12 17h.01" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M4 20V10" />

      <path d="M10 20V4" />

      <path d="M16 20v-7" />

      <path d="M22 20H2" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />

      <circle
        cx="12"
        cy="12"
        r="2.5"
      />
    </svg>
  );
}

/* =========================
   PAGE
========================= */

export default function InsightsPage() {
  const {
    budget,
    expenses,
    totalSpent,
    balance,
  } = useBudget();

  const {
    monthlyIncome,

    monthlyBudget,

    totalSpent: analyzedTotalSpent,

    remainingBalance,

    budgetUsage,

    savingsAmount,

    savingsRate,

    safeDailyLimit,

    financialScore,

    financialProfile,

    riskLevel,

    categories,

    recommendations,

    weeklyChallenge,

    behaviorSummary,

    cityMessage,
  } = useFinancialAnalysis();

  /* =========================
     GEMINI AI
  ========================= */

  const {
    aiInsight,
    isAnalyzing,
    aiError,
    analyzeFinancialData,
  } = useAIInsights();

  /* =========================
     FORMATTER
  ========================= */

  const numberFormatter = useMemo(() => {
    return new Intl.NumberFormat(
      "en-US",
      {
        maximumFractionDigits: 1,
      }
    );
  }, []);

  /* =========================
     SAFE REAL DATA
  ========================= */

  const safeExpenses = Array.isArray(
    expenses
  )
    ? expenses
    : [];

  const safeCategories = Array.isArray(
    categories
  )
    ? categories
    : [];

  const safeRecommendations =
    Array.isArray(recommendations)
      ? recommendations
      : [];

  const safeBudget = Number(
    monthlyBudget ?? budget ?? 0
  );

  const safeSpent = Number(
    analyzedTotalSpent ??
      totalSpent ??
      0
  );

  const safeBalance = Number(
    remainingBalance ??
      balance ??
      0
  );

  const safeIncome = Number(
    monthlyIncome ?? 0
  );

  const safeSavings = Number(
    savingsAmount ?? 0
  );

  const safeSavingsRate = Math.max(
    Number(savingsRate) || 0,
    0
  );

  const safeBudgetUsage = Math.max(
    Number(budgetUsage) || 0,
    0
  );

  const safeDailyLimitValue = Math.max(
    Number(safeDailyLimit) || 0,
    0
  );

  const hasFinancialData =
    safeExpenses.length > 0;

  const safeFinancialScore =
    hasFinancialData
      ? clamp(
          Number(financialScore) || 0,
          0,
          100
        )
      : null;

  /* =========================
     CATEGORIES
  ========================= */

  const categoryData =
    useMemo<CategoryData[]>(() => {
      const sorted = [
        ...safeCategories,
      ].sort(
        (first, second) =>
          Number(second.amount || 0) -
          Number(first.amount || 0)
      );

      const visible = sorted.slice(
        0,
        5
      );

      const hidden = sorted.slice(5);

      const combined = [...visible];

      if (hidden.length > 0) {
        combined.push({
          name: "Other",

          amount: hidden.reduce(
            (total, category) =>
              total +
              Number(
                category.amount || 0
              ),
            0
          ),

          percentage: hidden.reduce(
            (total, category) =>
              total +
              Number(
                category.percentage || 0
              ),
            0
          ),
        });
      }

      return combined.map(
        (category, index) => ({
          name: category.name,

          amount: Number(
            category.amount || 0
          ),

          percent: clamp(
            Number(
              category.percentage
            ) || 0,
            0,
            100
          ),

          color:
            CATEGORY_COLORS[
              index %
                CATEGORY_COLORS.length
            ],
        })
      );
    }, [safeCategories]);

  const highestCategory =
    categoryData[0] ?? null;

  /* =========================
     DONUT
  ========================= */

  const donutGradient = useMemo(() => {
    if (
      categoryData.length === 0 ||
      safeSpent <= 0
    ) {
      return "#e7e9ef 0% 100%";
    }

    let currentPercent = 0;

    return categoryData
      .map((category, index) => {
        const start =
          currentPercent;

        const end =
          index ===
          categoryData.length - 1
            ? 100
            : Math.min(
                100,
                start +
                  category.percent
              );

        currentPercent = end;

        return `${category.color} ${start}% ${end}%`;
      })
      .join(", ");
  }, [
    categoryData,
    safeSpent,
  ]);

  /* =========================
     FINBOT MESSAGE
  ========================= */

  const advisorMessage = useMemo(() => {
    if (isAnalyzing) {
      return {
        title:
          "FinBot is analyzing your financial city",

        description:
          "Gemini is reviewing your real spending, budget, balance, expense categories and current financial indicators.",
      };
    }

    if (aiError) {
      return {
        title:
          "AI analysis is temporarily unavailable",

        description: aiError,
      };
    }

    if (aiInsight) {
      return {
        title: aiInsight.title,

        description:
          aiInsight.summary,
      };
    }

    if (!hasFinancialData) {
      return {
        title:
          "Your financial scanner is waiting",

        description:
          "Record your first expense to unlock real Gemini AI analysis, category insights, risk detection and personalized recommendations.",
      };
    }

    return {
      title:
        "FinBot is ready to analyze your real data",

      description:
        "Run Gemini analysis to receive personalized financial insights based only on your actual CityWallet activity.",
    };
  }, [
    isAnalyzing,
    aiError,
    aiInsight,
    hasFinancialData,
  ]);

  /* =========================
     RISK
  ========================= */

  const threatLevel =
    hasFinancialData
      ? safeBalance < 0
        ? "Critical"
        : riskLevel ||
          "Not available"
      : "No data";

  const threatClass =
    threatLevel === "Critical"
      ? styles.critical

      : threatLevel === "High"
        ? styles.high

        : threatLevel === "Medium"
          ? styles.medium

          : threatLevel === "Low"
            ? styles.low

            : styles.waiting;

  /* =========================
     REAL ACTIVE MISSION
  ========================= */

  const missionProgress = clamp(
    Number(
      weeklyChallenge?.progress
    ) || 0,
    0,
    100
  );

  const missionReward = Number(
    weeklyChallenge?.rewardCoins || 0
  );

  /* =========================
     RECENT EXPENSES
  ========================= */

  const recentExpenses = useMemo(() => {
    return [...safeExpenses]
      .reverse()
      .slice(0, 5);
  }, [safeExpenses]);

  /* =========================
     VISIBLE RECOMMENDATIONS
  ========================= */

  const visibleRecommendations =
    aiInsight
      ? aiInsight.recommendations
      : safeRecommendations;

  /* =========================
     REAL GEMINI ANALYSIS
  ========================= */

  async function handleAIAnalysis() {
    if (!hasFinancialData) {
      return;
    }

    await analyzeFinancialData({
      monthlyIncome:
        safeIncome,

      monthlyBudget:
        safeBudget,

      totalSpent:
        safeSpent,

      remainingBalance:
        safeBalance,

      budgetUsage:
        safeBudgetUsage,

      savingsAmount:
        safeSavings,

      savingsRate:
        safeSavingsRate,

      safeDailyLimit:
        safeDailyLimitValue,

      financialScore:
        safeFinancialScore,

      riskLevel:
        threatLevel,

      expenses: safeExpenses.map(
        (expense) => ({
          name:
            expense.name,

          amount:
            Number(
              expense.amount
            ) || 0,

          category:
            expense.category,

          createdAt:
            expense.createdAt,
        })
      ),

      categories:
        safeCategories.map(
          (category) => ({
            name:
              category.name,

            amount:
              Number(
                category.amount
              ) || 0,

            percentage:
              Number(
                category.percentage
              ) || 0,
          })
        ),

      weeklyChallenge,
    });
  }

  /* =========================
     CSV EXPORT
  ========================= */

  function exportReport() {
    if (!hasFinancialData) {
      return;
    }

    const summaryRows = [
      [
        "CityWallet Financial Analysis",
      ],

      ["Monthly Income", safeIncome],

      ["Monthly Budget", safeBudget],

      ["Total Spent", safeSpent],

      [
        "Remaining Balance",
        safeBalance,
      ],

      [
        "Budget Usage",
        `${safeBudgetUsage}%`,
      ],

      [
        "Savings Amount",
        safeSavings,
      ],

      [
        "Savings Rate",
        `${safeSavingsRate}%`,
      ],

      [
        "Financial Score",
        safeFinancialScore ?? "",
      ],

      [
        "Financial Profile",
        financialProfile || "",
      ],

      [
        "Risk Level",
        threatLevel,
      ],

      [
        "Safe Daily Limit",
        safeDailyLimitValue,
      ],

      [],

      [
        "Expense Name",
        "Category",
        "Amount",
      ],
    ];

    const expenseRows =
      safeExpenses.map((expense) => [
        expense.name,

        expense.category,

        expense.amount,
      ]);

    const csv = [
      ...summaryRows,
      ...expenseRows,
    ]
      .map((row) =>
        row
          .map(
            (value) =>
              `"${String(
                value ?? ""
              ).replace(
                /"/g,
                '""'
              )}"`
          )
          .join(",")
      )
      .join("\n");

    const blob = new Blob(
      [csv],
      {
        type:
          "text/csv;charset=utf-8;",
      }
    );

    const url =
      window.URL.createObjectURL(
        blob
      );

    const downloadLink =
      document.createElement("a");

    downloadLink.href = url;

    downloadLink.download =
      "citywallet-financial-analysis.csv";

    document.body.appendChild(
      downloadLink
    );

    downloadLink.click();

    downloadLink.remove();

    window.URL.revokeObjectURL(url);
  }

  return (
    <main className={styles.page}>
      {/* =====================
          HERO
      ===================== */}

      <section className={styles.hero}>
        <div
          className={styles.heroGrid}
        />

        <div
          className={styles.heroGlow}
        />

        {/* FINBOT */}

        <div
          className={styles.finbotArea}
        >
          <div
            className={styles.finbot}
          >
            <div
              className={
                styles.finbotAntenna
              }
            >
              <span />
            </div>

            <div
              className={
                styles.finbotHead
              }
            >
              <div
                className={
                  styles.finbotScreen
                }
              >
                <span />
                <span />
              </div>

              <div
                className={
                  styles.finbotSpeaker
                }
              >
                <i />
                <i />
                <i />
              </div>
            </div>

            <div
              className={
                styles.finbotBody
              }
            >
              <SparkIcon />
            </div>
          </div>

          <div
            className={
              styles.onlineBadge
            }
          >
            <span />

            {isAnalyzing
              ? "FINBOT ANALYZING"
              : "GEMINI CONNECTED"}
          </div>
        </div>

        {/* HERO CONTENT */}

        <div
          className={
            styles.heroContent
          }
        >
          <span
            className={
              styles.heroEyebrow
            }
          >
            ✦ AI FINANCIAL COMMAND CENTER
          </span>

          <h1>
            Understand your money.
            <strong>
              Protect your city.
            </strong>
          </h1>

          <p>
            FinBot uses Gemini AI to
            analyze your real CityWallet
            financial activity and turn it
            into personalized insights,
            warnings and next actions.
          </p>

          <div
            className={
              styles.aiMessage
            }
          >
            <div
              className={
                styles.aiMessageIcon
              }
            >
              <SparkIcon />
            </div>

            <div>
              <span>
                FINBOT INSIGHT
              </span>

              <strong>
                {advisorMessage.title}
              </strong>

              <p>
                {
                  advisorMessage.description
                }
              </p>
            </div>
          </div>

          <div
            className={
              styles.heroActions
            }
          >
            <button
              type="button"
              className={
                styles.primaryButton
              }
              onClick={
                handleAIAnalysis
              }
              disabled={
                isAnalyzing ||
                !hasFinancialData
              }
              title={
                hasFinancialData
                  ? "Analyze your real financial data with Gemini AI"
                  : "Add your first expense before running AI analysis"
              }
            >
              <SparkIcon />

              {isAnalyzing
                ? "FinBot is analyzing..."
                : aiInsight
                  ? "Analyze Again"
                  : "Analyze with FinBot"}

              {!isAnalyzing && (
                <ArrowIcon />
              )}
            </button>

            <Link
              href="/city/expenses"
              className={
                styles.secondaryButton
              }
            >
              <PlusIcon />

              Add New Expense
            </Link>

            <a
              href="#spending-breakdown"
              className={
                styles.ghostButton
              }
            >
              <EyeIcon />

              View Spending Map
            </a>

            <button
              type="button"
              className={
                styles.ghostButton
              }
              onClick={exportReport}
              disabled={!hasFinancialData}
              title={
                hasFinancialData
                  ? "Download your real financial report"
                  : "Add an expense before exporting a report"
              }
            >
              <DownloadIcon />

              Export Report
            </button>
          </div>
        </div>

        {/* SCORE */}

        <div
          className={
            styles.heroScore
          }
        >
          <div
            className={
              styles.scoreRing
            }
            style={{
              background:
                safeFinancialScore ===
                null
                  ? `conic-gradient(
                      rgba(255, 255, 255, 0.1)
                      0% 100%
                    )`
                  : `conic-gradient(
                      #a78bfa
                      0%
                      ${safeFinancialScore}%,
                      rgba(255, 255, 255, 0.1)
                      ${safeFinancialScore}%
                      100%
                    )`,
            }}
          >
            <div>
              <span>
                FINANCIAL SCORE
              </span>

              <strong>
                {safeFinancialScore ??
                  "—"}
              </strong>

              <small>
                {safeFinancialScore !==
                null
                  ? "/ 100"
                  : "No data yet"}
              </small>
            </div>
          </div>

          <div
            className={
              styles.profileCard
            }
          >
            <span>
              FINANCIAL PROFILE
            </span>

            <strong>
              {hasFinancialData
                ? financialProfile ||
                  "Not available"
                : "Waiting for data"}
            </strong>
          </div>
        </div>
      </section>

      {/* =====================
          QUICK STATUS
      ===================== */}

      <section
        className={styles.statGrid}
      >
        {/* SCORE */}

        <article
          className={`${styles.statCard} ${styles.scoreCard}`}
        >
          <div
            className={styles.statIcon}
          >
            <ChartIcon />
          </div>

          <div
            className={
              styles.statContent
            }
          >
            <span>
              FINANCIAL SCORE
            </span>

            <strong>
              {safeFinancialScore ??
                "—"}

              {safeFinancialScore !==
                null && (
                <small>/100</small>
              )}
            </strong>

            <p>
              {hasFinancialData
                ? financialProfile ||
                  "Analysis available"
                : "Add financial activity to calculate your score."}
            </p>
          </div>
        </article>

        {/* BUDGET */}

        <article
          className={`${styles.statCard} ${styles.budgetCard}`}
        >
          <div
            className={styles.statIcon}
          >
            <ShieldIcon />
          </div>

          <div
            className={
              styles.statContent
            }
          >
            <span>
              BUDGET SHIELD
            </span>

            <strong>
              {hasFinancialData
                ? `${Math.round(
                    safeBudgetUsage
                  )}%`
                : "—"}
            </strong>

            <p>
              {numberFormatter.format(
                safeSpent
              )}{" "}
              of{" "}
              {numberFormatter.format(
                safeBudget
              )}{" "}
              SAR
            </p>
          </div>

          <div
            className={
              styles.statProgress
            }
          >
            <span
              style={{
                width: `${hasFinancialData
                  ? clamp(
                      safeBudgetUsage,
                      0,
                      100
                    )
                  : 0}%`,
              }}
            />
          </div>
        </article>

        {/* SAVINGS */}

        <article
          className={`${styles.statCard} ${styles.savingsCard}`}
        >
          <div
            className={styles.statIcon}
          >
            <CoinIcon />
          </div>

          <div
            className={
              styles.statContent
            }
          >
            <span>
              SAVINGS RESERVE
            </span>

            <strong>
              {hasFinancialData
                ? `${numberFormatter.format(
                    safeSavingsRate
                  )}%`
                : "—"}
            </strong>

            <p>
              {numberFormatter.format(
                safeSavings
              )}{" "}
              SAR currently available
            </p>
          </div>

          <div
            className={
              styles.statProgress
            }
          >
            <span
              style={{
                width: `${hasFinancialData
                  ? clamp(
                      safeSavingsRate,
                      0,
                      100
                    )
                  : 0}%`,
              }}
            />
          </div>
        </article>

        {/* SAFE DAILY */}

        <article
          className={`${styles.statCard} ${styles.dailyCard}`}
        >
          <div
            className={styles.statIcon}
          >
            <TargetIcon />
          </div>

          <div
            className={
              styles.statContent
            }
          >
            <span>
              SAFE DAILY LIMIT
            </span>

            <strong>
              {hasFinancialData
                ? numberFormatter.format(
                    safeDailyLimitValue
                  )
                : "—"}

              {hasFinancialData && (
                <small> SAR</small>
              )}
            </strong>

            <p>
              {hasFinancialData
                ? "Recommended daily spending pace based on your current data."
                : "Available after financial activity is recorded."}
            </p>
          </div>
        </article>
      </section>

      {/* =====================
          PROFILE BAR
      ===================== */}

      <section
        className={styles.profileBar}
      >
        <div
          className={
            styles.profileBarIcon
          }
        >
          <AlertIcon />
        </div>

        <div
          className={
            styles.profileBarContent
          }
        >
          <span>
            CURRENT RISK LEVEL
          </span>

          <strong>
            {threatLevel}
          </strong>
        </div>

        <div
          className={`${styles.riskBadge} ${threatClass}`}
        >
          {threatLevel}
        </div>

        <p>
          {aiInsight
            ? aiInsight.summary
            : hasFinancialData
              ? behaviorSummary ||
                cityMessage ||
                "Your current financial status is ready for review."
              : "Add your first expense to activate financial risk analysis."}
        </p>

        <Link
          href="/city/expenses"
          className={
            styles.compactButton
          }
        >
          <ReceiptIcon />

          Review Expenses

          <ArrowIcon />
        </Link>
      </section>

      {/* =====================
          REAL GEMINI ANALYSIS
      ===================== */}

      {aiInsight && (
        <section
          className={
            styles.recommendationsPanel
          }
        >
          <div
            className={
              styles.panelHeader
            }
          >
            <div>
              <span
                className={
                  styles.sectionEyebrow
                }
              >
                ✦ GEMINI AI ANALYSIS
              </span>

              <h2>
                {aiInsight.title}
              </h2>

              <p>
                {aiInsight.analysis}
              </p>
            </div>

            <button
              type="button"
              className={
                styles.panelActionButton
              }
              onClick={
                handleAIAnalysis
              }
              disabled={isAnalyzing}
            >
              <SparkIcon />

              {isAnalyzing
                ? "Analyzing..."
                : "Refresh AI Analysis"}
            </button>
          </div>

          <div
            className={
              styles.recommendationGrid
            }
          >
            <article
              className={
                styles.recommendationCard
              }
            >
              <div
                className={
                  styles.recommendationNumber
                }
              >
                01
              </div>

              <div
                className={
                  styles.recommendationIcon
                }
              >
                🧠
              </div>

              <span>
                AI SUMMARY
              </span>

              <strong>
                Financial Overview
              </strong>

              <p>
                {aiInsight.summary}
              </p>
            </article>

            <article
              className={
                styles.recommendationCard
              }
            >
              <div
                className={
                  styles.recommendationNumber
                }
              >
                02
              </div>

              <div
                className={
                  styles.recommendationIcon
                }
              >
                {aiInsight.warning
                  ? "⚠️"
                  : "🛡️"}
              </div>

              <span>
                FINANCIAL WARNING
              </span>

              <strong>
                {aiInsight.warning
                  ? "Attention Required"
                  : "No Specific Warning"}
              </strong>

              <p>
                {aiInsight.warning ||
                  "Gemini did not identify a specific financial warning from the supplied data."}
              </p>
            </article>

            <article
              className={
                styles.recommendationCard
              }
            >
              <div
                className={
                  styles.recommendationNumber
                }
              >
                03
              </div>

              <div
                className={
                  styles.recommendationIcon
                }
              >
                🌱
              </div>

              <span>
                EXPECTED DIRECTION
              </span>

              <strong>
                Possible Improvement
              </strong>

              <p>
                {
                  aiInsight.expectedResult
                }
              </p>
            </article>
          </div>
        </section>
      )}

      {/* =====================
          AI ACTION PLAN
      ===================== */}

      {aiInsight &&
        aiInsight.actions.length > 0 && (
          <section
            className={
              styles.recommendationsPanel
            }
          >
            <div
              className={
                styles.panelHeader
              }
            >
              <div>
                <span
                  className={
                    styles.sectionEyebrow
                  }
                >
                  ⚡ GEMINI ACTION PLAN
                </span>

                <h2>
                  Your Next Three Actions
                </h2>

                <p>
                  Practical actions generated
                  from your actual CityWallet
                  financial data.
                </p>
              </div>
            </div>

            <div
              className={
                styles.recommendationGrid
              }
            >
              {aiInsight.actions.map(
                (action, index) => (
                  <article
                    className={
                      styles.recommendationCard
                    }
                    key={`${action}-${index}`}
                  >
                    <div
                      className={
                        styles.recommendationNumber
                      }
                    >
                      {String(
                        index + 1
                      ).padStart(2, "0")}
                    </div>

                    <div
                      className={
                        styles.recommendationIcon
                      }
                    >
                      {index === 0
                        ? "🎯"
                        : index === 1
                          ? "🛡️"
                          : "⚡"}
                    </div>

                    <span>
                      ACTION {index + 1}
                    </span>

                    <strong>
                      Recommended Move
                    </strong>

                    <p>
                      {action}
                    </p>
                  </article>
                )
              )}
            </div>
          </section>
        )}

      {/* =====================
          MAIN GRID
      ===================== */}

      <div
        className={styles.mainGrid}
      >
        {/* REAL ACTIVE MISSION */}

        <section
          className={
            styles.missionPanel
          }
        >
          <div
            className={
              styles.panelHeader
            }
          >
            <div>
              <span
                className={
                  styles.sectionEyebrow
                }
              >
                ⚔ ACTIVE FINANCIAL MISSION
              </span>

              <h2>
                {weeklyChallenge?.title ||
                  "No active mission"}
              </h2>

              <p>
                {weeklyChallenge?.description ||
                  "Your next financial mission will appear here when enough data is available."}
              </p>
            </div>

            {missionReward > 0 && (
              <div
                className={
                  styles.rewardBadge
                }
              >
                <span>
                  🪙 REWARD
                </span>

                <strong>
                  {missionReward}
                </strong>

                <small>Coins</small>
              </div>
            )}
          </div>

          <div
            className={
              styles.missionArena
            }
          >
            <div
              className={
                styles.missionVisual
              }
            >
              <div
                className={
                  styles.targetRings
                }
              >
                <span />
                <span />

                <TargetIcon />
              </div>

              <div
                className={
                  styles.missionVisualStatus
                }
              >
                <span>
                  MISSION STATUS
                </span>

                <strong>
                  {weeklyChallenge?.completed
                    ? "COMPLETED"
                    : hasFinancialData
                      ? "IN PROGRESS"
                      : "WAITING FOR DATA"}
                </strong>
              </div>
            </div>

            <div
              className={
                styles.missionDetails
              }
            >
              <div
                className={
                  styles.missionProgressTop
                }
              >
                <span>
                  CURRENT PROGRESS
                </span>

                <strong>
                  {missionProgress}%
                </strong>
              </div>

              <div
                className={
                  styles.missionTrack
                }
              >
                <span
                  style={{
                    width: `${missionProgress}%`,
                  }}
                />
              </div>

              <p
                className={
                  styles.missionTarget
                }
              >
                {weeklyChallenge?.target ||
                  "Complete financial activity to unlock progress."}
              </p>

              <div
                className={
                  styles.missionSteps
                }
              >
                <div
                  className={
                    missionProgress > 0
                      ? styles.stepComplete
                      : ""
                  }
                >
                  <span>
                    {missionProgress > 0 ? (
                      <CheckIcon />
                    ) : (
                      "1"
                    )}
                  </span>

                  <div>
                    <strong>
                      Start progress
                    </strong>

                    <p>
                      Record real financial
                      activity.
                    </p>
                  </div>
                </div>

                <div
                  className={
                    missionProgress >= 50
                      ? styles.stepComplete
                      : ""
                  }
                >
                  <span>
                    {missionProgress >= 50 ? (
                      <CheckIcon />
                    ) : (
                      "2"
                    )}
                  </span>

                  <div>
                    <strong>
                      Reach halfway
                    </strong>

                    <p>
                      Continue improving your
                      financial behavior.
                    </p>
                  </div>
                </div>

                <div
                  className={
                    weeklyChallenge?.completed
                      ? styles.stepComplete
                      : ""
                  }
                >
                  <span>
                    {weeklyChallenge?.completed ? (
                      <CheckIcon />
                    ) : (
                      "3"
                    )}
                  </span>

                  <div>
                    <strong>
                      Complete objective
                    </strong>

                    <p>
                      Reach the real mission
                      target.
                    </p>
                  </div>
                </div>
              </div>

              <div
                className={
                  styles.missionActions
                }
              >
                {weeklyChallenge?.completed ? (
                  <div
                    className={
                      styles.completedMission
                    }
                  >
                    <CheckIcon />

                    Mission completed
                  </div>
                ) : (
                  <Link
                    href="/city/expenses"
                    className={
                      styles.missionButton
                    }
                  >
                    <ReceiptIcon />

                    Continue Mission

                    <ArrowIcon />
                  </Link>
                )}

                <a
                  href="#recommendations"
                  className={
                    styles.missionSecondaryButton
                  }
                >
                  <SparkIcon />

                  View Recommendations
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* SPENDING */}

        <section
          className={
            styles.scannerPanel
          }
          id="spending-breakdown"
        >
          <div
            className={
              styles.panelHeader
            }
          >
            <div>
              <span
                className={
                  styles.sectionEyebrow
                }
              >
                ◉ RESOURCE SCANNER
              </span>

              <h2>
                Spending Zones
              </h2>

              <p>
                Your actual expenses grouped
                by financial category.
              </p>
            </div>

            <button
              type="button"
              className={
                styles.exportButton
              }
              onClick={exportReport}
              disabled={!hasFinancialData}
            >
              <DownloadIcon />

              Export
            </button>
          </div>

          <div
            className={
              styles.scannerContent
            }
          >
            <div
              className={
                styles.donutArea
              }
            >
              <div
                className={styles.donut}
                style={{
                  background: `conic-gradient(${donutGradient})`,
                }}
              >
                <div
                  className={
                    styles.donutCenter
                  }
                >
                  <span>
                    TOTAL SPENT
                  </span>

                  <strong>
                    {numberFormatter.format(
                      safeSpent
                    )}
                  </strong>

                  <small>SAR</small>
                </div>
              </div>

              <div
                className={
                  styles.scanPulse
                }
              />
            </div>

            {categoryData.length === 0 ? (
              <div
                className={
                  styles.emptyState
                }
              >
                <div
                  className={
                    styles.emptyIcon
                  }
                >
                  <ReceiptIcon />
                </div>

                <strong>
                  No spending data yet
                </strong>

                <p>
                  Add your first expense to
                  reveal your category map.
                </p>

                <Link
                  href="/city/expenses"
                  className={
                    styles.emptyButton
                  }
                >
                  <PlusIcon />

                  Add First Expense

                  <ArrowIcon />
                </Link>
              </div>
            ) : (
              <div
                className={
                  styles.categoryList
                }
              >
                {categoryData.map(
                  (
                    category,
                    index
                  ) => (
                    <article
                      key={category.name}
                      className={
                        styles.categoryItem
                      }
                    >
                      <div
                        className={
                          styles.categoryRank
                        }
                        style={{
                          background:
                            category.color,
                        }}
                      >
                        {index + 1}
                      </div>

                      <div
                        className={
                          styles.categoryInfo
                        }
                      >
                        <div
                          className={
                            styles.categoryTop
                          }
                        >
                          <strong>
                            {
                              category.name
                            }
                          </strong>

                          <span>
                            {numberFormatter.format(
                              category.amount
                            )}{" "}
                            SAR
                          </span>
                        </div>

                        <div
                          className={
                            styles.categoryTrack
                          }
                        >
                          <span
                            style={{
                              width: `${category.percent}%`,

                              background:
                                category.color,
                            }}
                          />
                        </div>
                      </div>

                      <strong
                        className={
                          styles.categoryPercent
                        }
                      >
                        {Math.round(
                          category.percent
                        )}
                        %
                      </strong>
                    </article>
                  )
                )}
              </div>
            )}
          </div>

          {highestCategory && (
            <div
              className={
                styles.scannerInsight
              }
            >
              <SparkIcon />

              <div>
                <span>
                  TOP SPENDING ZONE
                </span>

                <strong>
                  {highestCategory.name}
                </strong>

                <p>
                  {Math.round(
                    highestCategory.percent
                  )}
                  % of your recorded spending,
                  totaling{" "}
                  {numberFormatter.format(
                    highestCategory.amount
                  )}{" "}
                  SAR.
                </p>
              </div>

              <Link
                href="/city/expenses"
                className={
                  styles.insightButton
                }
              >
                Review

                <ArrowIcon />
              </Link>
            </div>
          )}
        </section>
      </div>

      {/* =====================
          AI-SUGGESTED MISSION
      ===================== */}

      {aiInsight && (
        <section
          className={
            styles.missionPanel
          }
        >
          <div
            className={
              styles.panelHeader
            }
          >
            <div>
              <span
                className={
                  styles.sectionEyebrow
                }
              >
                ✦ AI-SUGGESTED MISSION
              </span>

              <h2>
                {
                  aiInsight
                    .suggestedMission
                    .title
                }
              </h2>

              <p>
                {
                  aiInsight
                    .suggestedMission
                    .description
                }
              </p>
            </div>
          </div>

          <div
            className={
              styles.missionArena
            }
          >
            <div
              className={
                styles.missionVisual
              }
            >
              <div
                className={
                  styles.targetRings
                }
              >
                <span />
                <span />

                <TargetIcon />
              </div>

              <div
                className={
                  styles.missionVisualStatus
                }
              >
                <span>
                  AI STATUS
                </span>

                <strong>
                  SUGGESTED ONLY
                </strong>
              </div>
            </div>

            <div
              className={
                styles.missionDetails
              }
            >
              <div
                className={
                  styles.missionProgressTop
                }
              >
                <span>
                  MISSION TARGET
                </span>
              </div>

              <p
                className={
                  styles.missionTarget
                }
              >
                {
                  aiInsight
                    .suggestedMission
                    .target
                }
              </p>

              <div
                className={
                  styles.missionSteps
                }
              >
                <div>
                  <span>1</span>

                  <div>
                    <strong>
                      Why FinBot selected this
                    </strong>

                    <p>
                      {
                        aiInsight
                          .suggestedMission
                          .reason
                      }
                    </p>
                  </div>
                </div>
              </div>

              <div
                className={
                  styles.missionActions
                }
              >
                <Link
                  href="/city/expenses"
                  className={
                    styles.missionButton
                  }
                >
                  <ReceiptIcon />

                  Review Your Activity

                  <ArrowIcon />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =====================
          RECOMMENDATIONS
      ===================== */}

      <section
        className={
          styles.recommendationsPanel
        }
        id="recommendations"
      >
        <div
          className={
            styles.panelHeader
          }
        >
          <div>
            <span
              className={
                styles.sectionEyebrow
              }
            >
              {aiInsight
                ? "✦ GEMINI AI RECOMMENDATIONS"
                : "✦ FINBOT RECOMMENDATIONS"}
            </span>

            <h2>
              Your Next Financial Moves
            </h2>

            <p>
              {aiInsight
                ? "Personalized recommendations generated by Gemini from your real financial activity."
                : "Suggestions generated from your current financial analysis."}
            </p>
          </div>

          {hasFinancialData ? (
            <button
              type="button"
              className={
                styles.panelActionButton
              }
              onClick={
                handleAIAnalysis
              }
              disabled={isAnalyzing}
            >
              <SparkIcon />

              {isAnalyzing
                ? "Analyzing..."
                : aiInsight
                  ? "Refresh AI Advice"
                  : "Generate AI Advice"}
            </button>
          ) : (
            <Link
              href="/city/expenses"
              className={
                styles.panelActionButton
              }
            >
              <PlusIcon />

              Record New Activity
            </Link>
          )}
        </div>

        {visibleRecommendations.length ===
        0 ? (
          <div
            className={
              styles.recommendationsEmpty
            }
          >
            <div
              className={
                styles.emptyIcon
              }
            >
              <SparkIcon />
            </div>

            <strong>
              More activity is needed
            </strong>

            <p>
              Add financial activity to
              unlock personalized
              recommendations.
            </p>

            <Link
              href="/city/expenses"
              className={
                styles.emptyButton
              }
            >
              <PlusIcon />

              Add Expense

              <ArrowIcon />
            </Link>
          </div>
        ) : (
          <div
            className={
              styles.recommendationGrid
            }
          >
            {visibleRecommendations
              .slice(0, 3)
              .map(
                (
                  recommendation,
                  index
                ) => (
                  <article
                    className={
                      styles.recommendationCard
                    }
                    key={`${recommendation.title}-${index}`}
                  >
                    <div
                      className={
                        styles.recommendationNumber
                      }
                    >
                      {String(
                        index + 1
                      ).padStart(2, "0")}
                    </div>

                    <div
                      className={
                        styles.recommendationIcon
                      }
                    >
                      {index === 0
                        ? "🎯"
                        : index === 1
                          ? "🛡️"
                          : "⚡"}
                    </div>

                    <span>
                      {aiInsight
                        ? "GEMINI AI MOVE"
                        : "FINBOT MOVE"}
                    </span>

                    <strong>
                      {
                        recommendation.title
                      }
                    </strong>

                    <p>
                      {
                        recommendation.description
                      }
                    </p>

                    {recommendation.action && (
                      <div
                        className={
                          styles.recommendationAction
                        }
                      >
                        <ArrowIcon />

                        {
                          recommendation.action
                        }
                      </div>
                    )}
                  </article>
                )
              )}
          </div>
        )}
      </section>

      {/* =====================
          ACTIVITY
      ===================== */}

      <section
        className={
          styles.activityPanel
        }
      >
        <div
          className={
            styles.panelHeader
          }
        >
          <div>
            <span
              className={
                styles.sectionEyebrow
              }
            >
              📜 CITY TRANSACTION LOG
            </span>

            <h2>
              Recent Financial Activity
            </h2>

            <p>
              Your latest recorded
              transactions.
            </p>
          </div>

          <Link
            href="/city/expenses"
            className={
              styles.viewAllButton
            }
          >
            View All Expenses

            <ArrowIcon />
          </Link>
        </div>

        {recentExpenses.length === 0 ? (
          <div
            className={
              styles.activityEmpty
            }
          >
            <div
              className={
                styles.emptyIcon
              }
            >
              <ReceiptIcon />
            </div>

            <strong>
              No financial activity yet
            </strong>

            <p>
              Record your first expense to
              activate the transaction log.
            </p>

            <Link
              href="/city/expenses"
              className={
                styles.emptyButton
              }
            >
              <PlusIcon />

              Add First Expense

              <ArrowIcon />
            </Link>
          </div>
        ) : (
          <div
            className={
              styles.activityList
            }
          >
            {recentExpenses.map(
              (
                expense,
                index
              ) => {
                const impact =
                  safeBudget > 0
                    ? (
                        (Number(
                          expense.amount
                        ) /
                          safeBudget) *
                        100
                      ).toFixed(1)
                    : "0.0";

                return (
                  <article
                    className={
                      styles.activityItem
                    }
                    key={
                      expense.id ??
                      `${expense.name}-${index}`
                    }
                  >
                    <div
                      className={
                        styles.activityNumber
                      }
                    >
                      {String(
                        index + 1
                      ).padStart(
                        2,
                        "0"
                      )}
                    </div>

                    <div
                      className={
                        styles.activityIcon
                      }
                    >
                      {expense.name
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div
                      className={
                        styles.activityInfo
                      }
                    >
                      <strong>
                        {expense.name}
                      </strong>

                      <span>
                        {
                          expense.category
                        }
                      </span>
                    </div>

                    <div
                      className={
                        styles.activityImpact
                      }
                    >
                      <span>
                        BUDGET IMPACT
                      </span>

                      <strong>
                        {impact}%
                      </strong>
                    </div>

                    <strong
                      className={
                        styles.activityAmount
                      }
                    >
                      {numberFormatter.format(
                        Number(
                          expense.amount
                        ) || 0
                      )}{" "}
                      SAR
                    </strong>

                    <Link
                      href="/city/expenses"
                      className={
                        styles.activityButton
                      }
                    >
                      Review

                      <ArrowIcon />
                    </Link>
                  </article>
                );
              }
            )}
          </div>
        )}
      </section>
    </main>
  );
}