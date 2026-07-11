"use client";

import {
  useMemo,
} from "react";

import {
  usePathname,
} from "next/navigation";

import { useAuth } from "@/context/AuthContext";
import { useBudget } from "@/context/BudgetContext";

import UserBadge from "./UserBadge";

import styles from "./Navbar.module.css";

const PAGE_DETAILS: Record<
  string,
  {
    title: string;
    description: string;
  }
> = {
  "/city": {
    title: "My City Dashboard",
    description:
      "Your city updates from your current budget and expenses.",
  },

  "/city/profile": {
    title: "My Profile",
    description:
      "Review your account and financial summary.",
  },

  "/city/expenses": {
    title: "Expense Management",
    description:
      "Manage the expenses used across CityWallet.",
  },

  "/city/insights": {
    title: "AI Insights",
    description:
      "Insights based on your financial data.",
  },

  "/city/challenges": {
    title: "Challenges",
    description:
      "Complete missions based on your spending.",
  },

  "/city/settings": {
    title: "Settings",
    description:
      "Update the information entered during registration.",
  },
};

export default function Navbar() {
  const pathname = usePathname();

  const { user } = useAuth();

  const {
    balance,
  } = useBudget();

  const pageDetails = useMemo(() => {
    if (PAGE_DETAILS[pathname]) {
      return PAGE_DETAILS[pathname];
    }

    const matchingPath =
      Object.keys(
        PAGE_DETAILS
      ).find(
        (path) =>
          path !== "/city" &&
          pathname.startsWith(path)
      );

    return matchingPath
      ? PAGE_DETAILS[matchingPath]
      : PAGE_DETAILS["/city"];
  }, [pathname]);

  function openMobileMenu() {
    window.dispatchEvent(
      new CustomEvent(
        "fincity-toggle-sidebar"
      )
    );
  }

  const firstName =
    user?.name
      .trim()
      .split(/\s+/)[0] ??
    "Mayor";

  return (
    <header className={styles.navbar}>
      <div className={styles.left}>
        <button
          type="button"
          className={styles.menuButton}
          onClick={openMobileMenu}
          aria-label="Open menu"
        >
          ☰
        </button>

        <div>
          <span
            className={styles.welcome}
          >
            Welcome, {firstName}
          </span>

          <h1>{pageDetails.title}</h1>

          <p>
            {pageDetails.description}
          </p>
        </div>
      </div>

      <div className={styles.right}>
        <div
          className={styles.balance}
        >
          <span>
            Available Balance
          </span>

          <strong>
            {Number(
              balance || 0
            ).toLocaleString("en-US", {
              maximumFractionDigits: 2,
            })}{" "}
            SAR
          </strong>
        </div>

        <UserBadge />
      </div>
    </header>
  );
}