"use client";

import Link from "next/link";

import AlTip from "./components/AITip";
import AttackHistory from "./components/AttackHistory";
import MonsterCard from "./components/MonsterCard";
import RewardsCard from "./components/RewardsCard";

import styles from "./challenges.module.css";

function SwordIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="m14.5 4.5 5-2-2 5L9 16l-3 1 1-3 7.5-9.5Z" />
      <path d="m7 17-4 4" />
      <path d="m4 16 4 4" />
    </svg>
  );
}

function ReceiptIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z" />
      <path d="M9 8h6M9 12h6M9 16h3" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m14 7 5 5-5 5" />
    </svg>
  );
}

export default function ChallengesPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroGrid} />
        <div className={styles.heroGlow} />

        <div className={styles.heroContent}>
          <span className={styles.heroEyebrow}>
            ⚔ WEEKLY FINANCIAL BATTLE
          </span>

          <h1>
            Face the Weekly Monster.

            <strong>
              Turn better money habits into battle progress.
            </strong>
          </h1>

          <p>
            Your real CityWallet activity powers this battle.
            Track expenses, complete financial quests and build
            stronger habits to weaken the weekly monster.
          </p>

          <div className={styles.heroActions}>
            <Link
              href="/city/expenses"
              className={styles.primaryButton}
            >
              <ReceiptIcon />

              Track Expense

              <ArrowIcon />
            </Link>

            <a
              href="#weekly-battle"
              className={styles.secondaryButton}
            >
              <SwordIcon />

              Enter Battle Arena
            </a>
          </div>
        </div>

        <div className={styles.heroBadge}>
          <span>LIVE GAME SYSTEM</span>

          <strong>
            Real activity.
            <br />
            Real progress.
          </strong>

          <p>
            Battle progress comes from your actual CityWallet
            financial activity.
          </p>
        </div>
      </section>

      <section
        className={styles.battleGrid}
        id="weekly-battle"
      >
        <MonsterCard />

        <RewardsCard />
      </section>

      <AlTip />

      <AttackHistory />
    </main>
  );
}