"use client";

import { useBudget } from "@/context/BudgetContext";
import styles from "./CityState.module.css";

export default function CityState() {
  const { budget, totalSpent } = useBudget();

  const ratio = totalSpent / budget;

  let status = "healthy";
  let message = "🌿 Your city is thriving";

  if (ratio >= 1) {
    status = "destroyed";
    message = "💥 Your city is collapsing";
  } else if (ratio >= 0.7) {
    status = "warning";
    message = "⚠️ Be careful with your spending";
  }

  return (
    <div className={`${styles.cityState} ${styles[status]}`}>
      <h2>{message}</h2>
    </div>
  );
}