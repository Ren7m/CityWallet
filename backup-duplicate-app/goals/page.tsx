"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useBudget } from "@/context/BudgetContext";

import styles from "./goals.module.css";

export default function GoalsPage() {
  const router = useRouter();

  const { goal, setGoal } = useBudget();

  const [value, setValue] = useState<number>(2000);

  useEffect(() => {
    if (
      typeof goal?.targetAmount === "number" &&
      Number.isFinite(goal.targetAmount)
    ) {
      setValue(goal.targetAmount);
    }
  }, [goal]);

  function saveGoal() {
    if (!Number.isFinite(value) || value <= 0) {
      return;
    }

    setGoal({
      title: "Monthly Saving Goal",
      type: "saving",
      targetAmount: value,
    });

    router.push("/city");
  }

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <h1>Monthly Goal</h1>

        <p>Enter your saving goal.</p>

        <input
          type="number"
          min="1"
          value={value}
          onChange={(event) =>
            setValue(Number(event.target.value) || 0)
          }
        />

        <button
          type="button"
          className={styles.save}
          onClick={saveGoal}
        >
          Save Goal
        </button>

        <div className={styles.buttons}>
          <button
            type="button"
            className={styles.back}
            onClick={() => router.push("/expense")}
          >
            Previous
          </button>

          <button
            type="button"
            className={styles.next}
            onClick={saveGoal}
          >
            Next
          </button>
        </div>
      </div>
    </main>
  );
}