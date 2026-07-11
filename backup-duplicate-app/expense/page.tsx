"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useBudget } from "@/context/BudgetContext";
import styles from "./expense.module.css";

export default function ExpensePage() {
  const router = useRouter();

  const { addExpense, expenses, removeExpense } = useBudget();

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");

  function saveExpense() {
    if (name.trim() === "" || Number(amount) <= 0) return;

    addExpense({
      name,
      amount: Number(amount),
      category,
    });

    setName("");
    setAmount("");
    setCategory("Food");
  }

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <h1>Add Expense</h1>

        <input
          placeholder="Expense Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="number"
          placeholder="Amount"
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

        <button
          className={styles.addButton}
          onClick={saveExpense}
        >
          Add Expense
        </button>

        <div className={styles.list}>
          {expenses.map((item: any) => (
            <div
              key={item.id}
              className={styles.item}
            >
              <div>
                <h3>{item.name}</h3>

                <p>{item.category}</p>
              </div>

              <div className={styles.right}>
                <span>{item.amount} SAR</span>

                <button
                  className={styles.delete}
                  onClick={() =>
                    removeExpense(item.id)
                  }
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.buttons}>
          <button
            className={styles.back}
            onClick={() => router.push("/login")}
          >
            Previous
          </button>

          <button
            className={styles.next}
            onClick={() => router.push("/goals")}
          >
            Next
          </button>
        </div>
      </div>
    </main>
  );
}