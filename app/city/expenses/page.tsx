"use client";

import Link from "next/link";

import {
  useMemo,
  useState,
  type FormEvent,
} from "react";

import { useBudget } from "@/context/BudgetContext";

import styles from "./expenses.module.css";

/* =========================
   TYPES
========================= */

type CategorySummary = {
  name: string;
  amount: number;
  percentage: number;
  transactions: number;
  color: string;
  icon: string;
};

type SortOption =
  | "newest"
  | "oldest"
  | "highest"
  | "lowest";

/* =========================
   CONSTANTS
========================= */

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

const CATEGORY_META: Record<
  string,
  {
    color: string;
    icon: string;
  }
> = {
  Food: {
    color: "#f97316",
    icon: "🍽️",
  },

  Transport: {
    color: "#38bdf8",
    icon: "🚗",
  },

  Shopping: {
    color: "#a855f7",
    icon: "🛍️",
  },

  Bills: {
    color: "#f59e0b",
    icon: "🧾",
  },

  Entertainment: {
    color: "#ec4899",
    icon: "🎮",
  },

  Health: {
    color: "#ef4444",
    icon: "🏥",
  },

  Education: {
    color: "#6366f1",
    icon: "🎓",
  },

  Rent: {
    color: "#14b8a6",
    icon: "🏠",
  },

  Other: {
    color: "#64748b",
    icon: "📦",
  },
};

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

function formatExpenseDate(
  createdAt?: string
) {
  if (!createdAt) {
    return "Date unavailable";
  }

  const date = new Date(createdAt);

  if (
    Number.isNaN(date.getTime())
  ) {
    return "Date unavailable";
  }

  const today = new Date();

  const todayKey =
    today.toDateString();

  const yesterday = new Date(today);

  yesterday.setDate(
    yesterday.getDate() - 1
  );

  if (
    date.toDateString() === todayKey
  ) {
    return "Today";
  }

  if (
    date.toDateString() ===
    yesterday.toDateString()
  ) {
    return "Yesterday";
  }

  return new Intl.DateTimeFormat(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year:
        date.getFullYear() !==
        today.getFullYear()
          ? "numeric"
          : undefined,
    }
  ).format(date);
}

/* =========================
   ICONS
========================= */

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

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        cx="11"
        cy="11"
        r="7"
      />

      <path d="m20 20-4-4" />
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

function WalletIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M4 6h14a2 2 0 0 1 2 2v10H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h12" />

      <path d="M16 11h6v4h-6a2 2 0 0 1 0-4Z" />
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

function FilterIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M4 6h16" />

      <path d="M7 12h10" />

      <path d="M10 18h4" />
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

function ResetIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M4 4v6h6" />

      <path d="M5.5 15a7 7 0 1 0 1.2-8.4L4 10" />
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

/* =========================
   PAGE
========================= */

export default function ExpensesPage() {
  const {
    budget,
    expenses,
    addExpense,
    totalSpent,
    balance,
    budgetUsage,
  } = useBudget();

  /* =========================
     FORM STATE
  ========================= */

  const [
    expenseName,
    setExpenseName,
  ] = useState("");

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

  /* =========================
     FILTER STATE
  ========================= */

  const [search, setSearch] =
    useState("");

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState("All");

  const [sortBy, setSortBy] =
    useState<SortOption>(
      "newest"
    );

  /* =========================
     FORMATTER
  ========================= */

  const numberFormatter = useMemo(() => {
    return new Intl.NumberFormat(
      "en-US",
      {
        maximumFractionDigits: 2,
      }
    );
  }, []);

  /* =========================
     SAFE VALUES
  ========================= */

  const safeExpenses = Array.isArray(
    expenses
  )
    ? expenses
    : [];

  const safeBudget =
    Number(budget) || 0;

  const safeSpent =
    Number(totalSpent) || 0;

  const safeBalance =
    Number(balance) || 0;

  const safeBudgetUsage =
    Number(budgetUsage) || 0;

  const hasExpenses =
    safeExpenses.length > 0;

  const progressWidth = clamp(
    safeBudgetUsage,
    0,
    100
  );

  /* =========================
     BUDGET STATUS
  ========================= */

  const budgetStatus =
    !hasExpenses
      ? {
          label: "No spending yet",
          tone:
            styles.statusWaiting,
          message:
            "Record your first expense to activate spending analysis.",
        }

      : safeBudgetUsage >= 100
        ? {
            label: "Critical",
            tone:
              styles.statusDanger,
            message:
              "Your recorded spending has reached or exceeded your monthly budget.",
          }

        : safeBudgetUsage >= 70
          ? {
              label: "Warning",
              tone:
                styles.statusWarning,
              message:
                "Your budget usage is entering the pressure zone.",
            }

          : {
              label: "Protected",
              tone:
                styles.statusSafe,
              message:
                "Your current recorded spending remains below 70% of your budget.",
            };

  /* =========================
     CATEGORY SUMMARY
  ========================= */

  const categorySummary =
    useMemo<CategorySummary[]>(() => {
      if (
        safeExpenses.length === 0
      ) {
        return [];
      }

      const totals =
        new Map<
          string,
          {
            amount: number;
            transactions: number;
          }
        >();

      safeExpenses.forEach(
        (expense) => {
          const category =
            expense.category ||
            "Other";

          const current =
            totals.get(category) || {
              amount: 0,
              transactions: 0,
            };

          totals.set(category, {
            amount:
              current.amount +
              (Number(
                expense.amount
              ) || 0),

            transactions:
              current.transactions + 1,
          });
        }
      );

      return Array.from(
        totals.entries()
      )
        .map(
          ([
            name,
            categoryData,
          ]) => ({
            name,

            amount:
              categoryData.amount,

            transactions:
              categoryData.transactions,

            percentage:
              safeSpent > 0
                ? clamp(
                    Math.round(
                      (categoryData.amount /
                        safeSpent) *
                        100
                    ),
                    0,
                    100
                  )
                : 0,

            color:
              CATEGORY_META[name]
                ?.color ||
              CATEGORY_META.Other.color,

            icon:
              CATEGORY_META[name]
                ?.icon ||
              CATEGORY_META.Other.icon,
          })
        )
        .sort(
          (first, second) =>
            second.amount -
            first.amount
        );
    }, [
      safeExpenses,
      safeSpent,
    ]);

  const topCategory =
    categorySummary[0] ?? null;

  /* =========================
     FILTERED EXPENSES
  ========================= */

  const filteredExpenses =
    useMemo(() => {
      const normalizedSearch =
        search
          .trim()
          .toLowerCase();

      const filtered =
        safeExpenses.filter(
          (expense) => {
            const matchesSearch =
              !normalizedSearch ||
              expense.name
                .toLowerCase()
                .includes(
                  normalizedSearch
                ) ||
              expense.category
                .toLowerCase()
                .includes(
                  normalizedSearch
                );

            const matchesCategory =
              selectedCategory ===
                "All" ||
              expense.category ===
                selectedCategory;

            return (
              matchesSearch &&
              matchesCategory
            );
          }
        );

      return [...filtered].sort(
        (first, second) => {
          const firstAmount =
            Number(
              first.amount
            ) || 0;

          const secondAmount =
            Number(
              second.amount
            ) || 0;

          const firstDate =
            first.createdAt
              ? new Date(
                  first.createdAt
                ).getTime()
              : 0;

          const secondDate =
            second.createdAt
              ? new Date(
                  second.createdAt
                ).getTime()
              : 0;

          if (
            sortBy === "highest"
          ) {
            return (
              secondAmount -
              firstAmount
            );
          }

          if (
            sortBy === "lowest"
          ) {
            return (
              firstAmount -
              secondAmount
            );
          }

          if (
            sortBy === "oldest"
          ) {
            return (
              firstDate -
              secondDate
            );
          }

          return (
            secondDate -
            firstDate
          );
        }
      );
    }, [
      safeExpenses,
      search,
      selectedCategory,
      sortBy,
    ]);

  /* =========================
     ADD EXPENSE
  ========================= */

  function handleAddExpense(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const name =
      expenseName.trim();

    const amount = Number(
      expenseAmount
    );

    if (!name) {
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
        "Please enter a valid amount greater than zero."
      );

      return;
    }

    if (
      !CATEGORIES.includes(
        expenseCategory
      )
    ) {
      setError(
        "Please select a valid category."
      );

      return;
    }

    addExpense({
      name,
      amount,
      category:
        expenseCategory,
      createdAt:
        new Date().toISOString(),
    });

    setExpenseName("");
    setExpenseAmount("");
    setExpenseCategory("Food");

    setSuccess(
      `${name} was added successfully.`
    );

    window.setTimeout(() => {
      setSuccess("");
    }, 2600);
  }

  /* =========================
     RESET FORM
  ========================= */

  function resetForm() {
    setExpenseName("");
    setExpenseAmount("");
    setExpenseCategory("Food");
    setError("");
    setSuccess("");
  }

  /* =========================
     RESET FILTERS
  ========================= */

  function resetFilters() {
    setSearch("");
    setSelectedCategory("All");
    setSortBy("newest");
  }

  /* =========================
     EXPORT CSV
  ========================= */

  function exportExpenses() {
    if (!hasExpenses) {
      return;
    }

    const summaryRows = [
      [
        "CityWallet Expense Management Report",
      ],

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
        "Total Transactions",
        safeExpenses.length,
      ],

      [],

      [
        "Expense Name",
        "Category",
        "Amount",
        "Created At",
      ],
    ];

    const expenseRows =
      safeExpenses.map(
        (expense) => [
          expense.name,

          expense.category,

          Number(
            expense.amount
          ) || 0,

          expense.createdAt || "",
        ]
      );

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
      "citywallet-expenses.csv";

    document.body.appendChild(
      downloadLink
    );

    downloadLink.click();

    downloadLink.remove();

    window.URL.revokeObjectURL(
      url
    );
  }

  return (
    <main className={styles.page}>
      {/* =====================
          HERO
      ===================== */}

      <section className={styles.hero}>
        <div
          className={
            styles.heroPattern
          }
        />

        <div
          className={styles.heroGlow}
        />

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
            ⚔ CITYWALLET EXPENSE COMMAND CENTER
          </span>

          <h1>
            Control every expense.
            <strong>
              Protect your financial city.
            </strong>
          </h1>

          <p>
            Track real transactions,
            monitor spending pressure and
            understand exactly where your
            monthly budget is going.
          </p>

          <div
            className={
              styles.heroActions
            }
          >
            <a
              href="#add-expense"
              className={
                styles.primaryButton
              }
            >
              <PlusIcon />

              Add New Expense

              <ArrowIcon />
            </a>

            <Link
              href="/city/insights"
              className={
                styles.aiButton
              }
            >
              <SparkIcon />

              Analyze with FinBot

              <ArrowIcon />
            </Link>

            <button
              type="button"
              className={
                styles.exportButton
              }
              onClick={
                exportExpenses
              }
              disabled={!hasExpenses}
              title={
                hasExpenses
                  ? "Download your real expense data"
                  : "Add an expense before exporting"
              }
            >
              <DownloadIcon />

              Export Expenses
            </button>
          </div>
        </div>

        <div
          className={
            styles.heroBudget
          }
        >
          <div
            className={
              styles.budgetRing
            }
            style={{
              background:
                hasExpenses
                  ? `conic-gradient(
                      #a78bfa 0% ${progressWidth}%,
                      rgba(255, 255, 255, 0.1)
                      ${progressWidth}% 100%
                    )`
                  : `conic-gradient(
                      rgba(255, 255, 255, 0.1)
                      0% 100%
                    )`,
            }}
          >
            <div>
              <span>
                BUDGET USAGE
              </span>

              <strong>
                {hasExpenses
                  ? `${Math.round(
                      safeBudgetUsage
                    )}%`
                  : "—"}
              </strong>

              <small>
                {hasExpenses
                  ? `${numberFormatter.format(
                      safeSpent
                    )} SAR spent`
                  : "No activity yet"}
              </small>
            </div>
          </div>

          <div
            className={`${styles.statusBadge} ${budgetStatus.tone}`}
          >
            <span />

            {budgetStatus.label}
          </div>
        </div>
      </section>

      {/* =====================
          SUMMARY CARDS
      ===================== */}

      <section
        className={styles.summaryGrid}
      >
        <article
          className={`${styles.summaryCard} ${styles.spentCard}`}
        >
          <div
            className={
              styles.summaryIcon
            }
          >
            <WalletIcon />
          </div>

          <div>
            <span>
              TOTAL SPENT
            </span>

            <strong>
              {numberFormatter.format(
                safeSpent
              )}{" "}
              <small>SAR</small>
            </strong>

            <p>
              From{" "}
              {safeExpenses.length}{" "}
              recorded{" "}
              {safeExpenses.length === 1
                ? "transaction"
                : "transactions"}
            </p>
          </div>
        </article>

        <article
          className={`${styles.summaryCard} ${styles.remainingCard}`}
        >
          <div
            className={
              styles.summaryIcon
            }
          >
            <ShieldIcon />
          </div>

          <div>
            <span>
              REMAINING BUDGET
            </span>

            <strong
              className={
                safeBalance < 0
                  ? styles.negativeValue
                  : ""
              }
            >
              {numberFormatter.format(
                safeBalance
              )}{" "}
              <small>SAR</small>
            </strong>

            <p>
              {safeBalance >= 0
                ? "Available from your real monthly budget"
                : "Recorded spending exceeds your budget"}
            </p>
          </div>
        </article>

        <article
          className={`${styles.summaryCard} ${styles.usageCard}`}
        >
          <div
            className={
              styles.summaryIcon
            }
          >
            <ChartIcon />
          </div>

          <div>
            <span>
              BUDGET USAGE
            </span>

            <strong>
              {hasExpenses
                ? `${Math.round(
                    safeBudgetUsage
                  )}%`
                : "—"}
            </strong>

            <p>
              {budgetStatus.message}
            </p>
          </div>
        </article>

        <article
          className={`${styles.summaryCard} ${styles.topCategoryCard}`}
        >
          <div
            className={
              styles.summaryIcon
            }
          >
            <ReceiptIcon />
          </div>

          <div>
            <span>
              TOP SPENDING ZONE
            </span>

            <strong>
              {topCategory
                ? topCategory.name
                : "—"}
            </strong>

            <p>
              {topCategory
                ? `${numberFormatter.format(
                    topCategory.amount
                  )} SAR · ${topCategory.percentage}% of recorded spending`
                : "Available after your first expense"}
            </p>
          </div>
        </article>
      </section>

      {/* =====================
          MAIN MANAGEMENT GRID
      ===================== */}

      <div
        className={styles.managementGrid}
      >
        {/* ADD EXPENSE */}

        <section
          className={
            styles.addExpensePanel
          }
          id="add-expense"
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
                ⚡ NEW TRANSACTION
              </span>

              <h2>
                Add Expense
              </h2>

              <p>
                Record a real transaction
                and update your city
                finances instantly.
              </p>
            </div>

            <div
              className={
                styles.formStatus
              }
            >
              <span>
                LIVE UPDATE
              </span>

              <strong>
                Budget connected
              </strong>
            </div>
          </div>

          {error && (
            <div
              className={styles.error}
              role="alert"
            >
              ⚠ {error}
            </div>
          )}

          {success && (
            <div
              className={
                styles.success
              }
              role="status"
            >
              ✓ {success}
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
            <label
              className={
                styles.fullField
              }
            >
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
                maxLength={100}
              />
            </label>

            <label>
              <span>Amount</span>

              <div
                className={
                  styles.amountField
                }
              >
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={
                    expenseAmount
                  }
                  onChange={(event) =>
                    setExpenseAmount(
                      event.target.value
                    )
                  }
                  placeholder="0.00"
                />

                <strong>
                  SAR
                </strong>
              </div>
            </label>

            <label>
              <span>Category</span>

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
                      key={category}
                      value={category}
                    >
                      {category}
                    </option>
                  )
                )}
              </select>
            </label>

            <div
              className={
                styles.selectedCategory
              }
            >
              <div
                className={
                  styles.selectedCategoryIcon
                }
                style={{
                  background:
                    CATEGORY_META[
                      expenseCategory
                    ]?.color ||
                    CATEGORY_META.Other
                      .color,
                }}
              >
                {CATEGORY_META[
                  expenseCategory
                ]?.icon ||
                  CATEGORY_META.Other
                    .icon}
              </div>

              <div>
                <span>
                  SELECTED ZONE
                </span>

                <strong>
                  {expenseCategory}
                </strong>
              </div>
            </div>

            <div
              className={
                styles.formActions
              }
            >
              <button
                type="submit"
                className={
                  styles.submitButton
                }
              >
                <PlusIcon />

                Add Expense

                <ArrowIcon />
              </button>

              <button
                type="button"
                className={
                  styles.resetButton
                }
                onClick={resetForm}
              >
                <ResetIcon />

                Clear Form
              </button>
            </div>
          </form>
        </section>

        {/* CATEGORY PRESSURE */}

        <section
          className={
            styles.categoryPanel
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
                ◉ SPENDING ZONES
              </span>

              <h2>
                Category Pressure
              </h2>

              <p>
                Based only on your actual
                recorded expenses.
              </p>
            </div>
          </div>

          {categorySummary.length ===
          0 ? (
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
                No spending zones yet
              </strong>

              <p>
                Add your first expense to
                activate category analysis.
              </p>

              <a
                href="#add-expense"
                className={
                  styles.emptyAction
                }
              >
                <PlusIcon />

                Add First Expense

                <ArrowIcon />
              </a>
            </div>
          ) : (
            <div
              className={
                styles.categoryList
              }
            >
              {categorySummary.map(
                (
                  category,
                  index
                ) => (
                  <button
                    type="button"
                    key={
                      category.name
                    }
                    className={`${styles.categoryItem} ${
                      selectedCategory ===
                      category.name
                        ? styles.categoryItemActive
                        : ""
                    }`}
                    onClick={() =>
                      setSelectedCategory(
                        selectedCategory ===
                          category.name
                          ? "All"
                          : category.name
                      )
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
                      {category.icon}
                    </div>

                    <div
                      className={
                        styles.categoryInformation
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
                            width: `${category.percentage}%`,

                            background:
                              category.color,
                          }}
                        />
                      </div>

                      <small>
                        {
                          category.transactions
                        }{" "}
                        {category.transactions ===
                        1
                          ? "transaction"
                          : "transactions"}
                      </small>
                    </div>

                    <strong
                      className={
                        styles.categoryPercentage
                      }
                    >
                      {
                        category.percentage
                      }
                      %
                    </strong>
                  </button>
                )
              )}
            </div>
          )}
        </section>
      </div>

      {/* =====================
          BUDGET PRESSURE
      ===================== */}

      <section
        className={
          styles.budgetPanel
        }
      >
        <div
          className={
            styles.budgetPanelTop
          }
        >
          <div>
            <span
              className={
                styles.sectionEyebrow
              }
            >
              🛡 BUDGET SHIELD STATUS
            </span>

            <h2>
              Monthly Budget Pressure
            </h2>

            <p>
              {budgetStatus.message}
            </p>
          </div>

          <div
            className={`${styles.largeStatusBadge} ${budgetStatus.tone}`}
          >
            <span />

            {budgetStatus.label}
          </div>
        </div>

        <div
          className={
            styles.budgetProgressHeader
          }
        >
          <span>
            {numberFormatter.format(
              safeSpent
            )}{" "}
            SAR spent
          </span>

          <strong>
            {numberFormatter.format(
              safeBudget
            )}{" "}
            SAR budget
          </strong>
        </div>

        <div
          className={
            styles.budgetTrack
          }
        >
          <span
            className={
              safeBudgetUsage >= 100
                ? styles.budgetDanger
                : safeBudgetUsage >= 70
                  ? styles.budgetWarning
                  : styles.budgetSafe
            }
            style={{
              width: `${progressWidth}%`,
            }}
          />
        </div>

        <div
          className={
            styles.budgetMarkers
          }
        >
          <span>0%</span>
          <span>70%</span>
          <span>100%</span>
        </div>
      </section>

      {/* =====================
          TRANSACTIONS
      ===================== */}

      <section
        className={
          styles.transactionsPanel
        }
      >
        <div
          className={
            styles.transactionsHeader
          }
        >
          <div>
            <span
              className={
                styles.sectionEyebrow
              }
            >
              📜 CITY TRANSACTION VAULT
            </span>

            <h2>
              Expense History
            </h2>

            <p>
              Search, filter and review your
              real recorded transactions.
            </p>
          </div>

          <div
            className={
              styles.transactionCount
            }
          >
            <span>
              SHOWING
            </span>

            <strong>
              {filteredExpenses.length}

              <small>
                /{safeExpenses.length}
              </small>
            </strong>
          </div>
        </div>

        {/* FILTERS */}

        <div
          className={
            styles.filterBar
          }
        >
          <label
            className={
              styles.searchField
            }
          >
            <SearchIcon />

            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search expense or category..."
            />
          </label>

          <label
            className={
              styles.selectField
            }
          >
            <FilterIcon />

            <select
              value={
                selectedCategory
              }
              onChange={(event) =>
                setSelectedCategory(
                  event.target.value
                )
              }
            >
              <option value="All">
                All Categories
              </option>

              {CATEGORIES.map(
                (category) => (
                  <option
                    key={category}
                    value={category}
                  >
                    {category}
                  </option>
                )
              )}
            </select>
          </label>

          <label
            className={
              styles.selectField
            }
          >
            <ChartIcon />

            <select
              value={sortBy}
              onChange={(event) =>
                setSortBy(
                  event.target
                    .value as SortOption
                )
              }
            >
              <option value="newest">
                Newest first
              </option>

              <option value="oldest">
                Oldest first
              </option>

              <option value="highest">
                Highest amount
              </option>

              <option value="lowest">
                Lowest amount
              </option>
            </select>
          </label>

          <button
            type="button"
            className={
              styles.clearFiltersButton
            }
            onClick={resetFilters}
            disabled={
              !search &&
              selectedCategory ===
                "All" &&
              sortBy === "newest"
            }
          >
            <ResetIcon />

            Reset Filters
          </button>
        </div>

        {/* CATEGORY CHIPS */}

        <div
          className={
            styles.categoryChips
          }
        >
          <button
            type="button"
            className={
              selectedCategory === "All"
                ? styles.activeChip
                : ""
            }
            onClick={() =>
              setSelectedCategory(
                "All"
              )
            }
          >
            All

            <span>
              {safeExpenses.length}
            </span>
          </button>

          {categorySummary.map(
            (category) => (
              <button
                type="button"
                key={category.name}
                className={
                  selectedCategory ===
                  category.name
                    ? styles.activeChip
                    : ""
                }
                onClick={() =>
                  setSelectedCategory(
                    category.name
                  )
                }
              >
                {category.icon}

                {category.name}

                <span>
                  {
                    category.transactions
                  }
                </span>
              </button>
            )
          )}
        </div>

        {/* TRANSACTION LIST */}

        {safeExpenses.length === 0 ? (
          <div
            className={
              styles.largeEmptyState
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
              Your transaction vault is empty
            </strong>

            <p>
              Add your first real expense
              to begin tracking your
              financial city.
            </p>

            <a
              href="#add-expense"
              className={
                styles.emptyAction
              }
            >
              <PlusIcon />

              Add First Expense

              <ArrowIcon />
            </a>
          </div>
        ) : filteredExpenses.length ===
          0 ? (
          <div
            className={
              styles.largeEmptyState
            }
          >
            <div
              className={
                styles.emptyIcon
              }
            >
              <SearchIcon />
            </div>

            <strong>
              No matching expenses
            </strong>

            <p>
              No real transactions match
              your current search and
              filters.
            </p>

            <button
              type="button"
              className={
                styles.emptyAction
              }
              onClick={resetFilters}
            >
              <ResetIcon />

              Reset Filters
            </button>
          </div>
        ) : (
          <div
            className={
              styles.transactionList
            }
          >
            {filteredExpenses.map(
              (
                expense,
                index
              ) => {
                const category =
                  expense.category ||
                  "Other";

                const categoryMeta =
                  CATEGORY_META[
                    category
                  ] ||
                  CATEGORY_META.Other;

                const amount =
                  Number(
                    expense.amount
                  ) || 0;

                const budgetImpact =
                  safeBudget > 0
                    ? (
                        (amount /
                          safeBudget) *
                        100
                      ).toFixed(1)
                    : "0.0";

                return (
                  <article
                    className={
                      styles.transactionItem
                    }
                    key={
                      expense.id ??
                      `${expense.name}-${expense.createdAt}-${index}`
                    }
                  >
                    <div
                      className={
                        styles.transactionIndex
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
                        styles.transactionIcon
                      }
                      style={{
                        background:
                          `${categoryMeta.color}18`,

                        color:
                          categoryMeta.color,
                      }}
                    >
                      {
                        categoryMeta.icon
                      }
                    </div>

                    <div
                      className={
                        styles.transactionInfo
                      }
                    >
                      <strong>
                        {expense.name}
                      </strong>

                      <span>
                        {category}
                      </span>
                    </div>

                    <div
                      className={
                        styles.transactionDate
                      }
                    >
                      <span>
                        RECORDED
                      </span>

                      <strong>
                        {formatExpenseDate(
                          expense.createdAt
                        )}
                      </strong>
                    </div>

                    <div
                      className={
                        styles.transactionImpact
                      }
                    >
                      <span>
                        BUDGET IMPACT
                      </span>

                      <strong>
                        {budgetImpact}%
                      </strong>
                    </div>

                    <strong
                      className={
                        styles.transactionAmount
                      }
                    >
                      -
                      {numberFormatter.format(
                        amount
                      )}{" "}
                      SAR
                    </strong>
                  </article>
                );
              }
            )}
          </div>
        )}
      </section>

      {/* =====================
          AI CTA
      ===================== */}

      <section
        className={styles.aiPanel}
      >
        <div
          className={
            styles.aiPanelIcon
          }
        >
          <SparkIcon />
        </div>

        <div
          className={
            styles.aiPanelContent
          }
        >
          <span>
            GEMINI AI CONNECTED
          </span>

          <h2>
            Ready for deeper financial analysis?
          </h2>

          <p>
            FinBot can analyze your real
            expenses, categories, budget
            usage and financial indicators
            through your connected Gemini
            AI system.
          </p>
        </div>

        <Link
          href="/city/insights"
          className={
            styles.aiPanelButton
          }
        >
          <SparkIcon />

          Open AI Insights

          <ArrowIcon />
        </Link>
      </section>
    </main>
  );
}