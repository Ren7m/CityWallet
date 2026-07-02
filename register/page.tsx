"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useState,
  type FormEvent,
} from "react";

import { useAuth } from "@/context/AuthContext";
import { useBudget } from "@/context/BudgetContext";

import styles from "./register.module.css";

export default function RegisterPage() {
  const router = useRouter();

  const { register } = useAuth();

  const {
    setMonthlySalary,
    setBudget,
    setExpenses,
    setGoal,
  } = useBudget();

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [salary, setSalary] =
    useState("");

  const [budget, setBudgetInput] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [error, setError] =
    useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setError("");

    const cleanName = name.trim();
    const cleanEmail = email
      .trim()
      .toLowerCase();

    const salaryValue = Number(salary);
    const budgetValue = Number(budget);

    if (cleanName.length < 2) {
      setError(
        "Please enter your full name."
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
      !Number.isFinite(salaryValue) ||
      salaryValue <= 0
    ) {
      setError(
        "Please enter a valid monthly salary."
      );
      return;
    }

    if (
      !Number.isFinite(budgetValue) ||
      budgetValue <= 0
    ) {
      setError(
        "Please enter a valid monthly budget."
      );
      return;
    }

    if (budgetValue > salaryValue) {
      setError(
        "Monthly budget cannot be greater than monthly salary."
      );
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must contain at least 6 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError(
        "Passwords do not match."
      );
      return;
    }

    setIsSubmitting(true);

    const result = register(
      cleanName,
      cleanEmail,
      password
    );

    if (!result.success) {
      setError(result.message);
      setIsSubmitting(false);
      return;
    }

    setMonthlySalary(salaryValue);
    setBudget(budgetValue);
    setExpenses([]);
    setGoal(null);

    router.push("/city");
  }

  return (
    <main className={styles.page}>
      <section className={styles.container}>
        <div className={styles.intro}>
          <Link
            href="/"
            className={styles.logo}
          >
            <span className={styles.logoMark}>
              F
            </span>

            <span>CityWallet</span>
          </Link>

          <div className={styles.introContent}>
            <span className={styles.eyebrow}>
              START YOUR FINANCIAL JOURNEY
            </span>

            <h1>
              Create your account and build
              your financial city.
            </h1>

            <p>
              Your profile, salary and monthly
              budget will be connected to your
              dashboard, expenses, insights,
              profile and settings.
            </p>
          </div>

          <div className={styles.steps}>
            <div className={styles.step}>
              <span>01</span>

              <div>
                <strong>
                  Create your profile
                </strong>

                <p>
                  Enter your name and email.
                </p>
              </div>
            </div>

            <div className={styles.step}>
              <span>02</span>

              <div>
                <strong>
                  Set your finances
                </strong>

                <p>
                  Add your salary and monthly
                  budget.
                </p>
              </div>
            </div>

            <div className={styles.step}>
              <span>03</span>

              <div>
                <strong>
                  Manage your city
                </strong>

                <p>
                  Track expenses and financial
                  progress.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.formSection}>
          <div className={styles.formHeader}>
            <span>Create account</span>

            <h2>Welcome to CityWallet</h2>

            <p>
              Enter your account and financial
              information below.
            </p>
          </div>

          {error && (
            <div
              className={styles.error}
              role="alert"
            >
              {error}
            </div>
          )}

          <form
            className={styles.form}
            onSubmit={handleSubmit}
          >
            <div className={styles.row}>
              <label className={styles.field}>
                <span>Full name</span>

                <input
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  placeholder="Enter your full name"
                  autoComplete="name"
                />
              </label>

              <label className={styles.field}>
                <span>Email address</span>

                <input
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="name@example.com"
                  autoComplete="email"
                />
              </label>
            </div>

            <div className={styles.row}>
              <label className={styles.field}>
                <span>Monthly salary</span>

                <div className={styles.moneyField}>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={salary}
                    onChange={(event) =>
                      setSalary(event.target.value)
                    }
                    placeholder="10000"
                    inputMode="decimal"
                  />

                  <strong>SAR</strong>
                </div>
              </label>

              <label className={styles.field}>
                <span>Monthly budget</span>

                <div className={styles.moneyField}>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={budget}
                    onChange={(event) =>
                      setBudgetInput(
                        event.target.value
                      )
                    }
                    placeholder="7000"
                    inputMode="decimal"
                  />

                  <strong>SAR</strong>
                </div>
              </label>
            </div>

            <div className={styles.row}>
              <label className={styles.field}>
                <span>Password</span>

                <div
                  className={
                    styles.passwordField
                  }
                >
                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(event) =>
                      setPassword(
                        event.target.value
                      )
                    }
                    placeholder="At least 6 characters"
                    autoComplete="new-password"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (current) => !current
                      )
                    }
                  >
                    {showPassword
                      ? "Hide"
                      : "Show"}
                  </button>
                </div>
              </label>

              <label className={styles.field}>
                <span>Confirm password</span>

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(
                      event.target.value
                    )
                  }
                  placeholder="Repeat your password"
                  autoComplete="new-password"
                />
              </label>
            </div>

            <div className={styles.budgetNote}>
              <span>Monthly plan</span>

              <p>
                Your monthly budget should be
                equal to or lower than your
                monthly salary.
              </p>
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Creating Account..."
                : "Create Account"}
            </button>
          </form>

          <p className={styles.loginText}>
            Already have an account?{" "}
            <Link href="/login">
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}