"use client";

import Sidebar from "../city/components/Sidebar";
import MonsterCard from "./components/MonsterCard";
import RewardsCard from "./components/RewardsCard";
import AttackHistory from "./components/AttackHistory";
import AITip from "./components/AITip";

import styles from "./challenges.module.css";

export default function ChallengesPage() {
  return (
    <main className={styles.page}>
      <Sidebar />

      <section className={styles.content}>
        <header className={styles.header}>
          <div>
            <h1>Weekly Monster</h1>
            <p>Week 28 • Active Mission</p>
          </div>
        </header>

        <div className={styles.layout}>
          <MonsterCard />

          <div className={styles.side}>
            <RewardsCard />
            <AttackHistory />
            <AITip />
          </div>
        </div>
      </section>
    </main>
  );
}