"use client";

import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import { useAuth } from "@/context/AuthContext";

import {
  useBudget,
} from "@/context/BudgetContext";

import styles from "./settings.module.css";

export default function SettingsPage() {
  const {
    user,
    updateUser,
  } = useAuth();

  const {
    monthlySalary,
    setMonthlySalary,
    budget,
    setBudget,
    expenses,
    clearExpenses,
  } = useBudget();

  const [
    name,
    setName,
  ] = useState("");

  const [
    email,
    setEmail,
  ] = useState("");

  const [
    salary,
    setSalary,
  ] = useState("");

  const [
    monthlyBudget,
    setMonthlyBudget,
  ] = useState("");

  const [
    message,
    setMessage,
  ] = useState("");

  const [
    error,
    setError,
  ] = useState("");

  const [
    isSaving,
    setIsSaving,
  ] = useState(false);

  useEffect(() => {
    if (!user) {
      return;
    }

    setName(
      user.name
    );

    setEmail(
      user.email
    );

    setSalary(
      String(
        monthlySalary || ""
      )
    );

    setMonthlyBudget(
      String(
        budget || ""
      )
    );
  }, [
    user,
    monthlySalary,
    budget,
  ]);

  async function handleSave(
    event:
      FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (isSaving) {
      return;
    }

    setMessage("");
    setError("");

    const cleanName =
      name.trim();

    const cleanEmail =
      email
        .trim()
        .toLowerCase();

    const salaryValue =
      Number(salary);

    const budgetValue =
      Number(monthlyBudget);

    if (
      cleanName.length < 2
    ) {
      setError(
        "Please enter a valid full name."
      );

      return;
    }

    if (
      !cleanEmail.includes("@") ||
      !cleanEmail.includes(".")
    ) {
      setError(
        "Please enter a valid email address."
      );

      return;
    }

    if (
      !Number.isFinite(
        salaryValue
      ) ||
      salaryValue <= 0
    ) {
      setError(
        "Please enter a valid monthly salary."
      );

      return;
    }

    if (
      !Number.isFinite(
        budgetValue
      ) ||
      budgetValue <= 0
    ) {
      setError(
        "Please enter a valid monthly budget."
      );

      return;
    }

    if (
      budgetValue >
      salaryValue
    ) {
      setError(
        "Monthly budget cannot be greater than monthly salary."
      );

      return;
    }

    setIsSaving(true);

    try {
      const result =
        await updateUser({
          name:
            cleanName,

          email:
            cleanEmail,
        });

      if (!result.success) {
        setError(
          result.message
        );

        return;
      }

      setMonthlySalary(
        salaryValue
      );

      setBudget(
        budgetValue
      );

      setName(
        cleanName
      );

      setEmail(
        cleanEmail
      );

      setMessage(
        result.message
      );
    } catch {
      setError(
        "Unable to save your changes right now. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  }

  function handleClearExpenses() {
    const accepted =
      window.confirm(
        "Remove all recorded expenses?"
      );

    if (!accepted) {
      return;
    }

    clearExpenses();

    setError("");

    setMessage(
      "All expenses were removed."
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className={styles.page}>
      <header
        className={styles.header}
      >
        <span>
          ACCOUNT AND FINANCE
        </span>

        <h1>
          Settings
        </h1>

        <p>
          Update the information entered
          during registration. Changes
          appear across CityWallet
          immediately.
        </p>
      </header>

      {message && (
        <div
          className={
            styles.success
          }
          role="status"
        >
          {message}
        </div>
      )}

      {error && (
        <div
          className={
            styles.error
          }
          role="alert"
        >
          {error}
        </div>
      )}

      <form
        className={styles.form}
        onSubmit={handleSave}
      >
        <section
          className={styles.card}
        >
          <div
            className={
              styles.cardHeader
            }
          >
            <span>
              PROFILE INFORMATION
            </span>

            <h2>
              Account details
            </h2>

            <p>
              Used in the navbar,
              profile and welcome
              messages.
            </p>
          </div>

          <div
            className={
              styles.fields
            }
          >
            <label>
              <span>
                Full name
              </span>

              <input
                type="text"
                value={name}
                onChange={(
                  event
                ) =>
                  setName(
                    event.target.value
                  )
                }
                disabled={
                  isSaving
                }
                maxLength={40}
              />
            </label>

            <label>
              <span>
                Email address
              </span>

              <input
                type="email"
                value={email}
                onChange={(
                  event
                ) =>
                  setEmail(
                    event.target.value
                  )
                }
                disabled={
                  isSaving
                }
              />
            </label>
          </div>
        </section>

        <section
          className={styles.card}
        >
          <div
            className={
              styles.cardHeader
            }
          >
            <span>
              FINANCIAL INFORMATION
            </span>

            <h2>
              Salary and budget
            </h2>

            <p>
              These values control your
              balances and financial
              progress.
            </p>
          </div>

          <div
            className={
              styles.fields
            }
          >
            <label>
              <span>
                Monthly salary
              </span>

              <div
                className={
                  styles.moneyInput
                }
              >
                <input
                  type="number"
                  min="1"
                  value={salary}
                  onChange={(
                    event
                  ) =>
                    setSalary(
                      event.target.value
                    )
                  }
                  disabled={
                    isSaving
                  }
                />

                <strong>
                  SAR
                </strong>
              </div>
            </label>

            <label>
              <span>
                Monthly budget
              </span>

              <div
                className={
                  styles.moneyInput
                }
              >
                <input
                  type="number"
                  min="1"
                  value={
                    monthlyBudget
                  }
                  onChange={(
                    event
                  ) =>
                    setMonthlyBudget(
                      event.target.value
                    )
                  }
                  disabled={
                    isSaving
                  }
                />

                <strong>
                  SAR
                </strong>
              </div>
            </label>
          </div>

          <div
            className={
              styles.financeSummary
            }
          >
            <div>
              <span>
                Recorded expenses
              </span>

              <strong>
                {expenses.length}
              </strong>
            </div>

            <button
              type="button"
              onClick={
                handleClearExpenses
              }
              disabled={
                isSaving
              }
            >
              Clear all expenses
            </button>
          </div>
        </section>

        <button
          type="submit"
          className={
            styles.saveButton
          }
          disabled={
            isSaving
          }
        >
          {isSaving
            ? "Saving..."
            : "Save Changes"}
        </button>
      </form>
    </div>
  );
}