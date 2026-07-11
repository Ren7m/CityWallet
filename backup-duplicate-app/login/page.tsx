"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  useState,
  type FormEvent,
} from "react";

import { useAuth } from "@/context/AuthContext";

import styles from "./login.module.css";

export default function LoginPage() {
  const router = useRouter();

  const { login } = useAuth();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    const result = login(
      email,
      password
    );

    if (!result.success) {
      setError(result.message);
      return;
    }

    router.push("/city");
  }

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <div className={styles.header}>
          <Link
            href="/"
            className={styles.logo}
          >
            <span>F</span>
            CityWallet
          </Link>

          <span className={styles.label}>
            WELCOME BACK
          </span>

          <h1>Sign in to CityWallet</h1>

          <p>
            Continue managing your
            financial city.
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
          <label>
            <span>Email address</span>

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
            />
          </label>

          <label>
            <span>Password</span>

            <input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(
                  event.target.value
                )
              }
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </label>

          <button type="submit">
            Sign In
          </button>
        </form>

        <p
          className={
            styles.registerText
          }
        >
          New to CityWallet?{" "}
          <Link href="/register">
            Create an account
          </Link>
        </p>
      </section>
    </main>
  );
}