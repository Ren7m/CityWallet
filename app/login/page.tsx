"use client";

import Link from "next/link";

import {
  useRouter,
} from "next/navigation";

import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import {
  useAuth,
} from "@/context/AuthContext";

import styles from "./login.module.css";

export default function LoginPage() {
  const router = useRouter();

  const {
    user,
    isLoading,
    login,
  } = useAuth();

  const [
    email,
    setEmail,
  ] = useState("");

  const [
    password,
    setPassword,
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

  useEffect(() => {
    if (
      !isLoading &&
      user
    ) {
      router.replace("/city");
    }
  }, [
    isLoading,
    user,
    router,
  ]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setError("");

    const cleanEmail =
      email
        .trim()
        .toLowerCase();

    if (
      !cleanEmail ||
      !cleanEmail.includes("@")
    ) {
      setError(
        "Please enter a valid email address."
      );

      return;
    }

    if (!password) {
      setError(
        "Please enter your password."
      );

      return;
    }

    setIsSubmitting(true);

    try {
      const result =
        await login(
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

      router.replace("/city");

      router.refresh();
    } catch {
      setError(
        "Unable to sign in right now. Please try again."
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
            WELCOME BACK
          </span>

          <h1>
            Sign in to your city.
          </h1>

          <p>
            Continue managing your
            finances and growing your
            CityWallet progress.
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
                placeholder="Enter your password"
                autoComplete="current-password"
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

          <div
            className={
              styles.options
            }
          >
            <button
              type="button"
              className={
                styles.forgotButton
              }
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            className={
              styles.submitButton
            }
            disabled={
              isSubmitting ||
              isLoading
            }
          >
            {isSubmitting
              ? "Signing in..."
              : isLoading
                ? "Loading..."
                : "Sign In"}
          </button>
        </form>

        <p
          className={
            styles.footerText
          }
        >
          Don&apos;t have an account?{" "}

          <Link href="/register">
            Create account
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