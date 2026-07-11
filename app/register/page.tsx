"use client";

import Link from "next/link";
import {
  useRouter,
} from "next/navigation";

import {
  useState,
  type FormEvent,
} from "react";

import {
  useAuth,
} from "@/context/AuthContext";

import {
  useBudget,
} from "@/context/BudgetContext";

import styles from "./register.module.css";

export default function RegisterPage() {
  const router = useRouter();

  const {
    register,
  } = useAuth();

  const {
    setMonthlySalary,
    setBudget,
    setExpenses,
    setGoal,
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
    budget,
    setBudgetInput,
  ] = useState("");

  const [
    password,
    setPassword,
  ] = useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

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
      Number(budget);

    if (
      cleanName.length < 2
    ) {
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

    if (
      password.length < 6
    ) {
      setError(
        "Password must contain at least 6 characters."
      );

      return;
    }

    if (
      password !==
      confirmPassword
    ) {
      setError(
        "Passwords do not match."
      );

      return;
    }

    setIsSubmitting(true);

    try {
      const result =
        await register(
          cleanName,
          cleanEmail,
          password
        );

      if (!result.success) {
        setError(
          result.message
        );

        setIsSubmitting(false);

        return;
      }

      setMonthlySalary(
        salaryValue
      );

      setBudget(
        budgetValue
      );

      setExpenses([]);

      setGoal(null);

      if (
        result.emailConfirmationRequired
      ) {
        router.replace(
          `/login?registered=1&email=${encodeURIComponent(
            cleanEmail
          )}`
        );

        return;
      }

      router.replace("/city");

      router.refresh();
    } catch {
      setError(
        "Unable to create your account. Please try again."
      );

      setIsSubmitting(false);
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <Link
          href="/"
          className={styles.logo}
        >
          <span
            className={
              styles.logoMark
            }
          >
            F
          </span>

          <span>
            CityWallet
          </span>
        </Link>

        <div className={styles.header}>
          <span
            className={
              styles.label
            }
          >
            CREATE ACCOUNT
          </span>

          <h1>
            Build your financial city.
          </h1>

          <p>
            Create your account and start
            managing your money smarter.
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
          <label
            className={styles.field}
          >
            <span>
              Full name
            </span>

            <input
              type="text"
              value={name}
              onChange={(event) =>
                setName(
                  event.target.value
                )
              }
              placeholder="Enter your full name"
              autoComplete="name"
              required
            />
          </label>

          <label
            className={styles.field}
          >
            <span>
              Email address
            </span>

            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(
                  event.target.value
                )
              }
              placeholder="name@example.com"
              autoComplete="email"
              required
            />
          </label>

          <div className={styles.row}>
            <label
              className={styles.field}
            >
              <span>
                Monthly salary
              </span>

              <div
                className={
                  styles.moneyField
                }
              >
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={salary}
                  onChange={(event) =>
                    setSalary(
                      event.target.value
                    )
                  }
                  placeholder="10000"
                  inputMode="decimal"
                  required
                />

                <strong>
                  SAR
                </strong>
              </div>
            </label>

            <label
              className={styles.field}
            >
              <span>
                Monthly budget
              </span>

              <div
                className={
                  styles.moneyField
                }
              >
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
                  required
                />

                <strong>
                  SAR
                </strong>
              </div>
            </label>
          </div>

          <label
            className={styles.field}
          >
            <span>
              Password
            </span>

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
                required
              />

              <button
                type="button"
                className={
                  styles.showButton
                }
                onClick={() =>
                  setShowPassword(
                    (current) =>
                      !current
                  )
                }
              >
                {showPassword
                  ? "Hide"
                  : "Show"}
              </button>
            </div>
          </label>

          <label
            className={styles.field}
          >
            <span>
              Confirm password
            </span>

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
              required
            />
          </label>

          <button
            type="submit"
            className={
              styles.submitButton
            }
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Creating account..."
              : "Create Account"}
          </button>
        </form>

        <p
          className={
            styles.footerText
          }
        >
          Already have an account?{" "}

          <Link href="/login">
            Sign in
          </Link>
        </p>

        <Link
          href="/"
          className={styles.back}
        >
          ← Back to home
        </Link>
      </section>
    </main>
  );
}