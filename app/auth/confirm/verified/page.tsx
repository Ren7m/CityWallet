import Link from "next/link";

import styles from "./verified.module.css";

type VerifiedPageProps = {
  searchParams: Promise<{
    status?: string;
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

  return (
    <main className={styles.page}>
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
          {isSuccess
            ? "EMAIL VERIFIED"
            : "VERIFICATION FAILED"}
        </span>

        <h1>
          {isSuccess
            ? "Email verified successfully!"
            : "We couldn't verify your email."}
        </h1>

        <p>
          {isSuccess
            ? "Your CityWallet account is ready. You can now sign in and start building your financial city."
            : "The verification link may be invalid or expired. Please create your account again or request a new verification email."}
        </p>

        <Link
          href={
            isSuccess
              ? "/login"
              : "/register"
          }
          className={
            styles.primaryButton
          }
        >
          {isSuccess
            ? "Continue to Sign In"
            : "Back to Registration"}

          <span>
            →
          </span>
        </Link>

        <Link
          href="/"
          className={
            styles.homeLink
          }
        >
          Back to home
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