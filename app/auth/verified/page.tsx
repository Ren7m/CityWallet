"use client";

import Link from "next/link";

import {
  useEffect,
  useState,
} from "react";

import styles from "./verified.module.css";

type VerificationState =
  | "checking"
  | "success"
  | "error";

type VerificationLanguage =
  | "en-US"
  | "ar-SA";

function SuccessIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="m7 7 10 10M17 7 7 17" />
    </svg>
  );
}

function LoadingIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="8"
      />

      <path d="M12 4a8 8 0 0 1 8 8" />
    </svg>
  );
}

export default function VerifiedPage() {
  const [
    verificationState,
    setVerificationState,
  ] =
    useState<VerificationState>(
      "checking"
    );

  const [
    language,
    setLanguage,
  ] =
    useState<VerificationLanguage>(
      "en-US"
    );

  const [
    errorCode,
    setErrorCode,
  ] = useState("");

  useEffect(() => {
    const currentUrl =
      new URL(
        window.location.href
      );

    const queryParams =
      currentUrl.searchParams;

    const hashParams =
      new URLSearchParams(
        currentUrl.hash.replace(
          /^#/,
          ""
        )
      );

    const queryLanguage =
      queryParams.get("lang");

    const savedLanguage =
      window.localStorage.getItem(
        "citywallet-language"
      );

    let resolvedLanguage:
      VerificationLanguage =
        "en-US";

    if (
      queryLanguage === "ar-SA"
    ) {
      resolvedLanguage =
        "ar-SA";
    } else if (
      queryLanguage === "en-US"
    ) {
      resolvedLanguage =
        "en-US";
    } else if (
      savedLanguage === "ar-SA"
    ) {
      resolvedLanguage =
        "ar-SA";
    }

    setLanguage(
      resolvedLanguage
    );

    const isArabicLanguage =
      resolvedLanguage === "ar-SA";

    document.documentElement.lang =
      resolvedLanguage;

    document.documentElement.dir =
      isArabicLanguage
        ? "rtl"
        : "ltr";

    document.body.dir =
      isArabicLanguage
        ? "rtl"
        : "ltr";

    window.localStorage.setItem(
      "citywallet-language",
      resolvedLanguage
    );

    const queryError =
      queryParams.get("error");

    const queryErrorCode =
      queryParams.get(
        "error_code"
      );

    const hashError =
      hashParams.get("error");

    const hashErrorCode =
      hashParams.get(
        "error_code"
      );

    const explicitStatus =
      queryParams.get("status");

    const resolvedErrorCode =
      queryErrorCode ||
      hashErrorCode ||
      "";

    setErrorCode(
      resolvedErrorCode
    );

    const hasVerificationError =
      Boolean(queryError) ||
      Boolean(queryErrorCode) ||
      Boolean(hashError) ||
      Boolean(hashErrorCode) ||
      explicitStatus === "error";

    if (
      hasVerificationError
    ) {
      setVerificationState(
        "error"
      );

      return;
    }

    setVerificationState(
      "success"
    );
  }, []);

  const isArabic =
    language === "ar-SA";

  const isChecking =
    verificationState ===
    "checking";

  const isSuccess =
    verificationState ===
    "success";

  const isExpired =
    errorCode ===
      "otp_expired" ||
    errorCode ===
      "otp_disabled";

  const text = {
    eyebrow: isArabic
      ? isChecking
        ? "جاري التحقق"
        : isSuccess
          ? "تم توثيق البريد"
          : "تعذّر التوثيق"
      : isChecking
        ? "VERIFYING EMAIL"
        : isSuccess
          ? "EMAIL VERIFIED"
          : "VERIFICATION FAILED",

    title: isArabic
      ? isChecking
        ? "لحظة، قاعدين نتحقق من بريدك..."
        : isSuccess
          ? "تم توثيق بريدك بنجاح!"
          : isExpired
            ? "رابط التوثيق انتهت صلاحيته."
            : "ما قدرنا نوثّق بريدك."
      : isChecking
        ? "Checking your email verification..."
        : isSuccess
          ? "Email verified successfully!"
          : isExpired
            ? "Your verification link has expired."
            : "We couldn't verify your email.",

    description: isArabic
      ? isChecking
        ? "لحظة بسيطة، قاعدين نتأكد من حالة توثيق حسابك."
        : isSuccess
          ? "حسابك في CityWallet صار جاهز. الحين تقدر تسجّل دخولك وتبدأ تبني مدينتك المالية."
          : isExpired
            ? "الرابط اللي فتحته صار غير صالح أو انتهت صلاحيته. ارجع للتسجيل واستخدم رسالة توثيق جديدة."
            : "صار خطأ أثناء توثيق بريدك. ارجع للتسجيل وجرّب مرة ثانية."
      : isChecking
        ? "Please wait while we check your verification status."
        : isSuccess
          ? "Your CityWallet account is ready. You can now sign in and start building your financial city."
          : isExpired
            ? "The verification link is no longer valid or has expired. Please return to registration and use a new verification email."
            : "Something went wrong while verifying your email. Please return to registration and try again.",

    primaryButton: isArabic
      ? isSuccess
        ? "كمّل لتسجيل الدخول"
        : "الرجوع للتسجيل"
      : isSuccess
        ? "Continue to Sign In"
        : "Back to Registration",

    home: isArabic
      ? "الرجوع للرئيسية"
      : "Back to home",
  };

  return (
    <main
      className={styles.page}
      dir={
        isArabic
          ? "rtl"
          : "ltr"
      }
    >
      <div
        className={
          styles.backgroundGlowOne
        }
      />

      <div
        className={
          styles.backgroundGlowTwo
        }
      />

      <section
        className={styles.card}
      >
        <Link
          href="/"
          className={styles.logo}
        >
          <span
            className={
              styles.logoMark
            }
          >
            C
          </span>

          <span>
            CityWallet
          </span>
        </Link>

        <div
          className={`${styles.iconWrapper} ${
            isSuccess
              ? styles.successIcon
              : isChecking
                ? styles.successIcon
                : styles.errorIcon
          }`}
        >
          {isChecking ? (
            <LoadingIcon />
          ) : isSuccess ? (
            <SuccessIcon />
          ) : (
            <ErrorIcon />
          )}
        </div>

        <span
          className={
            styles.eyebrow
          }
        >
          {text.eyebrow}
        </span>

        <h1>
          {text.title}
        </h1>

        <p>
          {text.description}
        </p>

        {!isChecking && (
          <Link
            href={
              isSuccess
                ? `/login?lang=${encodeURIComponent(
                    language
                  )}`
                : `/register`
            }
            className={
              styles.primaryButton
            }
          >
            {text.primaryButton}

            <span>
              {isArabic
                ? "←"
                : "→"}
            </span>
          </Link>
        )}

        <Link
          href="/"
          className={
            styles.homeLink
          }
        >
          {text.home}
        </Link>

        <div
          className={
            styles.cityDecoration
          }
          aria-hidden="true"
        >
          <div
            className={
              styles.smallBuilding
            }
          />

          <div
            className={
              styles.tallBuilding
            }
          />

          <div
            className={
              styles.mediumBuilding
            }
          />

          <div
            className={
              styles.tree
            }
          />
        </div>
      </section>
    </main>
  );
}