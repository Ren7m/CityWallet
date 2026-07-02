"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useBudget } from "@/context/BudgetContext";
import styles from "./goals.module.css";

export default function GoalsPage() {
  const router = useRouter();

  const { goal, setGoal } = useBudget();

  const [value, setValue] = useState<number>(2000);

  useEffect(() => {
    if (typeof goal === "number" && !isNaN(goal)) {
      setValue(goal);
    }
  }, [goal]);

  function saveGoal() {
    setGoal(value);
    router.push("/city");
  }

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <h1>🎯 Monthly Goal</h1>

        <p>Enter your saving goal.</p>

        <input
          type="number"
          value={value}
          onChange={(e) =>
            setValue(Number(e.target.value) || 0)
          }
        />

        <button
          className={styles.save}
          onClick={saveGoal}
        >
          Save Goal
        </button>

        <div className={styles.buttons}>
          <button
            className={styles.back}
            onClick={() => router.push("/expense")}
          >
            Previous
          </button>

          <button
            className={styles.next}
            onClick={() => router.push("/city")}
          >
            Next
          </button>
        </div>
      </div>
    </main>
  );
}