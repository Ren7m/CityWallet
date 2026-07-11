"use client";

import {
  useAuth,
} from "@/context/AuthContext";

import {
  useGame,
} from "@/context/GameContext";

import styles from "./RewardsCard.module.css";

export default function RewardsCard() {
  const { user } = useAuth();

  const {
    xp,
    coins,
    level,
    availableAttacks,
    parkUnlocked,
    monsterDefeated,
  } = useGame();

  const firstName =
    user?.name
      ?.trim()
      .split(/\s+/)[0] ||
    "Mayor";

  const rewards = [
    {
      icon: "⭐",
      title: `${xp} XP`,
      text: `Level ${level} Progress`,
    },
    {
      icon: "🪙",
      title: `${coins} Coins`,
      text: `${firstName}'s Currency`,
    },
    {
      icon: "⚔️",
      title: `${availableAttacks} Attacks`,
      text: "Available Now",
    },
    {
      icon: "🌳",
      title: "City Park",
      text: parkUnlocked
        ? "Unlocked"
        : "Defeat Monster",
    },
  ];

  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <h2>🎁 Rewards</h2>

        <span>
          {monsterDefeated
            ? "Mission Complete"
            : "Complete Mission"}
        </span>
      </div>

      <div className={styles.grid}>
        {rewards.map((reward) => (
          <div
            key={reward.icon}
            className={styles.reward}
          >
            <div className={styles.icon}>
              {reward.icon}
            </div>

            <h3>{reward.title}</h3>

            <p>{reward.text}</p>
          </div>
        ))}
      </div>

      <button
        type="button"
        className={styles.claim}
        disabled
      >
        {monsterDefeated
          ? "Rewards Claimed ✓"
          : "Defeat Monster to Unlock"}
      </button>
    </section>
  );
}