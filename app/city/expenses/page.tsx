"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";

import { useBudget } from "@/context/BudgetContext";

import styles from "./expenses.module.css";

type CategoryConfig = {
  name: string;
  icon: string;
  color: string;
  building: string;
};

const CATEGORIES: CategoryConfig[] = [
  {
    name: "Food",
    icon: "🍔",
    color: "#f97316",
    building: "Restaurant District",
  },
  {
    name: "Transport",
    icon: "🚕",
    color: "#38bdf8",
    building: "Transport Station",
  },
  {
    name: "Shopping",
    icon: "🛍️",
    color: "#8b5cf6",
    building: "Shopping Mall",
  },
  {
    name: "Bills",
    icon: "💡",
    color: "#eab308",
    building: "Utility Center",
  },
  {
    name: "Entertainment",
    icon: "🎮",
    color: "#ec4899",
    building: "Entertainment Zone",
  },
  {
    name: "Health",
    icon: "🏥",
    color: "#ef4444",
    building: "City Hospital",
  },
  {
    name: "Education",
    icon: "🎓",
    color: "#14b8a6",
    building: "Education Center",
  },
  {
    name: "Rent",
    icon: "🏠",
    color: "#64748b",
    building: "Residential District",
  },
  {
    name: "Other",
    icon: "📦",
    color: "#0f766e",
    building: "General District",
  },
];

const STORAGE_KEYS = {
  xp: "fincity-player-xp",
  coins: "fincity-city-coins",
};

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function WalletIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 6h14a2 2 0 0 1 2 2v11H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h12" />
      <path d="M15 11h7v5h-7a2.5 2.5 0 0 1 0-5Z" />
      <circle cx="16.5" cy="13.5" r=".7" />
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

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 7h16" />
      <path d="M9 7V4h6v3" />
      <path d="m7 7 1 13h8l1-13" />
      <path d="M10 11v5M14 11v5" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
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

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14" />
      <path d="m14 7 5 5-5 5" />
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

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3 20 6v6c0 5-3.4 8-8 9-4.6-1-8-4-8-9V6l8-3Z" />
      <path d="m8.5 12 2.2 2.2 4.8-5" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 20V11M10 20V5M16 20v-8M22 20V7M2 20h22" />
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

function LoadingPage() {
  return (
    <div className={styles.loadingPage}>
      <div className={styles.loadingHero}></div>

      <div className={styles.loadingStats}>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div className={styles.loadingMain}>
        <span></span>
        <span></span>
      </div>
    </div>
  );
}

export default function ExpensesPage() {
  const {
    budget,
    expenses,
    totalSpent,
    balance,
    addExpense,
    removeExpense,
  } = useBudget();

  const [mounted, setMounted] = useState(false);

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");

  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] =
    useState("All");

  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [playerXp, setPlayerXp] = useState(3000);
  const [cityCoins, setCityCoins] = useState(120);

  useEffect(() => {
    const storedXp = window.localStorage.getItem(
      STORAGE_KEYS.xp
    );

    const storedCoins = window.localStorage.getItem(
      STORAGE_KEYS.coins
    );

    setPlayerXp(Number(storedXp ?? 3000) || 3000);
    setCityCoins(Number(storedCoins ?? 120) || 120);

    setMounted(true);
  }, []);

  const safeBudget = mounted ? Number(budget || 0) : 0;
  const safeSpent = mounted
    ? Number(totalSpent || 0)
    : 0;
  const safeBalance = mounted
    ? Number(balance || 0)
    : 0;
  const safeExpenses = mounted ? expenses ?? [] : [];

  const numberFormatter = useMemo(() => {
    return new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 2,
    });
  }, []);

  const budgetUsage =
    safeBudget > 0
      ? Math.round((safeSpent / safeBudget) * 100)
      : 0;

  const playerLevel =
    Math.floor(playerXp / 500) + 1;

  const currentLevelXp = playerXp % 500;

  const levelProgress = Math.round(
    (currentLevelXp / 500) * 100
  );

  const selectedCategory =
    CATEGORIES.find((item) => item.name === category) ??
    CATEGORIES[0];

  const amountNumber = Number(amount) || 0;

  const expenseImpact =
    safeBudget > 0
      ? Math.max(
          0,
          Math.round(
            (amountNumber / safeBudget) * 100
          )
        )
      : 0;

  const balanceAfterExpense =
    safeBalance - amountNumber;

  const categoryTotals = useMemo(() => {
    return safeExpenses.reduce<Record<string, number>>(
      (result, expense) => {
        const expenseCategory =
          expense.category || "Other";

        result[expenseCategory] =
          (result[expenseCategory] ?? 0) +
          Number(expense.amount || 0);

        return result;
      },
      {}
    );
  }, [safeExpenses]);

  const categoryZones = useMemo(() => {
    return CATEGORIES.map((item) => {
      const spent = categoryTotals[item.name] ?? 0;

      const percent =
        safeSpent > 0
          ? Math.round((spent / safeSpent) * 100)
          : 0;

      return {
        ...item,
        spent,
        percent,
      };
    })
      .filter((item) => item.spent > 0)
      .sort((first, second) => second.spent - first.spent)
      .slice(0, 4);
  }, [categoryTotals, safeSpent]);

  const filteredExpenses = useMemo(() => {
    const normalizedSearch = search
      .trim()
      .toLowerCase();

    return [...safeExpenses]
      .reverse()
      .filter((expense) => {
        const matchesSearch =
          !normalizedSearch ||
          expense.name
            .toLowerCase()
            .includes(normalizedSearch) ||
          expense.category
            .toLowerCase()
            .includes(normalizedSearch);

        const matchesCategory =
          filterCategory === "All" ||
          expense.category === filterCategory;

        return matchesSearch && matchesCategory;
      });
  }, [safeExpenses, search, filterCategory]);

  const cityStatus =
    budgetUsage >= 100
      ? "Critical"
      : budgetUsage >= 70
        ? "Warning"
        : "Protected";

  function showNotice(message: string) {
    setNotice(message);

    window.setTimeout(() => {
      setNotice("");
    }, 2400);
  }

  function clearForm() {
    setName("");
    setAmount("");
    setCategory("Food");
    setError("");
  }

  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const expenseName = name.trim();
    const expenseAmount = Number(amount);

    if (!expenseName) {
      setError("Enter an expense name.");
      return;
    }

    if (
      !Number.isFinite(expenseAmount) ||
      expenseAmount <= 0
    ) {
      setError(
        "Enter a valid amount greater than zero."
      );
      return;
    }

    addExpense({
      name: expenseName,
      amount: expenseAmount,
      category,
    });

    const earnedXp = 10;
    const earnedCoins = 3;

    const newXp = playerXp + earnedXp;
    const newCoins = cityCoins + earnedCoins;

    setPlayerXp(newXp);
    setCityCoins(newCoins);

    window.localStorage.setItem(
      STORAGE_KEYS.xp,
      String(newXp)
    );

    window.localStorage.setItem(
      STORAGE_KEYS.coins,
      String(newCoins)
    );

    clearForm();

    showNotice(
      `Expense recorded • +${earnedXp} XP • +${earnedCoins} City Coins`
    );
  }

  function handleDelete(
    id: number,
    expenseName: string
  ) {
    removeExpense(id);

    showNotice(`${expenseName} was removed.`);
  }

  function clearFilters() {
    setSearch("");
    setFilterCategory("All");
  }

  function exportExpenses() {
    if (safeExpenses.length === 0) {
      return;
    }

    const header = [
      "Expense",
      "Category",
      "Amount",
    ];

    const rows = safeExpenses.map((expense) => [
      expense.name,
      expense.category,
      expense.amount,
    ]);

    const csv = [header, ...rows]
      .map((row) =>
        row
          .map(
            (value) =>
              `"${String(value).replace(
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
      "fincity-expenses.csv";

    document.body.appendChild(downloadLink);
    downloadLink.click();
    downloadLink.remove();

    window.URL.revokeObjectURL(url);

    showNotice("Expense report downloaded.");
  }

  if (!mounted) {
    return <LoadingPage />;
  }

  return (
    <div className={styles.page}>
      {notice && (
        <div className={styles.notice} role="status">
          <CheckIcon />
          {notice}
        </div>
      )}

      <section className={styles.hero}>
        <div className={styles.heroGlow}></div>

        <div className={styles.vaultArea}>
          <div className={styles.vaultBuilding}>
            <div className={styles.vaultRoof}>
              <span></span>
              <span></span>
              <span></span>
            </div>

            <div className={styles.vaultSign}>
              CITY VAULT
            </div>

            <div className={styles.vaultBody}>
              <div className={styles.vaultDoor}>
                <div className={styles.vaultWheel}>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>

              <div className={styles.vaultWindow}>
                <CoinIcon />
              </div>
            </div>

            <div className={styles.vaultBase}></div>
          </div>

          <div className={styles.vaultStatus}>
            <span></span>
            VAULT ONLINE
          </div>
        </div>

        <div className={styles.heroContent}>
          <span className={styles.heroEyebrow}>
            CITY TREASURY
          </span>

          <h1>
            Expense
            <strong> Management Vault</strong>
          </h1>

          <p>
            Record every transaction, protect your budget
            shield and watch each expense affect the
            buildings in your financial city.
          </p>

          <div className={styles.cityAlert}>
            <ShieldIcon />

            <div>
              <strong>
                City protection status: {cityStatus}
              </strong>

              <span>
                {budgetUsage < 70
                  ? "Your city is protected. Continue tracking expenses to maintain stability."
                  : budgetUsage < 100
                    ? "The budget shield is weakening. Review optional expenses."
                    : "The city budget shield is down. Reduce spending immediately."}
              </span>
            </div>
          </div>

          <div className={styles.heroActions}>
            <a
              href="#expense-form"
              className={styles.primaryAction}
            >
              <PlusIcon />
              Record Expense
            </a>

            <Link
              href="/city/insights"
              className={styles.secondaryAction}
            >
              <ChartIcon />
              Open AI Advisor
            </Link>

            <Link
              href="/city"
              className={styles.secondaryAction}
            >
              Return to City
              <ArrowIcon />
            </Link>
          </div>
        </div>

        <div className={styles.playerPanel}>
          <div className={styles.levelOrb}>
            <span>LEVEL</span>
            <strong>{playerLevel}</strong>
          </div>

          <div className={styles.levelInformation}>
            <div>
              <span>Builder XP</span>
              <strong>
                {numberFormatter.format(playerXp)}
              </strong>
            </div>

            <div className={styles.levelTrack}>
              <span
                style={{
                  width: `${levelProgress}%`,
                }}
              ></span>
            </div>

            <small>
              {currentLevelXp} / 500 XP to next level
            </small>
          </div>

          <div className={styles.coinBalance}>
            <CoinIcon />

            <div>
              <span>City Coins</span>
              <strong>{cityCoins}</strong>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.statGrid}>
        <article className={styles.statCard}>
          <div
            className={`${styles.statIcon} ${styles.budgetIcon}`}
          >
            <WalletIcon />
          </div>

          <div>
            <span>Monthly Budget</span>

            <strong>
              {numberFormatter.format(safeBudget)} SAR
            </strong>

            <p>Active city budget</p>
          </div>
        </article>

        <article className={styles.statCard}>
          <div
            className={`${styles.statIcon} ${styles.spentIcon}`}
          >
            <ReceiptIcon />
          </div>

          <div>
            <span>Total Spent</span>

            <strong>
              {numberFormatter.format(safeSpent)} SAR
            </strong>

            <p>{budgetUsage}% of budget used</p>
          </div>
        </article>

        <article className={styles.statCard}>
          <div
            className={`${styles.statIcon} ${styles.balanceIcon}`}
          >
            <ShieldIcon />
          </div>

          <div>
            <span>Available Balance</span>

            <strong
              className={
                safeBalance >= 0
                  ? styles.positive
                  : styles.negative
              }
            >
              {numberFormatter.format(safeBalance)} SAR
            </strong>

            <p>
              {safeBalance >= 0
                ? "Protected funds"
                : "Budget exceeded"}
            </p>
          </div>
        </article>

        <article className={styles.statCard}>
          <div
            className={`${styles.statIcon} ${styles.transactionIcon}`}
          >
            <ChartIcon />
          </div>

          <div>
            <span>Transactions</span>

            <strong>{safeExpenses.length}</strong>

            <p>Recorded this month</p>
          </div>
        </article>
      </section>

      <div className={styles.mainGrid}>
        <section
          className={styles.formPanel}
          id="expense-form"
        >
          <div className={styles.panelHeader}>
            <div>
              <span className={styles.panelEyebrow}>
                NEW CITY TRANSACTION
              </span>

              <h2>Record an Expense</h2>

              <p>
                Select the affected city zone and enter the
                transaction details.
              </p>
            </div>

            <div className={styles.formReward}>
              <CoinIcon />

              <div>
                <span>Logging reward</span>
                <strong>+10 XP · +3 Coins</strong>
              </div>
            </div>
          </div>

          {error && (
            <div className={styles.errorMessage}>
              {error}
            </div>
          )}

          <form
            className={styles.form}
            onSubmit={handleSubmit}
          >
            <label className={styles.field}>
              <span>Expense name</span>

              <input
                type="text"
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  setError("");
                }}
                placeholder="Example: Lunch, fuel or electricity"
                maxLength={60}
              />
            </label>

            <label className={styles.field}>
              <span>Amount</span>

              <div className={styles.amountField}>
                <input
                  type="number"
                  value={amount}
                  onChange={(event) => {
                    setAmount(event.target.value);
                    setError("");
                  }}
                  placeholder="0"
                  min="0"
                  step="0.01"
                />

                <strong>SAR</strong>
              </div>
            </label>

            <div className={styles.field}>
              <span>Affected city zone</span>

              <div className={styles.categoryGrid}>
                {CATEGORIES.map((item) => (
                  <button
                    type="button"
                    key={item.name}
                    className={`${styles.categoryButton} ${
                      category === item.name
                        ? styles.activeCategory
                        : ""
                    }`}
                    style={
                      {
                        "--category-color": item.color,
                      } as React.CSSProperties
                    }
                    onClick={() =>
                      setCategory(item.name)
                    }
                  >
                    <span
                      className={styles.categoryIcon}
                    >
                      {item.icon}
                    </span>

                    <span
                      className={styles.categoryText}
                    >
                      <strong>{item.name}</strong>
                      <small>{item.building}</small>
                    </span>

                    <span
                      className={styles.categoryCheck}
                    >
                      {category === item.name && (
                        <CheckIcon />
                      )}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.impactPreview}>
              <div
                className={styles.previewCategory}
                style={{
                  background: selectedCategory.color,
                }}
              >
                {selectedCategory.icon}
              </div>

              <div className={styles.previewInformation}>
                <span>Transaction impact preview</span>

                <strong>
                  {selectedCategory.building}
                </strong>

                <p>
                  This expense will use approximately{" "}
                  {expenseImpact}% of your monthly budget.
                </p>
              </div>

              <div className={styles.previewBalance}>
                <span>Balance after</span>

                <strong
                  className={
                    balanceAfterExpense >= 0
                      ? styles.positive
                      : styles.negative
                  }
                >
                  {numberFormatter.format(
                    balanceAfterExpense
                  )}{" "}
                  SAR
                </strong>
              </div>
            </div>

            <div className={styles.formActions}>
              <button
                type="button"
                className={styles.clearButton}
                onClick={clearForm}
              >
                Clear Form
              </button>

              <button
                type="submit"
                className={styles.submitButton}
              >
                <PlusIcon />
                Record Expense
              </button>
            </div>
          </form>

          <div className={styles.budgetShield}>
            <div className={styles.shieldHeader}>
              <div>
                <span>Budget Shield Strength</span>
                <strong>
                  {Math.max(0, 100 - budgetUsage)}%
                </strong>
              </div>

              <span>
                {numberFormatter.format(safeSpent)} /{" "}
                {numberFormatter.format(safeBudget)} SAR
              </span>
            </div>

            <div className={styles.shieldTrack}>
              <span
                className={
                  budgetUsage >= 100
                    ? styles.dangerShield
                    : budgetUsage >= 70
                      ? styles.warningShield
                      : styles.healthyShield
                }
                style={{
                  width: `${Math.min(
                    budgetUsage,
                    100
                  )}%`,
                }}
              ></span>
            </div>
          </div>
        </section>

        <section className={styles.zonePanel}>
          <div className={styles.panelHeader}>
            <div>
              <span className={styles.panelEyebrow}>
                CITY ZONE SCANNER
              </span>

              <h2>Most Active Zones</h2>

              <p>
                Buildings currently receiving the most
                financial pressure.
              </p>
            </div>

            <Link
              href="/city/insights"
              className={styles.panelAction}
            >
              Full Analysis
              <ArrowIcon />
            </Link>
          </div>

          {categoryZones.length === 0 ? (
            <div className={styles.emptyZones}>
              <div className={styles.emptyScanner}>
                <span></span>
                <span></span>
                <ReceiptIcon />
              </div>

              <strong>No city activity detected</strong>

              <p>
                Record your first expense to activate the
                zone scanner.
              </p>
            </div>
          ) : (
            <div className={styles.zoneList}>
              {categoryZones.map((zone, index) => (
                <article
                  className={styles.zoneItem}
                  key={zone.name}
                >
                  <div
                    className={styles.zoneRank}
                    style={{
                      background: zone.color,
                    }}
                  >
                    {index + 1}
                  </div>

                  <div className={styles.zoneIcon}>
                    {zone.icon}
                  </div>

                  <div className={styles.zoneInformation}>
                    <div className={styles.zoneTop}>
                      <div>
                        <strong>{zone.name}</strong>
                        <span>{zone.building}</span>
                      </div>

                      <strong>
                        {numberFormatter.format(zone.spent)}{" "}
                        SAR
                      </strong>
                    </div>

                    <div className={styles.zoneTrack}>
                      <span
                        style={{
                          width: `${zone.percent}%`,
                          background: zone.color,
                        }}
                      ></span>
                    </div>
                  </div>

                  <span className={styles.zonePercent}>
                    {zone.percent}%
                  </span>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

      <section className={styles.transactionsPanel}>
        <div className={styles.panelHeader}>
          <div>
            <span className={styles.panelEyebrow}>
              TREASURY TRANSACTION LOG
            </span>

            <h2>Recorded Expenses</h2>

            <p>
              Search, filter, export and manage all city
              transactions.
            </p>
          </div>

          <button
            type="button"
            className={styles.exportButton}
            onClick={exportExpenses}
            disabled={safeExpenses.length === 0}
          >
            <DownloadIcon />
            Export CSV
          </button>
        </div>

        <div className={styles.filters}>
          <label className={styles.searchField}>
            <SearchIcon />

            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search transactions..."
            />
          </label>

          <select
            value={filterCategory}
            onChange={(event) =>
              setFilterCategory(event.target.value)
            }
            className={styles.filterSelect}
          >
            <option value="All">All categories</option>

            {CATEGORIES.map((item) => (
              <option
                key={item.name}
                value={item.name}
              >
                {item.name}
              </option>
            ))}
          </select>

          {(search || filterCategory !== "All") && (
            <button
              type="button"
              className={styles.clearFilters}
              onClick={clearFilters}
            >
              Clear filters
            </button>
          )}

          <span className={styles.resultCount}>
            {filteredExpenses.length} results
          </span>
        </div>

        {filteredExpenses.length === 0 ? (
          <div className={styles.emptyTransactions}>
            <ReceiptIcon />

            <strong>
              {safeExpenses.length === 0
                ? "No transactions recorded"
                : "No matching transactions"}
            </strong>

            <p>
              {safeExpenses.length === 0
                ? "Use the expense vault to record your first city transaction."
                : "Change the search or category filter."}
            </p>

            {safeExpenses.length === 0 ? (
              <a href="#expense-form">
                <PlusIcon />
                Record First Expense
              </a>
            ) : (
              <button
                type="button"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className={styles.transactionList}>
            {filteredExpenses.map(
              (expense, index) => {
                const expenseCategory =
                  CATEGORIES.find(
                    (item) =>
                      item.name === expense.category
                  ) ?? CATEGORIES[8];

                const impact =
                  safeBudget > 0
                    ? Math.max(
                        1,
                        Math.round(
                          (expense.amount /
                            safeBudget) *
                            100
                        )
                      )
                    : 0;

                return (
                  <article
                    className={styles.transactionItem}
                    key={expense.id}
                  >
                    <span
                      className={
                        styles.transactionNumber
                      }
                    >
                      {String(index + 1).padStart(
                        2,
                        "0"
                      )}
                    </span>

                    <div
                      className={
                        styles.transactionIcon
                      }
                      style={{
                        background:
                          expenseCategory.color,
                      }}
                    >
                      {expenseCategory.icon}
                    </div>

                    <div
                      className={
                        styles.transactionInformation
                      }
                    >
                      <strong>{expense.name}</strong>

                      <span>
                        {expenseCategory.building}
                      </span>
                    </div>

                    <span
                      className={
                        styles.transactionCategory
                      }
                    >
                      {expense.category}
                    </span>

                    <div
                      className={
                        styles.transactionImpact
                      }
                    >
                      <span>City impact</span>
                      <strong>-{impact}%</strong>
                    </div>

                    <strong
                      className={
                        styles.transactionAmount
                      }
                    >
                      {numberFormatter.format(
                        expense.amount
                      )}{" "}
                      SAR
                    </strong>

                    <button
                      type="button"
                      className={styles.deleteButton}
                      onClick={() =>
                        handleDelete(
                          expense.id,
                          expense.name
                        )
                      }
                      aria-label={`Delete ${expense.name}`}
                    >
                      <TrashIcon />
                    </button>
                  </article>
                );
              }
            )}
          </div>
        )}
      </section>
    </div>
  );
}