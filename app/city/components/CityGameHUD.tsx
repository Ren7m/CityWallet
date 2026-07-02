"use client";

import Link from "next/link";

import {
  useAuth,
} from "@/context/AuthContext";

import {
  useGame,
} from "@/context/GameContext";

import styles from "./CityGameHUD.module.css";

export default function CityGameHUD() {
  const { user } = useAuth();

  const {
    level,
    xp,
    coins,
    currentLevelXp,
    xpRequiredForNextLevel,
    levelProgress,
    availableAttacks,
    monsterDefeated,
    parkUnlocked,
  } = useGame();

  const firstName =
    user?.name
      ?.trim()
      .split(/\s+/)[0] ||
    "Mayor";

  return (
    <aside className={styles.hud}>
      <div className={styles.header}>
        <div>
          <span>
            {firstName}&apos;s Progress
          </span>

          <strong>
            Level {level} Builder
          </strong>
        </div>

        <div className={styles.coins}>
          🪙 {coins}
        </div>
      </div>

      <div className={styles.xpRow}>
        <span>
          XP {currentLevelXp} /{" "}
          {xpRequiredForNextLevel}
        </span>

        <b>{xp}</b>
      </div>

      <div className={styles.progress}>
        <span
          style={{
            width: `${levelProgress}%`,
          }}
        />
      </div>

      <div
        className={`${styles.quest} ${
          parkUnlocked
            ? styles.completed
            : ""
        }`}
      >
        <div className={styles.questIcon}>
          {parkUnlocked ? "🌳" : "🔒"}
        </div>

        <div>
          <strong>
            {parkUnlocked
              ? "City Park Unlocked"
              : "Unlock City Park"}
          </strong>

          <p>
            {parkUnlocked
              ? "Weekly Monster defeated."
              : `${availableAttacks} attacks available`}
          </p>
        </div>
      </div>

      <Link
        href="/city/challenges"
        className={styles.questButton}
      >
        {monsterDefeated
          ? "View completed mission"
          : "Fight Weekly Monster"}
      </Link>
    </aside>
  );
}