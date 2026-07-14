"use client";

import Link from "next/link";

import {
  useAuth,
} from "@/context/AuthContext";

import {
  useGame,
} from "@/context/GameContext";

import {
  useLanguage,
} from "@/context/LanguageContext";

import styles from "./CityGameHUD.module.css";

export default function CityGameHUD() {
  const {
    user,
  } = useAuth();

  const {
    level,
    xp,
    coins,
    currentLevelXp,
    xpRequiredForNextLevel,
    levelProgress,
    monster,
  } = useGame();

  const {
    isArabic,
  } = useLanguage();

  const firstName =
    user?.name
      ?.trim()
      .split(/\s+/)[0] ||
    (
      isArabic
        ? "العمدة"
        : "Mayor"
    );

  const monsterDefeated =
    monster.defeated;

  const progressWidth =
    Math.min(
      Math.max(
        Number(
          levelProgress
        ) || 0,
        0
      ),
      100
    );

  const missionTitle =
    monsterDefeated
      ? (
          isArabic
            ? "تم هزيمة الوحش الأسبوعي"
            : "Weekly Monster Defeated"
        )
      : (
          isArabic
            ? "اهزم الوحش الأسبوعي"
            : "Defeat Weekly Monster"
        );

  let missionDescription:
    string;

  if (monsterDefeated) {
    missionDescription =
      monster.rewardClaimed
        ? (
            isArabic
              ? "استلمت مكافأة الفوز."
              : "Victory reward claimed."
          )
        : (
            isArabic
              ? "مكافأة الفوز جاهزة للاستلام."
              : "Victory reward ready to claim."
          );
  } else {
    missionDescription =
      isArabic
        ? `متبقي ${monster.hp} من ${monster.maxHp} من نقاط الصحة`
        : `${monster.hp} / ${monster.maxHp} HP remaining`;
  }

  let missionButton:
    string;

  if (monsterDefeated) {
    missionButton =
      monster.rewardClaimed
        ? (
            isArabic
              ? "عرض المهمة المكتملة"
              : "View completed mission"
          )
        : (
            isArabic
              ? "استلام مكافأة الفوز"
              : "Claim victory reward"
          );
  } else {
    missionButton =
      isArabic
        ? "واجه الوحش الأسبوعي"
        : "Fight Weekly Monster";
  }

  return (
    <aside
      className={styles.hud}
      dir={
        isArabic
          ? "rtl"
          : "ltr"
      }
    >
      <div className={styles.header}>
        <div>
          <span>
            {isArabic
              ? `تقدم ${firstName}`
              : `${firstName}'s Progress`}
          </span>

          <strong>
            {isArabic
              ? `المستوى ${level}`
              : `Level ${level} Builder`}
          </strong>
        </div>

        <div className={styles.coins}>
          🪙 {coins}
        </div>
      </div>

      <div className={styles.xpRow}>
        <span>
          {isArabic
            ? `نقاط الخبرة ${currentLevelXp} / ${xpRequiredForNextLevel}`
            : `XP ${currentLevelXp} / ${xpRequiredForNextLevel}`}
        </span>

        <b>
          {xp}
        </b>
      </div>

      <div className={styles.progress}>
        <span
          style={{
            width:
              `${progressWidth}%`,
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
        <div
          className={
            styles.questIcon
          }
        >
          {monsterDefeated
            ? "🏆"
            : "⚔️"}
        </div>

        <div>
          <strong>
            {missionTitle}
          </strong>

          <p>
            {
              missionDescription
            }
          </p>
        </div>
      </div>

      <Link
        href="/city/challenges"
        className={
          styles.questButton
        }
      >
        {missionButton}
      </Link>
    </aside>
  );
}