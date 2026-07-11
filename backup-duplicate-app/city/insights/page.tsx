"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useBudget } from "@/context/BudgetContext";
import { useFinancialAnalysis } from "@/context/FinancialAnalysisContext";

import styles from "./insights.module.css";

type CategoryData = {
  name: string;
  amount: number;
  percent: number;
  color: string;
};

type MissionData = {
  title: string;
  description: string;
  current: number;
  target: number;
  progress: number;
  progressText: string;
  completed: boolean;
  reward: number;
};

const CATEGORY_COLORS = [
  "#ff7a18",
  "#38bdf8",
  "#8b5cf6",
  "#facc15",
  "#22c55e",
  "#ef4444",
  "#14b8a6",
  "#64748b",
];

const STORAGE_KEYS = {
  missionActive:
    "citywallet-smart-mission-active",
  rewardClaimed:
    "citywallet-smart-reward-claimed",
  advisorTokens:
    "citywallet-advisor-tokens",
};

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3v12" />
      <path d="m7 10 5 5 5-5" />
      <path d="M5 20h14" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 7v5h-5" />
      <path d="M4 17v-5h5" />
      <path d="M6.1 8a7 7 0 0 1 11.5-2L20 8" />
      <path d="m4 16 2.4 2A7 7 0 0 0 18 16" />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m12 3 1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3Z" />
      <path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3 20 6v6c0 5-3.4 8-8 9-4.6-1-8-4-8-9V6l8-3Z" />
      <path d="m8.5 12 2.2 2.2 4.8-5" />
    </svg>
  );
}

function CoinIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <ellipse cx="12" cy="7" rx="7" ry="3.5" />

      <path d="M5 7v5c0 2 3.1 3.5 7 3.5s7-1.5 7-3.5V7" />

      <path d="M5 12v5c0 2 3.1 3.5 7 3.5s7-1.5 7-3.5v-5" />
    </svg>
  );
}

function TargetIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
      <path d="m14 10 6-6" />
      <path d="M17 4h3v3" />
    </svg>
  );
}

function ReceiptIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z" />
      <path d="M9 8h6M9 12h6M9 16h3" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14" />
      <path d="m14 7 5 5-5 5" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3 2.8 20h18.4L12 3Z" />
      <path d="M12 9v5M12 17h.01" />
    </svg>
  );
}

function LoadingPage() {
  return (
    <div className={styles.loadingPage}>
      <div className={styles.loadingHero} />

      <div className={styles.loadingStats}>
        <span />
        <span />
        <span />
        <span />
      </div>

      <div className={styles.loadingContent}>
        <span />
        <span />
      </div>
    </div>
  );
}

export default function InsightsPage() {
  const {
    budget,
    expenses,
    totalSpent,
    balance,
  } = useBudget();

  const {
    survey,
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

  const [mounted, setMounted] =
    useState(false);

  const [missionActive, setMissionActive] =
    useState(false);

  const [rewardClaimed, setRewardClaimed] =
    useState(false);

  const [advisorTokens, setAdvisorTokens] =
    useState(0);

  const [analyzing, setAnalyzing] =
    useState(false);

  const [lastUpdated, setLastUpdated] =
    useState("Ready");

  const [notice, setNotice] =
    useState("");

  useEffect(() => {
    const storedMission =
      window.localStorage.getItem(
        STORAGE_KEYS.missionActive
      );

    const storedReward =
      window.localStorage.getItem(
        STORAGE_KEYS.rewardClaimed
      );

    const storedTokens =
      window.localStorage.getItem(
        STORAGE_KEYS.advisorTokens
      );

    setMissionActive(
      storedMission === "true"
    );

    setRewardClaimed(
      storedReward === "true"
    );

    setAdvisorTokens(
      Number(storedTokens ?? 0) || 0
    );

    setLastUpdated(
      new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }).format(new Date())
    );

    setMounted(true);
  }, []);

  const numberFormatter = useMemo(() => {
    return new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 0,
    });
  }, []);

  const safeBudget = Number(
    monthlyBudget || budget || 0
  );

  const safeSpent = Number(
    analyzedTotalSpent || totalSpent || 0
  );

  const safeBalance = Number(
    remainingBalance ?? balance ?? 0
  );

  const safeExpenses = expenses ?? [];

  const budgetUsed = budgetUsage;

  const savedAmount = savingsAmount;

  const cityHealth = financialScore;

  const categoryData =
    useMemo<CategoryData[]>(() => {
      const visible =
        categories.slice(0, 5);

      const hidden =
        categories.slice(5);

      const combined = [...visible];

      if (hidden.length > 0) {
        combined.push({
          name: "Other",

          amount: hidden.reduce(
            (sum, item) =>
              sum + item.amount,
            0
          ),

          percentage: hidden.reduce(
            (sum, item) =>
              sum + item.percentage,
            0
          ),
        });
      }

      return combined.map(
        (category, index) => ({
          name: category.name,
          amount: category.amount,
          percent: category.percentage,

          color:
            CATEGORY_COLORS[
              index %
                CATEGORY_COLORS.length
            ],
        })
      );
    }, [categories]);

  const highestCategory =
    categoryData[0];

  const donutGradient = useMemo(() => {
    if (
      categoryData.length === 0 ||
      safeSpent <= 0
    ) {
      return "#dbe4ee 0% 100%";
    }

    let currentPercent = 0;

    return categoryData
      .map((category, index) => {
        const start = currentPercent;

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
  }, [categoryData, safeSpent]);

  const mission =
    useMemo<MissionData>(() => {
      return {
        title: weeklyChallenge.title,

        description:
          weeklyChallenge.description,

        current:
          weeklyChallenge.progress,

        target: 100,

        progress:
          weeklyChallenge.progress,

        progressText:
          weeklyChallenge.target,

        completed:
          weeklyChallenge.completed,

        reward:
          weeklyChallenge.rewardCoins,
      };
    }, [weeklyChallenge]);

  const threatLevel =
    safeBalance < 0
      ? "Critical"
      : riskLevel;

  const advisorMessage = useMemo(() => {
    const primaryRecommendation =
      recommendations[0];

    if (primaryRecommendation) {
      return {
        title:
          primaryRecommendation.title,

        description: `${primaryRecommendation.description} ${primaryRecommendation.action}`,
      };
    }

    return {
      title: financialProfile,

      description:
        behaviorSummary ||
        cityMessage,
    };
  }, [
    recommendations,
    financialProfile,
    behaviorSummary,
    cityMessage,
  ]);

  const recentExpenses = useMemo(() => {
    return [...safeExpenses]
      .reverse()
      .slice(0, 4);
  }, [safeExpenses]);

  function showNotice(message: string) {
    setNotice(message);

    window.setTimeout(() => {
      setNotice("");
    }, 2200);
  }

  function activateMission() {
    setMissionActive(true);
    setRewardClaimed(false);

    window.localStorage.setItem(
      STORAGE_KEYS.missionActive,
      "true"
    );

    window.localStorage.setItem(
      STORAGE_KEYS.rewardClaimed,
      "false"
    );

    showNotice(
      "Smart mission activated successfully."
    );
  }

  function claimReward() {
    if (
      !missionActive ||
      !mission.completed ||
      rewardClaimed
    ) {
      return;
    }

    const newTokens =
      advisorTokens + mission.reward;

    setAdvisorTokens(newTokens);
    setRewardClaimed(true);

    window.localStorage.setItem(
      STORAGE_KEYS.advisorTokens,
      String(newTokens)
    );

    window.localStorage.setItem(
      STORAGE_KEYS.rewardClaimed,
      "true"
    );

    showNotice(
      `Reward claimed: +${mission.reward} Advisor Tokens`
    );
  }

  function refreshAnalysis() {
    if (analyzing) {
      return;
    }

    setAnalyzing(true);
    setNotice("");

    window.setTimeout(() => {
      setAnalyzing(false);

      setLastUpdated(
        new Intl.DateTimeFormat(
          "en-US",
          {
            hour: "numeric",
            minute: "2-digit",
          }
        ).format(new Date())
      );

      showNotice(
        "Financial analysis refreshed."
      );
    }, 800);
  }

  function exportReport() {
    const summaryRows = [
      [
        "CityWallet Smart Financial Report",
      ],

      [
        "Monthly Budget",
        safeBudget,
      ],

      [
        "Total Spent",
        safeSpent,
      ],

      [
        "Remaining Balance",
        safeBalance,
      ],

      [
        "Budget Usage",
        `${budgetUsed}%`,
      ],

      [
        "Savings Rate",
        `${savingsRate}%`,
      ],

      [
        "Monthly Income",
        monthlyIncome,
      ],

      [
        "Financial Score",
        financialScore,
      ],

      [
        "Financial Profile",
        financialProfile,
      ],

      [
        "Risk Level",
        riskLevel,
      ],

      [
        "Safe Daily Limit",
        safeDailyLimit,
      ],

      [
        "Survey Goal",
        survey.financialGoal,
      ],

      [
        "Spending Behavior",
        survey.spendingBehavior,
      ],

      [
        "Saving Habit",
        survey.savingHabit,
      ],

      [
        "Challenge Preference",
        survey.challengePreference,
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

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url =
      window.URL.createObjectURL(blob);

    const downloadLink =
      document.createElement("a");

    downloadLink.href = url;

    downloadLink.download =
      "citywallet-smart-report.csv";

    document.body.appendChild(
      downloadLink
    );

    downloadLink.click();
    downloadLink.remove();

    window.URL.revokeObjectURL(url);

    showNotice(
      "Financial report downloaded."
    );
  }

  if (!mounted) {
    return <LoadingPage />;
  }

  return (
    <div className={styles.page}>
      {notice && (
        <div
          className={styles.notice}
          role="status"
        >
          <CheckIcon />

          {notice}
        </div>
      )}

      <section className={styles.hero}>
        <div className={styles.heroGlow} />

        <div className={styles.advisorArea}>
          <div
            className={
              styles.advisorPlatform
            }
          >
            <div
              className={
                styles.advisorAntenna
              }
            >
              <span />
            </div>

            <div
              className={
                styles.advisorHead
              }
            >
              <div
                className={
                  styles.advisorScreen
                }
              >
                <span />
                <span />
              </div>

              <div
                className={
                  styles.advisorSpeaker
                }
              >
                <span />
                <span />
                <span />
              </div>
            </div>

            <div
              className={
                styles.advisorBody
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

            SMART COACH ONLINE
          </div>
        </div>

        <div className={styles.heroContent}>
          <span
            className={
              styles.heroEyebrow
            }
          >
            SMART FINANCIAL HQ
          </span>

          <h1>
            Welcome to the

            <strong>
              Smart Command Center
            </strong>
          </h1>

          <p>
            The smart coach analyzes your
            spending, detects financial
            threats and creates missions
            that improve your city.
          </p>

          <div
            className={
              styles.advisorMessage
            }
          >
            <SparkIcon />

            <div>
              <strong>
                {advisorMessage.title}
              </strong>

              <span>
                {
                  advisorMessage.description
                }
              </span>
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
                styles.refreshButton
              }
              onClick={refreshAnalysis}
              disabled={analyzing}
            >
              <RefreshIcon />

              {analyzing
                ? "Scanning City..."
                : "Refresh Analysis"}
            </button>

            <Link
              href="/city/expenses"
              className={styles.addButton}
            >
              <PlusIcon />

              Add Expense
            </Link>
          </div>
        </div>

        <div className={styles.heroStats}>
          <div className={styles.scoreOrb}>
            <div
              className={
                styles.scoreRing
              }
              style={{
                background: `conic-gradient(
                  #4ade80 0% ${financialScore}%,
                  rgba(255, 255, 255, 0.12) ${financialScore}% 100%
                )`,
              }}
            >
              <div>
                <strong>
                  {financialScore}
                </strong>

                <span>City Score</span>
              </div>
            </div>
          </div>

          <div className={styles.tokenCard}>
            <CoinIcon />

            <div>
              <span>
                Advisor Tokens
              </span>

              <strong>
                {numberFormatter.format(
                  advisorTokens
                )}
              </strong>
            </div>
          </div>

          <div
            className={
              styles.updatedText
            }
          >
            Last scan: {lastUpdated}
          </div>
        </div>
      </section>

      <section className={styles.statGrid}>
        <article className={styles.statCard}>
          <div
            className={`${styles.statIcon} ${styles.healthIcon}`}
          >
            <ShieldIcon />
          </div>

          <div
            className={
              styles.statContent
            }
          >
            <span>City Health</span>

            <strong>
              {cityHealth}%
            </strong>

            <p>
              Overall financial stability
            </p>
          </div>

          <div
            className={
              styles.miniProgress
            }
          >
            <span
              style={{
                width: `${cityHealth}%`,
              }}
            />
          </div>
        </article>

        <article className={styles.statCard}>
          <div
            className={`${styles.statIcon} ${styles.budgetIcon}`}
          >
            <ReceiptIcon />
          </div>

          <div
            className={
              styles.statContent
            }
          >
            <span>Budget Shield</span>

            <strong>
              {budgetUsed}%
            </strong>

            <p>
              {numberFormatter.format(
                safeSpent
              )}{" "}
              /{" "}
              {numberFormatter.format(
                safeBudget
              )}{" "}
              SAR
            </p>
          </div>

          <span
            className={`${styles.riskBadge} ${
              threatLevel === "Critical"
                ? styles.criticalBadge
                : threatLevel === "High"
                  ? styles.highBadge
                  : threatLevel ===
                      "Medium"
                    ? styles.mediumBadge
                    : styles.lowBadge
            }`}
          >
            {threatLevel}
          </span>
        </article>

        <article className={styles.statCard}>
          <div
            className={`${styles.statIcon} ${styles.savingIcon}`}
          >
            <CoinIcon />
          </div>

          <div
            className={
              styles.statContent
            }
          >
            <span>Green Reserve</span>

            <strong>
              {savingsRate}%
            </strong>

            <p>
              {numberFormatter.format(
                savedAmount
              )}{" "}
              SAR saved
            </p>
          </div>

          <div
            className={
              styles.miniProgress
            }
          >
            <span
              style={{
                width: `${Math.min(
                  (savingsRate / 25) *
                    100,
                  100
                )}%`,
              }}
            />
          </div>
        </article>

        <article className={styles.statCard}>
          <div
            className={`${styles.statIcon} ${styles.threatIcon}`}
          >
            <AlertIcon />
          </div>

          <div
            className={
              styles.statContent
            }
          >
            <span>Main Threat</span>

            <strong>
              {highestCategory?.name ??
                "No threat"}
            </strong>

            <p>
              {highestCategory
                ? `${highestCategory.percent}% of total spending`
                : "Add expenses to scan"}
            </p>
          </div>

          <Link
            href="/city/expenses"
            className={
              styles.smallAction
            }
          >
            Review
          </Link>
        </article>
      </section>

      <div className={styles.gameGrid}>
        <section
          className={
            styles.missionPanel
          }
        >
          <div
            className={
              styles.panelHeading
            }
          >
            <div>
              <span
                className={
                  styles.sectionEyebrow
                }
              >
                ACTIVE SMART MISSION
              </span>

              <h2>{mission.title}</h2>

              <p>
                {mission.description}
              </p>
            </div>

            <div
              className={
                styles.missionReward
              }
            >
              <CoinIcon />

              <div>
                <span>Reward</span>

                <strong>
                  +{mission.reward}
                </strong>
              </div>
            </div>
          </div>

          <div
            className={
              styles.missionArena
            }
          >
            <div
              className={
                styles.targetVisual
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
                  styles.targetStatus
                }
              >
                <span>
                  {mission.completed
                    ? "MISSION COMPLETE"
                    : missionActive
                      ? "MISSION ACTIVE"
                      : "MISSION LOCKED"}
                </span>

                <strong>
                  {mission.progress}%
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
                  Mission progress
                </span>

                <strong>
                  {
                    mission.progressText
                  }
                </strong>
              </div>

              <div
                className={
                  styles.missionTrack
                }
              >
                <span
                  style={{
                    width: `${mission.progress}%`,
                  }}
                />
              </div>

              <div
                className={
                  styles.missionSteps
                }
              >
                <div
                  className={
                    missionActive
                      ? styles.stepComplete
                      : ""
                  }
                >
                  <span>
                    {missionActive ? (
                      <CheckIcon />
                    ) : (
                      "1"
                    )}
                  </span>

                  <div>
                    <strong>
                      Activate mission
                    </strong>

                    <p>
                      Save the mission to
                      your command center.
                    </p>
                  </div>
                </div>

                <div
                  className={
                    mission.completed
                      ? styles.stepComplete
                      : ""
                  }
                >
                  <span>
                    {mission.completed ? (
                      <CheckIcon />
                    ) : (
                      "2"
                    )}
                  </span>

                  <div>
                    <strong>
                      Complete objective
                    </strong>

                    <p>
                      Improve your
                      financial behavior
                      to reach the target.
                    </p>
                  </div>
                </div>

                <div
                  className={
                    rewardClaimed
                      ? styles.stepComplete
                      : ""
                  }
                >
                  <span>
                    {rewardClaimed ? (
                      <CheckIcon />
                    ) : (
                      "3"
                    )}
                  </span>

                  <div>
                    <strong>
                      Claim reward
                    </strong>

                    <p>
                      Collect Advisor
                      Tokens after
                      completion.
                    </p>
                  </div>
                </div>
              </div>

              <div
                className={
                  styles.missionActions
                }
              >
                {!missionActive && (
                  <button
                    type="button"
                    className={
                      styles.activateButton
                    }
                    onClick={
                      activateMission
                    }
                  >
                    <TargetIcon />

                    Activate Mission
                  </button>
                )}

                {missionActive &&
                  !mission.completed && (
                    <Link
                      href="/city/expenses"
                      className={
                        styles.activateButton
                      }
                    >
                      <ReceiptIcon />

                      Open Expense Vault
                    </Link>
                  )}

                {missionActive &&
                  mission.completed &&
                  !rewardClaimed && (
                    <button
                      type="button"
                      className={
                        styles.claimButton
                      }
                      onClick={claimReward}
                    >
                      <CoinIcon />

                      Claim{" "}
                      {mission.reward}{" "}
                      Tokens
                    </button>
                  )}

                {rewardClaimed && (
                  <button
                    type="button"
                    className={
                      styles.claimedButton
                    }
                    disabled
                  >
                    <CheckIcon />

                    Reward Claimed
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        <section
          className={
            styles.breakdownPanel
          }
          id="spending-breakdown"
        >
          <div
            className={
              styles.panelHeading
            }
          >
            <div>
              <span
                className={
                  styles.sectionEyebrow
                }
              >
                CITY RESOURCE SCANNER
              </span>

              <h2>
                Spending Breakdown
              </h2>

              <p>
                Financial pressure
                detected in each city
                zone.
              </p>
            </div>

            <button
              type="button"
              className={
                styles.exportButton
              }
              onClick={exportReport}
            >
              <DownloadIcon />

              Export
            </button>
          </div>

          <div
            className={
              styles.breakdownContent
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
                  <span>Total Spent</span>

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
              >
                <span />
              </div>
            </div>

            <div
              className={
                styles.categoryList
              }
            >
              {categoryData.length ===
              0 ? (
                <div
                  className={
                    styles.emptyState
                  }
                >
                  <ReceiptIcon />

                  <strong>
                    Scanner waiting for
                    data
                  </strong>

                  <p>
                    Add an expense to
                    reveal financial
                    pressure zones.
                  </p>

                  <Link href="/city/expenses">
                    Add First Expense
                  </Link>
                </div>
              ) : (
                categoryData.map(
                  (
                    category,
                    index
                  ) => (
                    <article
                      className={
                        styles.categoryItem
                      }
                      key={
                        category.name
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
                        {
                          category.percent
                        }
                        %
                      </strong>

                      <Link
                        href="/city/expenses"
                        className={
                          styles.categoryAction
                        }
                        aria-label={`Review ${category.name} expenses`}
                      >
                        <ArrowIcon />
                      </Link>
                    </article>
                  )
                )
              )}
            </div>
          </div>
        </section>
      </div>

      <section
        className={
          styles.activityPanel
        }
      >
        <div
          className={
            styles.panelHeading
          }
        >
          <div>
            <span
              className={
                styles.sectionEyebrow
              }
            >
              CITY TRANSACTION LOG
            </span>

            <h2>
              Recent Financial Activity
            </h2>

            <p>
              Latest recorded financial
              activity.
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
            <ReceiptIcon />

            <strong>
              No activity detected
            </strong>

            <p>
              Record your first expense
              to start the city
              transaction log.
            </p>

            <Link href="/city/expenses">
              <PlusIcon />

              Add Expense
            </Link>
          </div>
        ) : (
          <div
            className={
              styles.activityList
            }
          >
            {recentExpenses.map(
              (expense, index) => (
                <article
                  className={
                    styles.activityItem
                  }
                  key={expense.id}
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
                      {expense.category}{" "}
                      zone
                    </span>
                  </div>

                  <div
                    className={
                      styles.activityImpact
                    }
                  >
                    <span>
                      City impact
                    </span>

                    <strong>
                      -
                      {safeBudget > 0
                        ? Math.max(
                            1,
                            Math.round(
                              (expense.amount /
                                safeBudget) *
                                100
                            )
                          )
                        : 0}
                      %
                    </strong>
                  </div>

                  <strong
                    className={
                      styles.activityAmount
                    }
                  >
                    {numberFormatter.format(
                      expense.amount
                    )}{" "}
                    SAR
                  </strong>

                  <Link
                    href="/city/expenses"
                    className={
                      styles.activityButton
                    }
                    aria-label={`Review ${expense.name}`}
                  >
                    Review
                  </Link>
                </article>
              )
            )}
          </div>
        )}
      </section>
    </div>
  );
}