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

import {
  useLanguage,
} from "@/context/LanguageContext";

import LanguageSwitcher from "@/components/LanguageSwitcher";

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

  const {
    language,
    isArabic,
  } = useLanguage();

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

  const text = {
    label: isArabic
      ? "أنشئ حسابك"
      : "CREATE ACCOUNT",

    title: isArabic
      ? "ابدأ ببناء مدينتك المالية."
      : "Build your financial city.",

    description: isArabic
      ? "أنشئ حسابك وابدأ تدير فلوسك بشكل أذكى."
      : "Create your account and start managing your money smarter.",

    fullName: isArabic
      ? "الاسم الكامل"
      : "Full name",

    fullNamePlaceholder: isArabic
      ? "أدخل اسمك الكامل"
      : "Enter your full name",

    email: isArabic
      ? "البريد الإلكتروني"
      : "Email address",

    salary: isArabic
      ? "الراتب الشهري"
      : "Monthly salary",

    budget: isArabic
      ? "الميزانية الشهرية"
      : "Monthly budget",

    currency: isArabic
      ? "ر.س"
      : "SAR",

    password: isArabic
      ? "كلمة المرور"
      : "Password",

    passwordPlaceholder: isArabic
      ? "6 خانات على الأقل"
      : "At least 6 characters",

    confirmPassword: isArabic
      ? "تأكيد كلمة المرور"
      : "Confirm password",

    confirmPlaceholder: isArabic
      ? "أعد كتابة كلمة المرور"
      : "Repeat your password",

    show: isArabic
      ? "إظهار"
      : "Show",

    hide: isArabic
      ? "إخفاء"
      : "Hide",

    creating: isArabic
      ? "جاري إنشاء الحساب..."
      : "Creating account...",

    create: isArabic
      ? "إنشاء الحساب"
      : "Create Account",

    hasAccount: isArabic
      ? "عندك حساب؟"
      : "Already have an account?",

    signIn: isArabic
      ? "تسجيل الدخول"
      : "Sign in",

    back: isArabic
      ? "الرجوع للرئيسية"
      : "Back to home",
  };

  function getArabicSignupError(
    message: string
  ) {
    const normalized =
      message.toLowerCase();

    if (
      normalized.includes(
        "already registered"
      ) ||
      normalized.includes(
        "already been registered"
      )
    ) {
      return "هذا البريد مسجّل من قبل.";
    }

    if (
      normalized.includes(
        "rate limit"
      ) ||
      normalized.includes(
        "too many"
      )
    ) {
      return "صار فيه طلبات كثيرة خلال وقت قصير. انتظر شوي وجرّب مرة ثانية.";
    }

    if (
      normalized.includes(
        "password"
      )
    ) {
      return "كلمة المرور ما تطابق المتطلبات المطلوبة.";
    }

    return "ما قدرنا ننشئ حسابك الحين. جرّب مرة ثانية.";
  }

  async function handleSubmit(
    event:
      FormEvent<HTMLFormElement>
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
        isArabic
          ? "فضلاً أدخل اسمك كامل."
          : "Please enter your full name."
      );

      return;
    }

    if (
      !cleanEmail.includes("@") ||
      !cleanEmail.includes(".")
    ) {
      setError(
        isArabic
          ? "فضلاً أدخل بريد إلكتروني صحيح."
          : "Please enter a valid email address."
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
        isArabic
          ? "فضلاً أدخل راتب شهري صحيح."
          : "Please enter a valid monthly salary."
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
        isArabic
          ? "فضلاً أدخل ميزانية شهرية صحيحة."
          : "Please enter a valid monthly budget."
      );

      return;
    }

    if (
      budgetValue >
      salaryValue
    ) {
      setError(
        isArabic
          ? "الميزانية الشهرية ما تقدر تكون أعلى من راتبك الشهري."
          : "Monthly budget cannot be greater than monthly salary."
      );

      return;
    }

    if (
      password.length < 6
    ) {
      setError(
        isArabic
          ? "كلمة المرور لازم تكون 6 خانات على الأقل."
          : "Password must contain at least 6 characters."
      );

      return;
    }

    if (
      password !==
      confirmPassword
    ) {
      setError(
        isArabic
          ? "كلمتا المرور غير متطابقتين."
          : "Passwords do not match."
      );

      return;
    }

    setIsSubmitting(true);

    try {
      const result =
        await register(
          cleanName,
          cleanEmail,
          password,
          language
        );

      if (!result.success) {
        setError(
          isArabic
            ? getArabicSignupError(
                result.message
              )
            : result.message
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
          )}&lang=${encodeURIComponent(
            language
          )}`
        );

        return;
      }

      router.replace("/city");

      router.refresh();
    } catch {
      setError(
        isArabic
          ? "ما قدرنا ننشئ حسابك الحين. جرّب مرة ثانية."
          : "Unable to create your account. Please try again."
      );

      setIsSubmitting(false);
    }
  }

  return (
    <main
      className={styles.page}
      dir={
        isArabic
          ? "rtl"
          : "ltr"
      }
    >
      <section className={styles.card}>
        <LanguageSwitcher />

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
            {text.label}
          </span>

          <h1>
            {text.title}
          </h1>

          <p>
            {text.description}
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
              {text.fullName}
            </span>

            <input
              type="text"
              value={name}
              onChange={(event) =>
                setName(
                  event.target.value
                )
              }
              placeholder={
                text.fullNamePlaceholder
              }
              autoComplete="name"
              required
            />
          </label>

          <label
            className={styles.field}
          >
            <span>
              {text.email}
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
                {text.salary}
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
                  {text.currency}
                </strong>
              </div>
            </label>

            <label
              className={styles.field}
            >
              <span>
                {text.budget}
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
                  {text.currency}
                </strong>
              </div>
            </label>
          </div>

          <label
            className={styles.field}
          >
            <span>
              {text.password}
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
                placeholder={
                  text.passwordPlaceholder
                }
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
                  ? text.hide
                  : text.show}
              </button>
            </div>
          </label>

          <label
            className={styles.field}
          >
            <span>
              {
                text.confirmPassword
              }
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
              placeholder={
                text.confirmPlaceholder
              }
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
              ? text.creating
              : text.create}
          </button>
        </form>

        <p
          className={
            styles.footerText
          }
        >
          {text.hasAccount}{" "}

          <Link href="/login">
            {text.signIn}
          </Link>
        </p>

        <Link
          href="/"
          className={styles.back}
        >
          {isArabic
            ? "→"
            : "←"}{" "}
          {text.back}
        </Link>
      </section>
    </main>
  );
}