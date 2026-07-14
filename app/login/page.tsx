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

import {
  useLanguage,
} from "@/context/LanguageContext";

import styles from "./login.module.css";

export default function LoginPage() {
  const router = useRouter();

  const {
    user,
    isLoading,
    login,
  } = useAuth();

  const {
    isArabic,
  } = useLanguage();

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

  const text = {
    welcomeBack: isArabic
      ? "هلا بعودتك"
      : "WELCOME BACK",

    title: isArabic
      ? "سجّل دخولك وارجع لمدينتك."
      : "Sign in to your city.",

    description: isArabic
      ? "كمّل إدارة فلوسك، تابع تقدمك المالي، وطوّر مدينتك في CityWallet."
      : "Continue managing your finances and growing your CityWallet progress.",

    email: isArabic
      ? "البريد الإلكتروني"
      : "Email address",

    emailPlaceholder: isArabic
      ? "name@example.com"
      : "name@example.com",

    password: isArabic
      ? "كلمة المرور"
      : "Password",

    passwordPlaceholder: isArabic
      ? "أدخل كلمة المرور"
      : "Enter your password",

    show: isArabic
      ? "إظهار"
      : "Show",

    hide: isArabic
      ? "إخفاء"
      : "Hide",

    forgotPassword: isArabic
      ? "نسيت كلمة المرور؟"
      : "Forgot password?",

    signingIn: isArabic
      ? "جاري تسجيل الدخول..."
      : "Signing in...",

    loading: isArabic
      ? "جاري التحميل..."
      : "Loading...",

    signIn: isArabic
      ? "تسجيل الدخول"
      : "Sign In",

    noAccount: isArabic
      ? "ما عندك حساب؟"
      : "Don&apos;t have an account?",

    createAccount: isArabic
      ? "أنشئ حساب"
      : "Create account",

    backHome: isArabic
      ? "الرجوع للرئيسية"
      : "Back to home",
  };

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

  function getArabicLoginError(
    message: string
  ) {
    const normalized =
      message.toLowerCase();

    if (
      normalized.includes(
        "invalid login credentials"
      )
    ) {
      return "البريد الإلكتروني أو كلمة المرور غير صحيحة.";
    }

    if (
      normalized.includes(
        "email not confirmed"
      )
    ) {
      return "فضلاً أكّد بريدك الإلكتروني أول، وبعدها جرّب تسجّل دخول.";
    }

    if (
      normalized.includes(
        "too many requests"
      )
    ) {
      return "صار فيه محاولات كثيرة. انتظر شوي وجرّب مرة ثانية.";
    }

    return "ما قدرنا نسجّل دخولك حاليًا. جرّب مرة ثانية.";
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

    const cleanEmail =
      email
        .trim()
        .toLowerCase();

    if (
      !cleanEmail ||
      !cleanEmail.includes("@")
    ) {
      setError(
        isArabic
          ? "فضلاً أدخل بريد إلكتروني صحيح."
          : "Please enter a valid email address."
      );

      return;
    }

    if (!password) {
      setError(
        isArabic
          ? "فضلاً أدخل كلمة المرور."
          : "Please enter your password."
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
          isArabic
            ? getArabicLoginError(
                result.message
              )
            : result.message
        );

        setIsSubmitting(false);

        return;
      }

      router.replace("/city");

      router.refresh();
    } catch {
      setError(
        isArabic
          ? "ما قدرنا نسجّل دخولك الحين. جرّب مرة ثانية."
          : "Unable to sign in right now. Please try again."
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
            {text.welcomeBack}
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
              placeholder={
                text.emailPlaceholder
              }
              autoComplete="email"
              required
            />
          </label>

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
                  ? text.hide
                  : text.show}
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
              {text.forgotPassword}
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
              ? text.signingIn
              : isLoading
                ? text.loading
                : text.signIn}
          </button>
        </form>

        <p
          className={
            styles.footerText
          }
        >
          {isArabic
            ? "ما عندك حساب؟ "
            : "Don't have an account? "}

          <Link href="/register">
            {text.createAccount}
          </Link>
        </p>

        <Link
          href="/"
          className={styles.back}
        >
          {isArabic
            ? "→"
            : "←"}{" "}
          {text.backHome}
        </Link>
      </section>
    </main>
  );
}