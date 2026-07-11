import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.container}>
      <section className={styles.hero}>
        <span className={styles.badge}>Smart Finance</span>

        <h1 className={styles.title}>
          Welcome to <span>CityWallet</span>
        </h1>

        <p className={styles.description}>
          Build better financial habits and grow your virtual city one smart
          decision at a time.
        </p>

        <div className={styles.buttons}>
          <Link href="/login">
            <button className={styles.primaryButton}>
              Login
            </button>
          </Link>

          <Link href="/register">
            <button className={styles.secondaryButton}>
              Create Account
            </button>
          </Link>
        </div>
      </section>

      <section className={styles.city}>
        <div className={`${styles.building} ${styles.small}`}></div>
        <div className={`${styles.building} ${styles.medium}`}></div>
        <div className={`${styles.building} ${styles.large}`}></div>
        <div className={`${styles.building} ${styles.medium}`}></div>
        <div className={`${styles.building} ${styles.small}`}></div>
      </section>
    </main>
  );
}