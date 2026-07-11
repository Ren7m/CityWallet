"use client";

import {
  useMemo,
  useState,
  type FormEvent,
} from "react";

import { useAuth } from "@/context/AuthContext";
import { useBudget } from "@/context/BudgetContext";
import { useGame } from "@/context/GameContext";

import CityView from "./components/CityView";
import CityFinanceStatus from "./components/CityFinanceStatus";
import Stats from "./components/Stats";

import styles from "./city.module.css";

const CATEGORIES = [
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Entertainment",
  "Health",
  "Education",
  "Rent",
  "Other",
];

type QuestItem = {
  id?: string;

  title?: string;

  description?: string;

  progress?: number;

  completed?: boolean;

  claimed?: boolean;

  rewardXp?: number;

  rewardCoins?: number;
};

export default function CityPage() {
  const { user } = useAuth();

  const {
    monthlySalary,
    budget,
    expenses,
    addExpense,
    totalSpent,
    balance,
    budgetUsage,
  } = useBudget();

  const {
    xp,
    coins,
    streak,
    level,
    levelProgress,
    cityHealth,
    quests,
  } = useGame();

  const [expenseName, setExpenseName] =
    useState("");

  const [
    expenseAmount,
    setExpenseAmount,
  ] = useState("");

  const [
    expenseCategory,
    setExpenseCategory,
  ] = useState("Food");

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const formatter = useMemo(() => {
    return new Intl.NumberFormat(
      "en-US",
      {
        maximumFractionDigits: 2,
      }
    );
  }, []);

  /*
    نتأكد أن quests عبارة عن Array
    ثم نعرّف شكل العناصر داخلها.
  */

  const safeQuests = useMemo<
    QuestItem[]
  >(() => {
    if (!Array.isArray(quests)) {
      return [];
    }

    return quests as QuestItem[];
  }, [quests]);

  /*
    لا نظهر صحة مدينة وهمية
    قبل وجود نشاط مالي حقيقي.
  */

  const hasFinancialData =
    Number(budget) > 0 &&
    expenses.length > 0;

  /*
    آخر 4 مصروفات.
  */

  const recentExpenses = useMemo(() => {
    return [...expenses]
      .reverse()
      .slice(0, 4);
  }, [expenses]);

  /*
    أول مهمة غير مستلمة.
  */

  const activeQuest =
    useMemo<QuestItem | null>(() => {
      if (safeQuests.length === 0) {
        return null;
      }

      return (
        safeQuests.find(
          (quest) =>
            quest.claimed !== true
        ) ?? safeQuests[0]
      );
    }, [safeQuests]);

  /*
    عدد المهمات المكتملة.
  */

  const completedQuests =
    safeQuests.filter(
      (quest) =>
        quest.completed === true
    ).length;

  /*
    نسبة استخدام الميزانية.
  */

  const progressWidth = Math.min(
    Math.max(
      Number(budgetUsage) || 0,
      0
    ),
    100
  );

  /*
    نسبة تقدم المستوى.
  */

  const safeLevelProgress = Math.min(
    Math.max(
      Number(levelProgress) || 0,
      0
    ),
    100
  );

  /*
    بيانات المهمة الحالية.
  */

  const activeQuestProgress = Math.min(
    Math.max(
      Number(activeQuest?.progress) ||
        0,
      0
    ),
    100
  );

  const activeQuestRewardXp =
    Number(activeQuest?.rewardXp) || 0;

  const activeQuestRewardCoins =
    Number(activeQuest?.rewardCoins) || 0;

  /*
    حالة صحة المدينة.
  */

  const healthStatus = useMemo(() => {
    if (!hasFinancialData) {
      return {
        label: "No data yet",

        className:
          styles.healthWarning,
      };
    }

    if (cityHealth >= 80) {
      return {
        label: "Thriving",

        className:
          styles.healthGood,
      };
    }

    if (cityHealth >= 50) {
      return {
        label: "Stable",

        className:
          styles.healthWarning,
      };
    }

    return {
      label: "At Risk",

      className:
        styles.healthDanger,
    };
  }, [
    cityHealth,
    hasFinancialData,
  ]);

  function handleAddExpense(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    setSuccess("");

    const amount = Number(
      expenseAmount
    );

    if (!expenseName.trim()) {
      setError(
        "Please enter the expense name."
      );

      return;
    }

    if (
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      setError(
        "Please enter a valid amount."
      );

      return;
    }

    addExpense({
      name: expenseName.trim(),

      amount,

      category: expenseCategory,

      createdAt:
        new Date().toISOString(),
    });

    setExpenseName("");

    setExpenseAmount("");

    setExpenseCategory("Food");

    setSuccess(
      "Expense added successfully."
    );

    window.setTimeout(() => {
      setSuccess("");
    }, 2200);
  }

  return (
    <div className={styles.page}>
      <div
        className={
          styles.dashboardGrid
        }
      >
        <div
          className={
            styles.mainColumn
          }
        >
          {/* WELCOME */}

          <section
            className={
              styles.welcomeCard
            }
          >
            <div>
              <span
                className={
                  styles.eyebrow
                }
              >
                🏙 MY FINANCIAL CITY
              </span>

              <h1>
                Welcome back,{" "}
                {user?.name
                  ?.trim()
                  .split(/\s+/)[0] ||
                  "Mayor"}
              </h1>

              <p>
                Manage your money,
                complete financial
                missions and watch your
                city respond to every
                decision.
              </p>
            </div>

            {/* PLAYER LEVEL */}

            <div
              className={
                styles.playerBadge
              }
            >
              <div
                className={
                  styles.playerBadgeTop
                }
              >
                <div
                  className={
                    styles.playerLevelIcon
                  }
                >
                  ⭐
                </div>

                <div>
                  <span>
                    PLAYER LEVEL
                  </span>

                  <strong>
                    Level {level}
                  </strong>
                </div>
              </div>

              <div
                className={
                  styles.playerXpRow
                }
              >
                <span>
                  {xp} total XP
                </span>

                <span>
                  {Math.round(
                    safeLevelProgress
                  )}
                  %
                </span>
              </div>

              <div
                className={
                  styles.playerProgress
                }
              >
                <span
                  style={{
                    width: `${safeLevelProgress}%`,
                  }}
                />
              </div>
            </div>
          </section>

          {/* GAME HUD */}

          <section
            className={styles.gameHud}
          >
            {/* LEVEL */}

            <article
              className={`${styles.hudCard} ${styles.levelHud}`}
            >
              <div
                className={styles.hudIcon}
              >
                🏆
              </div>

              <div
                className={
                  styles.hudContent
                }
              >
                <span>LEVEL</span>

                <strong>{level}</strong>

                <small>
                  {xp} total XP
                </small>
              </div>
            </article>

            {/* STREAK */}

            <article
              className={`${styles.hudCard} ${styles.streakHud}`}
            >
              <div
                className={styles.hudIcon}
              >
                🔥
              </div>

              <div
                className={
                  styles.hudContent
                }
              >
                <span>STREAK</span>

                <strong>
                  {streak}

                  <small>
                    {streak === 1
                      ? " day"
                      : " days"}
                  </small>
                </strong>

                <small>
                  Based on real activity
                </small>
              </div>
            </article>

            {/* COINS */}

            <article
              className={`${styles.hudCard} ${styles.coinsHud}`}
            >
              <div
                className={styles.hudIcon}
              >
                🪙
              </div>

              <div
                className={
                  styles.hudContent
                }
              >
                <span>COINS</span>

                <strong>
                  {coins}
                </strong>

                <small>
                  Earned from rewards
                </small>
              </div>
            </article>

            {/* CITY HEALTH */}

            <article
              className={`${styles.hudCard} ${styles.healthHud}`}
            >
              <div
                className={styles.hudIcon}
              >
                💚
              </div>

              <div
                className={
                  styles.hudContent
                }
              >
                <span>
                  CITY HEALTH
                </span>

                <strong>
                  {hasFinancialData
                    ? `${cityHealth}%`
                    : "—"}
                </strong>

                <small
                  className={
                    healthStatus.className
                  }
                >
                  {healthStatus.label}
                </small>
              </div>
            </article>
          </section>

          {/* CITY */}

          <section
            className={
              styles.citySection
            }
          >
            <CityView />
          </section>

          {/* FINANCE STATUS */}

          <CityFinanceStatus />

          {/* ACTIVE MISSION */}

          <section
            className={
              styles.missionCard
            }
          >
            <div
              className={
                styles.missionGlow
              }
            />

            <div
              className={
                styles.missionHeader
              }
            >
              <div
                className={
                  styles.missionHeading
                }
              >
                <div
                  className={
                    styles.missionIcon
                  }
                >
                  ⚔️
                </div>

                <div>
                  <span>
                    ACTIVE MISSION
                  </span>

                  <h2>
                    {activeQuest?.title ||
                      "No active mission"}
                  </h2>
                </div>
              </div>

              <div
                className={
                  styles.missionCounter
                }
              >
                <span>
                  MISSIONS
                </span>

                <strong>
                  {completedQuests}

                  <small>
                    /{safeQuests.length}
                  </small>
                </strong>
              </div>
            </div>

            {activeQuest ? (
              <>
                <p
                  className={
                    styles.missionDescription
                  }
                >
                  {activeQuest.description ||
                    "Complete this mission to improve your financial progress."}
                </p>

                <div
                  className={
                    styles.missionProgressTop
                  }
                >
                  <span>
                    MISSION PROGRESS
                  </span>

                  <strong>
                    {activeQuestProgress}%
                  </strong>
                </div>

                <div
                  className={
                    styles.missionProgress
                  }
                >
                  <span
                    style={{
                      width: `${activeQuestProgress}%`,
                    }}
                  />
                </div>

                <div
                  className={
                    styles.missionBottom
                  }
                >
                  <div
                    className={
                      styles.missionRewards
                    }
                  >
                    <span>
                      REWARDS
                    </span>

                    <div>
                      <strong>
                        ⭐ +
                        {
                          activeQuestRewardXp
                        }{" "}
                        XP
                      </strong>

                      <strong>
                        🪙 +
                        {
                          activeQuestRewardCoins
                        }{" "}
                        Coins
                      </strong>
                    </div>
                  </div>

                  <div
                    className={
                      styles.missionStatus
                    }
                  >
                    {activeQuest.completed
                      ? "✓ Completed"
                      : "Mission in progress"}
                  </div>
                </div>
              </>
            ) : (
              <div
                className={
                  styles.allMissionsComplete
                }
              >
                <div>🏆</div>

                <strong>
                  No active missions
                </strong>

                <p>
                  New missions will appear
                  here when available.
                </p>
              </div>
            )}
          </section>

          {/* STATS */}

          <section
            className={
              styles.statsSection
            }
          >
            <Stats />
          </section>
        </div>

        {/* RIGHT PANEL */}

        <aside
          className={
            styles.rightPanel
          }
        >
          {/* FINANCIAL SUMMARY */}

          <section
            className={
              styles.summaryCard
            }
          >
            <div
              className={
                styles.cardHeading
              }
            >
              <div>
                <span>
                  💰 FINANCIAL SUMMARY
                </span>

                <h2>
                  Monthly overview
                </h2>
              </div>

              <strong
                className={
                  balance >= 0
                    ? styles.balancePositive
                    : styles.balanceNegative
                }
              >
                {formatter.format(
                  balance
                )}{" "}
                SAR
              </strong>
            </div>

            <div
              className={
                styles.progressTrack
              }
            >
              <span
                className={
                  budgetUsage >= 100
                    ? styles.progressDanger
                    : budgetUsage >= 70
                      ? styles.progressWarning
                      : styles.progressSafe
                }
                style={{
                  width: `${progressWidth}%`,
                }}
              />
            </div>

            <div
              className={
                styles.summaryGrid
              }
            >
              <div>
                <span>Salary</span>

                <strong>
                  {formatter.format(
                    monthlySalary
                  )}{" "}
                  SAR
                </strong>
              </div>

              <div>
                <span>Budget</span>

                <strong>
                  {formatter.format(
                    budget
                  )}{" "}
                  SAR
                </strong>
              </div>

              <div>
                <span>Spent</span>

                <strong>
                  {formatter.format(
                    totalSpent
                  )}{" "}
                  SAR
                </strong>
              </div>

              <div>
                <span>
                  Remaining
                </span>

                <strong
                  className={
                    balance >= 0
                      ? styles.positiveText
                      : styles.negativeText
                  }
                >
                  {formatter.format(
                    balance
                  )}{" "}
                  SAR
                </strong>
              </div>
            </div>
          </section>

          {/* ADD EXPENSE */}

          <section
            className={
              styles.expenseCard
            }
          >
            <div
              className={
                styles.cardHeading
              }
            >
              <div>
                <span>
                  ⚔️ NEW TRANSACTION
                </span>

                <h2>
                  Add Expense
                </h2>
              </div>
            </div>

            {error && (
              <div
                className={styles.error}
                role="alert"
              >
                {error}
              </div>
            )}

            {success && (
              <div
                className={
                  styles.success
                }
                role="status"
              >
                {success}
              </div>
            )}

            <form
              className={
                styles.expenseForm
              }
              onSubmit={
                handleAddExpense
              }
            >
              <label>
                <span>
                  Expense name
                </span>

                <input
                  type="text"
                  value={expenseName}
                  onChange={(event) =>
                    setExpenseName(
                      event.target.value
                    )
                  }
                  placeholder="Example: Groceries"
                />
              </label>

              <label>
                <span>
                  Amount
                </span>

                <div
                  className={
                    styles.amountField
                  }
                >
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    value={expenseAmount}
                    onChange={(event) =>
                      setExpenseAmount(
                        event.target.value
                      )
                    }
                    placeholder="0"
                  />

                  <strong>
                    SAR
                  </strong>
                </div>
              </label>

              <label>
                <span>
                  Category
                </span>

                <select
                  value={
                    expenseCategory
                  }
                  onChange={(event) =>
                    setExpenseCategory(
                      event.target.value
                    )
                  }
                >
                  {CATEGORIES.map(
                    (category) => (
                      <option
                        value={category}
                        key={category}
                      >
                        {category}
                      </option>
                    )
                  )}
                </select>
              </label>

              <button type="submit">
                + Add Expense
              </button>
            </form>
          </section>

          {/* RECENT ACTIVITY */}

          <section
            className={
              styles.recentCard
            }
          >
            <div
              className={
                styles.cardHeading
              }
            >
              <div>
                <span>
                  📜 RECENT ACTIVITY
                </span>

                <h2>
                  Latest expenses
                </h2>
              </div>

              <small>
                {expenses.length} total
              </small>
            </div>

            {recentExpenses.length ===
            0 ? (
              <div
                className={
                  styles.emptyState
                }
              >
                <strong>
                  No expenses yet
                </strong>

                <p>
                  Add your first expense
                  to start your financial
                  journey.
                </p>
              </div>
            ) : (
              <div
                className={
                  styles.expenseList
                }
              >
                {recentExpenses.map(
                  (
                    expense,
                    index
                  ) => (
                    <article
                      key={
                        expense.id ??
                        `${expense.name}-${index}`
                      }
                      className={
                        styles.expenseItem
                      }
                    >
                      <div
                        className={
                          styles.expenseInitial
                        }
                      >
                        {expense.name
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div
                        className={
                          styles.expenseInformation
                        }
                      >
                        <strong>
                          {expense.name}
                        </strong>

                        <span>
                          {expense.category}
                        </span>
                      </div>

                      <strong
                        className={
                          styles.expensePrice
                        }
                      >
                        {formatter.format(
                          expense.amount
                        )}{" "}
                        SAR
                      </strong>
                    </article>
                  )
                )}
              </div>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}