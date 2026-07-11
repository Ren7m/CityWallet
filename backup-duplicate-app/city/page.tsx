"use client";

import {
  useMemo,
  useState,
  type FormEvent,
} from "react";

import { useAuth } from "@/context/AuthContext";
import { useBudget } from "@/context/BudgetContext";

import CityView from "./components/CityView";
import CityFinanceStatus from "./components/CityFinanceStatus";
import Stats from "./components/Stats";

import styles from "./city.module.css";

const CATEGORIES = [
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Entertainment",
  "Health",
  "Education",
  "Rent",
  "Other",
];

export default function CityPage() {
  const { user } = useAuth();

  const {
    monthlySalary,
    budget,
    expenses,
    addExpense,
    totalSpent,
    balance,
    budgetUsage,
  } = useBudget();

  const [expenseName, setExpenseName] =
    useState("");

  const [expenseAmount, setExpenseAmount] =
    useState("");

  const [expenseCategory, setExpenseCategory] =
    useState("Food");

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const formatter = useMemo(() => {
    return new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 2,
    });
  }, []);

  const recentExpenses = useMemo(() => {
    return [...expenses]
      .reverse()
      .slice(0, 4);
  }, [expenses]);

  const progressWidth = Math.min(
    Math.max(budgetUsage, 0),
    100
  );

  function handleAddExpense(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const amount = Number(expenseAmount);

    if (!expenseName.trim()) {
      setError(
        "Please enter the expense name."
      );
      return;
    }

    if (
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      setError(
        "Please enter a valid amount."
      );
      return;
    }

    addExpense({
      name: expenseName.trim(),
      amount,
      category: expenseCategory,
      createdAt: new Date().toISOString(),
    });

    setExpenseName("");
    setExpenseAmount("");
    setExpenseCategory("Food");

    setSuccess(
      "Expense added successfully."
    );

    window.setTimeout(() => {
      setSuccess("");
    }, 2200);
  }

  return (
    <div className={styles.page}>
      <div className={styles.dashboardGrid}>
        <div className={styles.mainColumn}>
          <section className={styles.welcomeCard}>
            <div>
              <span className={styles.eyebrow}>
                MY FINANCIAL CITY
              </span>

              <h1>
                Welcome back,{" "}
                {user?.name
                  ?.trim()
                  .split(/\s+/)[0] ||
                  "Mayor"}
              </h1>

              <p>
                Manage your spending and watch
                your city respond to your
                financial decisions.
              </p>
            </div>

            <div className={styles.budgetStatus}>
              <span>Budget usage</span>

              <strong>
                {budgetUsage}%
              </strong>
            </div>
          </section>

          <section className={styles.citySection}>
            <CityView />
          </section>

          <CityFinanceStatus />

          <section className={styles.statsSection}>
            <Stats />
          </section>
        </div>

        <aside className={styles.rightPanel}>
          <section className={styles.summaryCard}>
            <div className={styles.cardHeading}>
              <div>
                <span>FINANCIAL SUMMARY</span>

                <h2>Monthly overview</h2>
              </div>

              <strong
                className={
                  balance >= 0
                    ? styles.balancePositive
                    : styles.balanceNegative
                }
              >
                {formatter.format(balance)} SAR
              </strong>
            </div>

            <div className={styles.progressTrack}>
              <span
                className={
                  budgetUsage >= 100
                    ? styles.progressDanger
                    : budgetUsage >= 70
                      ? styles.progressWarning
                      : styles.progressSafe
                }
                style={{
                  width: `${progressWidth}%`,
                }}
              />
            </div>

            <div className={styles.summaryGrid}>
              <div>
                <span>Salary</span>

                <strong>
                  {formatter.format(
                    monthlySalary
                  )}{" "}
                  SAR
                </strong>
              </div>

              <div>
                <span>Budget</span>

                <strong>
                  {formatter.format(
                    budget
                  )}{" "}
                  SAR
                </strong>
              </div>

              <div>
                <span>Spent</span>

                <strong>
                  {formatter.format(
                    totalSpent
                  )}{" "}
                  SAR
                </strong>
              </div>

              <div>
                <span>Remaining</span>

                <strong
                  className={
                    balance >= 0
                      ? styles.positiveText
                      : styles.negativeText
                  }
                >
                  {formatter.format(
                    balance
                  )}{" "}
                  SAR
                </strong>
              </div>
            </div>
          </section>

          <section className={styles.expenseCard}>
            <div className={styles.cardHeading}>
              <div>
                <span>NEW TRANSACTION</span>

                <h2>Add Expense</h2>
              </div>
            </div>

            {error && (
              <div
                className={styles.error}
                role="alert"
              >
                {error}
              </div>
            )}

            {success && (
              <div
                className={styles.success}
                role="status"
              >
                {success}
              </div>
            )}

            <form
              className={styles.expenseForm}
              onSubmit={handleAddExpense}
            >
              <label>
                <span>Expense name</span>

                <input
                  type="text"
                  value={expenseName}
                  onChange={(event) =>
                    setExpenseName(
                      event.target.value
                    )
                  }
                  placeholder="Example: Groceries"
                />
              </label>

              <label>
                <span>Amount</span>

                <div className={styles.amountField}>
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    value={expenseAmount}
                    onChange={(event) =>
                      setExpenseAmount(
                        event.target.value
                      )
                    }
                    placeholder="0"
                  />

                  <strong>SAR</strong>
                </div>
              </label>

              <label>
                <span>Category</span>

                <select
                  value={expenseCategory}
                  onChange={(event) =>
                    setExpenseCategory(
                      event.target.value
                    )
                  }
                >
                  {CATEGORIES.map(
                    (category) => (
                      <option
                        value={category}
                        key={category}
                      >
                        {category}
                      </option>
                    )
                  )}
                </select>
              </label>

              <button type="submit">
                Add Expense
              </button>
            </form>
          </section>

          <section className={styles.recentCard}>
            <div className={styles.cardHeading}>
              <div>
                <span>RECENT ACTIVITY</span>

                <h2>Latest expenses</h2>
              </div>

              <small>
                {expenses.length} total
              </small>
            </div>

            {recentExpenses.length === 0 ? (
              <div className={styles.emptyState}>
                <strong>
                  No expenses yet
                </strong>

                <p>
                  Add your first expense using
                  the form above.
                </p>
              </div>
            ) : (
              <div className={styles.expenseList}>
                {recentExpenses.map(
                  (expense) => (
                    <article
                      key={expense.id}
                      className={
                        styles.expenseItem
                      }
                    >
                      <div
                        className={
                          styles.expenseInitial
                        }
                      >
                        {expense.name
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div
                        className={
                          styles.expenseInformation
                        }
                      >
                        <strong>
                          {expense.name}
                        </strong>

                        <span>
                          {expense.category}
                        </span>
                      </div>

                      <strong
                        className={
                          styles.expensePrice
                        }
                      >
                        {formatter.format(
                          expense.amount
                        )}{" "}
                        SAR
                      </strong>
                    </article>
                  )
                )}
              </div>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}