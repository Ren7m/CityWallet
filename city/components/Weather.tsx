"use client";

import { useBudget } from "@/context/BudgetContext";
import styles from "./Weather.module.css";

export default function Weather() {
  const { budget, totalSpent } = useBudget();

  const ratio = totalSpent / budget;

  if (ratio >= 1) {
    return (
      <>
        <div className={styles.rain}></div>
        <div className={styles.rain}></div>
        <div className={styles.rain}></div>

        <div className={styles.lightning}></div>
      </>
    );
  }

  if (ratio >= 0.7) {
    return (
      <>
        <div className={styles.cloud}></div>
        <div className={styles.cloud2}></div>
      </>
    );
  }

  return (
    <>
      <div className={styles.bird}>🕊️</div>
      <div className={styles.bird2}>🕊️</div>
    </>
  );
}