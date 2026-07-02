"use client";

import { useMemo } from "react";

import { useAuth } from "@/context/AuthContext";
import { useBudget } from "@/context/BudgetContext";

import styles from "./AttackHistory.module.css";

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

export default function AttackHistory() {
  const { user } = useAuth();
  const { expenses, budget } = useBudget();

  const playerName =
    user?.name?.trim() || "Mayor";

  const playerInitials =
    user?.initials ||
    playerName.charAt(0).toUpperCase();

  const safeBudget = Number(
    budget || 0
  );

  const history = useMemo(() => {
    return [...expenses]
      .reverse()
      .slice(0, 4)
      .map((expense, index) => {
        const amount = Number(
          expense.amount || 0
        );

        const budgetPercentage =
          safeBudget > 0
            ? Math.round(
                (amount / safeBudget) *
                  100
              )
            : 0;

        const damage = clamp(
          120 -
            budgetPercentage * 2,
          35,
          120
        );

        const rewardXp = clamp(
          Math.round(damage / 3),
          10,
          40
        );

        return {
          id: String(
            expense.id ?? index
          ),
          player: playerName,
          initials: playerInitials,
          expenseName:
            expense.name || "Expense",
          damage,
          reward: `+${rewardXp} XP`,
        };
      });
  }, [
    expenses,
    safeBudget,
    playerName,
    playerInitials,
  ]);

  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <h2>⚔️ Recent Attacks</h2>

        <span>
          {history.length > 0
            ? `${history.length} Attacks`
            : "Today"}
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
              <h3>{playerName}</h3>

              <p>
                Record an expense to
                attack
              </p>
            </div>
          </div>

          <div
            className={styles.damage}
          >
            -0
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
                <h3>{item.player}</h3>

                <p>
                  {item.reward} •{" "}
                  {item.expenseName}
                </p>
              </div>
            </div>

            <div
              className={styles.damage}
            >
              -{item.damage}
            </div>
          </div>
        ))
      )}
    </section>
  );
}