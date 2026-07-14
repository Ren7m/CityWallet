"use client";

import {
  useMemo,
} from "react";

import {
  usePathname,
} from "next/navigation";

import {
  useAuth,
} from "@/context/AuthContext";

import {
  useBudget,
} from "@/context/BudgetContext";

import {
  useLanguage,
} from "@/context/LanguageContext";

import UserBadge from "./UserBadge";

import styles from "./Navbar.module.css";

type PageDetail = {
  title: string;
  description: string;
};

export default function Navbar() {
  const pathname =
    usePathname();

  const {
    user,
  } = useAuth();

  const {
    balance,
  } = useBudget();

  const {
    language,
    isArabic,
  } = useLanguage();

  const pageDetails =
    useMemo<
      Record<string, PageDetail>
    >(
      () => ({
        "/city": {
          title:
            isArabic
              ? "لوحة مدينتي"
              : "My City Dashboard",

          description:
            isArabic
              ? "مدينتك تتغير حسب ميزانيتك ومصروفاتك الحالية."
              : "Your city updates from your current budget and expenses.",
        },

        "/city/profile": {
          title:
            isArabic
              ? "ملفي الشخصي"
              : "My Profile",

          description:
            isArabic
              ? "راجع بيانات حسابك وملخصك المالي."
              : "Review your account and financial summary.",
        },

        "/city/expenses": {
          title:
            isArabic
              ? "إدارة المصروفات"
              : "Expense Management",

          description:
            isArabic
              ? "أدر كل المصروفات المستخدمة داخل CityWallet."
              : "Manage the expenses used across CityWallet.",
        },

        "/city/insights": {
          title:
            isArabic
              ? "تحليلات الذكاء الاصطناعي"
              : "AI Insights",

          description:
            isArabic
              ? "تحليلات مبنية على بياناتك المالية الفعلية."
              : "Insights based on your financial data.",
        },

        "/city/challenges": {
          title:
            isArabic
              ? "التحديات"
              : "Challenges",

          description:
            isArabic
              ? "أنجز مهام مالية مبنية على مصروفاتك."
              : "Complete missions based on your spending.",
        },

        "/city/settings": {
          title:
            isArabic
              ? "الإعدادات"
              : "Settings",

          description:
            isArabic
              ? "حدّث بيانات حسابك ومعلوماتك المالية وإعدادات التطبيق."
              : "Update the information entered during registration.",
        },

        "/city/leaderboard": {
          title:
            isArabic
              ? "لوحة الصدارة"
              : "Leaderboard",

          description:
            isArabic
              ? "تابع ترتيب اللاعبين وتقدمك داخل CityWallet."
              : "Track player rankings and your CityWallet progress.",
        },

        "/city/financial-profile": {
          title:
            isArabic
              ? "ملفي المالي"
              : "Financial Profile",

          description:
            isArabic
              ? "شوف تحليلك المالي المبني على نشاطك الحقيقي."
              : "Review your financial profile based on your real activity.",
        },
      }),
      [isArabic]
    );

  const currentPageDetails =
    useMemo(() => {
      if (
        pageDetails[pathname]
      ) {
        return pageDetails[pathname];
      }

      const matchingPath =
        Object.keys(
          pageDetails
        ).find(
          (path) =>
            path !== "/city" &&
            pathname.startsWith(
              path
            )
        );

      return matchingPath
        ? pageDetails[
            matchingPath
          ]
        : pageDetails["/city"];
    }, [
      pathname,
      pageDetails,
    ]);

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
    (
      isArabic
        ? "العمدة"
        : "Mayor"
    );

  const formattedBalance =
    Number(
      balance || 0
    ).toLocaleString(
      language,
      {
        maximumFractionDigits:
          2,
      }
    );

  return (
    <header
      className={styles.navbar}
      dir={
        isArabic
          ? "rtl"
          : "ltr"
      }
    >
      <div className={styles.left}>
        <button
          type="button"
          className={
            styles.menuButton
          }
          onClick={
            openMobileMenu
          }
          aria-label={
            isArabic
              ? "فتح القائمة"
              : "Open menu"
          }
        >
          ☰
        </button>

        <div>
          <span
            className={
              styles.welcome
            }
          >
            {isArabic
              ? `هلا، ${firstName}`
              : `Welcome, ${firstName}`}
          </span>

          <h1>
            {
              currentPageDetails
                .title
            }
          </h1>

          <p>
            {
              currentPageDetails
                .description
            }
          </p>
        </div>
      </div>

      <div className={styles.right}>
        <div
          className={styles.balance}
        >
          <span>
            {isArabic
              ? "الرصيد المتاح"
              : "Available Balance"}
          </span>

          <strong>
            {formattedBalance}{" "}
            {isArabic
              ? "ر.س"
              : "SAR"}
          </strong>
        </div>

        <UserBadge />
      </div>
    </header>
  );
}