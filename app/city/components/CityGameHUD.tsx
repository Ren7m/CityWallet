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
    monster,
  } = useGame();

  const firstName =
    user?.name
      ?.trim()
      .split(/\s+/)[0] ||
    "Mayor";

  const monsterDefeated =
    monster.defeated;

  const progressWidth =
    Math.min(
      Math.max(
        Number(levelProgress) || 0,
        0
      ),
      100
    );

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
            width: `${progressWidth}%`,
          }}
        />
      </div>

      <div
        className={`${styles.quest} ${
          monsterDefeated
            ? styles.completed
            : ""
        }`}
      >
        <div className={styles.questIcon}>
          {monsterDefeated
            ? "🏆"
            : "⚔️"}
        </div>

        <div>
          <strong>
            {monsterDefeated
              ? "Weekly Monster Defeated"
              : "Defeat Weekly Monster"}
          </strong>

          <p>
            {monsterDefeated
              ? monster.rewardClaimed
                ? "Victory reward claimed."
                : "Victory reward ready to claim."
              : `${monster.hp} / ${monster.maxHp} HP remaining`}
          </p>
        </div>
      </div>

      <Link
        href="/city/challenges"
        className={styles.questButton}
      >
        {monsterDefeated
          ? monster.rewardClaimed
            ? "View completed mission"
            : "Claim victory reward"
          : "Fight Weekly Monster"}
      </Link>
    </aside>
  );
}