"use client";

import { useState } from "react";
import { useBudget } from "@/context/BudgetContext";
import styles from "./RightPanel.module.css";

export default function RightPanel() {
  const { addExpense, totalSpent, budget } = useBudget();

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");

  const ratio = budget > 0 ? totalSpent / budget : 0;

  const monster =
    ratio >= 1
      ? "Budget Monster"
      : ratio >= 0.7
      ? "Warning Monster"
      : "Food Monster";

  function quickAdd(value: number, type: string) {
    addExpense({
      name: type,
      amount: value,
      category: type,
    });
  }

  function addCustomExpense() {
    if (!amount || Number(amount) <= 0) return;

    addExpense({
      name: category,
      amount: Number(amount),
      category,
    });

    setAmount("");
  }

  return (
    <aside className={styles.panel}>
      <section className={styles.logCard}>
        <h2>Log an Expense</h2>

        <p>
          Keep your city healthy — every tracked spend protects your progress.
        </p>

        <input
          type="number"
          placeholder="Amount SAR"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option>Food</option>
          <option>Shopping</option>
          <option>Transport</option>
          <option>Bills</option>
          <option>Entertainment</option>
          <option>Health</option>
          <option>Education</option>
          <option>Rent</option>
        </select>

        <button onClick={addCustomExpense}>
          ✨ Add Expense
        </button>

        <div className={styles.quickGrid}>
          <button onClick={() => quickAdd(35, "Food")}>🍔 Food</button>

          <button onClick={() => quickAdd(45, "Transport")}>🚗 Transport</button>

          <button onClick={() => quickAdd(120, "Shopping")}>🛍 Shopping</button>

          <button onClick={() => quickAdd(25, "Entertainment")}>🎮 Fun</button>
        </div>
      </section>

      <section className={styles.monsterCard}>
        <span className={styles.week}>🔥 WEEK 28 · ACTIVE</span>

        <h2>Weekly Monster</h2>

        <div className={styles.monster}>
          👾
        </div>

        <h3>{monster}</h3>

        <p>
          Spend less this week to defeat it and unlock new city rewards.
        </p>

        <div className={styles.progress}>
          <div
            style={{
              width: `${Math.min(ratio * 100, 100)}%`,
            }}
          ></div>
        </div>

        <b>{Math.round(Math.min(ratio * 100, 100))}%</b>

        <div className={styles.rewards}>
          <span>⭐ 500 XP</span>

          <span>🏢 New Building</span>

          <span>🪙 200 Coins</span>
        </div>
      </section>

      <section className={styles.aiCard}>
        <span>🤖 AI INSIGHT</span>

        <p>
          Reduce your highest category this week to unlock a greener city level.
        </p>

        <a href="/insights">
          View full report →
        </a>
      </section>
    </aside>
  );
}