"use client";

import { useMemo } from "react";

import { useAuth } from "@/context/AuthContext";
import { useBudget } from "@/context/BudgetContext";

import styles from "./AttackHistory.module.css";

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

  if (
    date.toDateString() ===
    today.toDateString()
  ) {
    return "Today";
  }

  const yesterday = new Date(today);

  yesterday.setDate(
    yesterday.getDate() - 1
  );

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

export default function AttackHistory() {
  const { user } = useAuth();

  const {
    expenses,
    budget,
  } = useBudget();

  const playerName =
    user?.name?.trim() ||
    "Mayor";

  const playerInitials =
    user?.initials ||
    playerName
      .charAt(0)
      .toUpperCase();

  const currentBudget =
    Number(budget) || 0;

  const history = useMemo(() => {
    return [...expenses]
      .reverse()
      .slice(0, 5)
      .map((expense, index) => {
        const amount =
          Number(
            expense.amount
          ) || 0;

        const budgetImpact =
          currentBudget > 0
            ? (
                (amount /
                  currentBudget) *
                100
              ).toFixed(1)
            : null;

        return {
          id: String(
            expense.id ??
              `${expense.name}-${index}`
          ),

          player:
            playerName,

          initials:
            playerInitials,

          expenseName:
            expense.name ||
            "Expense",

          category:
            expense.category ||
            "Other",

          amount,

          recordedAt:
            formatExpenseDate(
              expense.createdAt
            ),

          budgetImpact,
        };
      });
  }, [
    expenses,
    currentBudget,
    playerName,
    playerInitials,
  ]);

  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <h2>
          ⚔️ Recent Battle Activity
        </h2>

        <span>
          {history.length > 0
            ? `${history.length} ${
                history.length === 1
                  ? "Activity"
                  : "Activities"
              }`
            : "No activity yet"}
        </span>
      </div>

      {history.length === 0 ? (
        <div className={styles.row}>
          <div className={styles.left}>
            <div
              className={styles.avatar}
            >
              {playerInitials}
            </div>

            <div>
              <h3>
                {playerName}
              </h3>

              <p>
                Record your first real
                expense to start the battle.
              </p>
            </div>
          </div>

          <div
            className={styles.damage}
          >
            0 SAR
          </div>
        </div>
      ) : (
        history.map((item) => (
          <div
            key={item.id}
            className={styles.row}
          >
            <div
              className={styles.left}
            >
              <div
                className={
                  styles.avatar
                }
              >
                {item.initials}
              </div>

              <div>
                <h3>
                  {item.expenseName}
                </h3>

                <p>
                  {item.category}
                  {" • "}
                  {item.recordedAt}

                  {item.budgetImpact &&
                    ` • ${item.budgetImpact}% of budget`}
                </p>
              </div>
            </div>

            <div
              className={styles.damage}
            >
              -
              {item.amount.toLocaleString(
                "en-US",
                {
                  maximumFractionDigits:
                    2,
                }
              )}{" "}
              SAR
            </div>
          </div>
        ))
      )}
    </section>
  );
}