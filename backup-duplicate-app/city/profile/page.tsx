"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";

import { useAuth } from "@/context/AuthContext";
import { useBudget } from "@/context/BudgetContext";

import styles from "./profile.module.css";

function EditIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16v4Z" />
      <path d="m13.5 6.5 4 4" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14" />
      <path d="m14 7 5 5-5 5" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

export default function ProfilePage() {
  const { user, updateUser } = useAuth();

  const {
    budget,
    expenses,
    totalSpent,
    balance,
  } = useBudget();

  const [editOpen, setEditOpen] =
    useState(false);

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [error, setError] =
    useState("");

  const [notice, setNotice] =
    useState("");

  useEffect(() => {
    if (!user) {
      return;
    }

    setName(user.name);
    setEmail(user.email);
  }, [user]);

  const numberFormatter = useMemo(() => {
    return new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 2,
    });
  }, []);

  const safeBudget = Number(budget || 0);
  const safeSpent = Number(totalSpent || 0);
  const safeBalance = Number(balance || 0);
  const safeExpenses = expenses ?? [];

  const budgetUsage =
    safeBudget > 0
      ? Math.round(
          (safeSpent / safeBudget) * 100
        )
      : 0;

  const progressWidth = Math.min(
    Math.max(budgetUsage, 0),
    100
  );

  const recentExpenses = useMemo(() => {
    return [...safeExpenses]
      .reverse()
      .slice(0, 5);
  }, [safeExpenses]);

  function openEditor() {
    if (!user) {
      return;
    }

    setName(user.name);
    setEmail(user.email);
    setError("");
    setEditOpen(true);
  }

  function closeEditor() {
    setEditOpen(false);
    setError("");
  }

  function showNotice(message: string) {
    setNotice(message);

    window.setTimeout(() => {
      setNotice("");
    }, 2200);
  }

  function handleSave(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const cleanName = name.trim();
    const cleanEmail = email
      .trim()
      .toLowerCase();

    if (cleanName.length < 2) {
      setError(
        "Please enter a valid name."
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

    updateUser({
      name: cleanName,
      email: cleanEmail,
    });

    setEditOpen(false);
    setError("");

    showNotice(
      "Profile updated successfully."
    );
  }

  if (!user) {
    return (
      <div className={styles.loading}>
        Loading profile...
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {notice && (
        <div
          className={styles.notice}
          role="status"
        >
          <CheckIcon />
          {notice}
        </div>
      )}

      <div className={styles.pageHeader}>
        <div>
          <span className={styles.eyebrow}>
            ACCOUNT PROFILE
          </span>

          <h1>My Profile</h1>

          <p>
            Manage your account information and
            review your financial activity.
          </p>
        </div>

        <Link
          href="/city"
          className={styles.backButton}
        >
          Back to My City
          <ArrowIcon />
        </Link>
      </div>

      <section className={styles.profileCard}>
        <div className={styles.profileMain}>
          <div className={styles.avatar}>
            {user.initials}
          </div>

          <div className={styles.profileInformation}>
            <div className={styles.nameRow}>
              <h2>{user.name}</h2>

              <span className={styles.status}>
                Active
              </span>
            </div>

            <p>{user.email}</p>

            <span className={styles.role}>
              CityWallet Member
            </span>
          </div>
        </div>

        <button
          type="button"
          className={styles.editButton}
          onClick={openEditor}
        >
          <EditIcon />
          Edit Profile
        </button>
      </section>

      <section className={styles.statsGrid}>
        <article className={styles.statCard}>
          <span>Monthly Budget</span>

          <strong>
            {numberFormatter.format(
              safeBudget
            )}{" "}
            SAR
          </strong>

          <p>Your selected monthly limit</p>
        </article>

        <article className={styles.statCard}>
          <span>Total Spent</span>

          <strong>
            {numberFormatter.format(
              safeSpent
            )}{" "}
            SAR
          </strong>

          <p>{budgetUsage}% of budget used</p>
        </article>

        <article className={styles.statCard}>
          <span>Available Balance</span>

          <strong
            className={
              safeBalance >= 0
                ? styles.positive
                : styles.negative
            }
          >
            {numberFormatter.format(
              safeBalance
            )}{" "}
            SAR
          </strong>

          <p>
            {safeBalance >= 0
              ? "Remaining this month"
              : "Monthly budget exceeded"}
          </p>
        </article>

        <article className={styles.statCard}>
          <span>Transactions</span>

          <strong>
            {safeExpenses.length}
          </strong>

          <p>Expenses currently recorded</p>
        </article>
      </section>

      <div className={styles.contentGrid}>
        <section className={styles.summaryCard}>
          <div className={styles.sectionHeader}>
            <div>
              <span className={styles.sectionLabel}>
                FINANCIAL SUMMARY
              </span>

              <h2>Monthly Budget Usage</h2>

              <p>
                Your profile updates automatically
                when you add or remove expenses.
              </p>
            </div>

            <strong
              className={
                budgetUsage >= 100
                  ? styles.dangerUsage
                  : budgetUsage >= 70
                    ? styles.warningUsage
                    : styles.safeUsage
              }
            >
              {budgetUsage}%
            </strong>
          </div>

          <div className={styles.progressTrack}>
            <span
              className={
                budgetUsage >= 100
                  ? styles.dangerProgress
                  : budgetUsage >= 70
                    ? styles.warningProgress
                    : styles.safeProgress
              }
              style={{
                width: `${progressWidth}%`,
              }}
            />
          </div>

          <div className={styles.summaryValues}>
            <div>
              <span>Spent</span>

              <strong>
                {numberFormatter.format(
                  safeSpent
                )}{" "}
                SAR
              </strong>
            </div>

            <div>
              <span>Remaining</span>

              <strong>
                {numberFormatter.format(
                  safeBalance
                )}{" "}
                SAR
              </strong>
            </div>

            <div>
              <span>Budget</span>

              <strong>
                {numberFormatter.format(
                  safeBudget
                )}{" "}
                SAR
              </strong>
            </div>
          </div>

          <Link
            href="/city/expenses"
            className={styles.manageButton}
          >
            Manage Expenses
            <ArrowIcon />
          </Link>
        </section>

        <section className={styles.detailsCard}>
          <div className={styles.sectionHeader}>
            <div>
              <span className={styles.sectionLabel}>
                ACCOUNT DETAILS
              </span>

              <h2>Personal Information</h2>
            </div>
          </div>

          <div className={styles.detailsList}>
            <div>
              <span>Full name</span>
              <strong>{user.name}</strong>
            </div>

            <div>
              <span>Email address</span>
              <strong>{user.email}</strong>
            </div>

            <div>
              <span>Account type</span>
              <strong>Demo account</strong>
            </div>

            <div>
              <span>Data storage</span>
              <strong>Current session</strong>
            </div>
          </div>
        </section>
      </div>

      <section className={styles.activityCard}>
        <div className={styles.activityHeader}>
          <div>
            <span className={styles.sectionLabel}>
              RECENT ACTIVITY
            </span>

            <h2>Recent Expenses</h2>

            <p>
              Your latest recorded financial
              transactions.
            </p>
          </div>

          <Link
            href="/city/expenses"
            className={styles.viewAll}
          >
            View all
            <ArrowIcon />
          </Link>
        </div>

        {recentExpenses.length === 0 ? (
          <div className={styles.emptyState}>
            <strong>No expenses yet</strong>

            <p>
              Add your first expense to see your
              financial activity here.
            </p>

            <Link href="/city/expenses">
              Add Expense
            </Link>
          </div>
        ) : (
          <div className={styles.expenseList}>
            {recentExpenses.map(
              (expense) => (
                <article
                  className={styles.expenseItem}
                  key={expense.id}
                >
                  <div className={styles.expenseIcon}>
                    {expense.name
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div className={styles.expenseInfo}>
                    <strong>
                      {expense.name}
                    </strong>

                    <span>
                      {expense.category}
                    </span>
                  </div>

                  <strong
                    className={styles.expenseAmount}
                  >
                    {numberFormatter.format(
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

      {editOpen && (
        <div className={styles.modalBackdrop}>
          <section
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-profile-title"
          >
            <div className={styles.modalHeader}>
              <div>
                <span className={styles.sectionLabel}>
                  PROFILE SETTINGS
                </span>

                <h2 id="edit-profile-title">
                  Edit Profile
                </h2>

                <p>
                  Update your name and email
                  address.
                </p>
              </div>

              <button
                type="button"
                className={styles.closeButton}
                onClick={closeEditor}
                aria-label="Close"
              >
                <CloseIcon />
              </button>
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
              className={styles.editForm}
              onSubmit={handleSave}
            >
              <label>
                <span>Full name</span>

                <input
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(
                      event.target.value
                    )
                  }
                  placeholder="Enter your full name"
                  maxLength={40}
                />
              </label>

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
                />
              </label>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={closeEditor}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className={styles.saveButton}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}