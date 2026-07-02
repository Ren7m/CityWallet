"use client";

import { useBudget } from "@/context/BudgetContext";
import styles from "./ExpensePanel.module.css";

type Props = {
  open: boolean;
  category: string;
  onClose: () => void;
};

export default function ExpensePanel({
  open,
  category,
  onClose,
}: Props) {
  const { expenses } = useBudget();

  const data = expenses.filter(
    (item: any) => item.category === category
  );

  return (
    <div
      className={`${styles.panel} ${
        open ? styles.show : ""
      }`}
    >
      <button
        className={styles.close}
        onClick={onClose}
      >
        ✕
      </button>

      <h2>{category}</h2>

      {data.map((item: any) => (
        <div
          key={item.id}
          className={styles.item}
        >
          <span>{item.name}</span>

          <span>{item.amount} SAR</span>
        </div>
      ))}
    </div>
  );
}