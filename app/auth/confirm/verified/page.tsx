import Link from "next/link";

import styles from "./verified.module.css";

type VerifiedPageProps = {
  searchParams: Promise<{
    status?: string;
    lang?: string;
  }>;
};

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

export default async function VerifiedPage({
  searchParams,
}: VerifiedPageProps) {
  const params =
    await searchParams;

  const isSuccess =
    params.status === "success";

  const isArabic =
    params.lang === "ar-SA";

  const language =
    isArabic
      ? "ar-SA"
      : "en-US";

  const text = {
    eyebrow: isArabic
      ? isSuccess
        ? "تم توثيق البريد"
        : "فشل التوثيق"
      : isSuccess
        ? "EMAIL VERIFIED"
        : "VERIFICATION FAILED",

    title: isArabic
      ? isSuccess
        ? "تم توثيق بريدك بنجاح!"
        : "ما قدرنا نوثّق بريدك."
      : isSuccess
        ? "Email verified successfully!"
        : "We couldn't verify your email.",

    description: isArabic
      ? isSuccess
        ? "حسابك في CityWallet صار جاهز. الحين تقدر تسجّل دخولك وتبدأ تبني مدينتك المالية."
        : "رابط التوثيق ممكن يكون غير صالح أو انتهت صلاحيته. جرّب تنشئ حسابك من جديد."
      : isSuccess
        ? "Your CityWallet account is ready. You can now sign in and start building your financial city."
        : "The verification link may be invalid or expired. Please create your account again or request a new verification email.",

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
              : styles.errorIcon
          }`}
        >
          {isSuccess ? (
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