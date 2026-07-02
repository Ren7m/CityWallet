"use client";

import { useBudget } from "@/context/BudgetContext";
import styles from "./Stats.module.css";

export default function Stats() {
  const {
    budget,
    totalSpent,
    balance,
    goal,
    expenses,
  } = useBudget();

  const level = Math.floor(totalSpent / 500) + 1;

  const streak = 12;

  const progress = Math.min(
    Math.round((Number(balance) / Number(goal)) * 100),
    100
  );

  return (
    <section className={styles.container}>

      <div className={styles.card}>
        <span>⭐</span>
        <h3>Level</h3>
        <h2>{level}</h2>
      </div>

      <div className={styles.card}>
        <span>🔥</span>
        <h3>Streak</h3>
        <h2>{streak} Days</h2>
      </div>

      <div className={styles.card}>
        <span>💰</span>
        <h3>Balance</h3>
        <h2>{balance} SAR</h2>
      </div>

      <div className={styles.card}>
        <span>📊</span>
        <h3>Total Spent</h3>
        <h2>{totalSpent} SAR</h2>
      </div>

      <div className={styles.card}>
        <span>📅</span>
        <h3>Budget</h3>
        <h2>{budget} SAR</h2>
      </div>

      <div className={styles.card}>
        <span>🎯</span>
        <h3>Goal</h3>

        <div className={styles.bar}>
          <div
            className={styles.fill}
            style={{
              width: `${progress}%`,
            }}
          ></div>
        </div>

        <p>{progress}%</p>
      </div>

      <div className={styles.cardWide}>
        <h3>Recent Expenses</h3>

        {expenses.map((item: any) => (
          <div
            key={item.id}
            className={styles.expense}
          >
            <span>{item.name}</span>

            <span>{item.amount} SAR</span>
          </div>
        ))}
      </div>

    </section>
  );
}