"use client";

import {
  useMemo,
  useState,
} from "react";

import {
  useAuth,
} from "@/context/AuthContext";

import {
  useBudget,
} from "@/context/BudgetContext";

import {
  useGame,
} from "@/context/GameContext";

import styles from "./MonsterCard.module.css";

function getWeekNumber() {
  const today = new Date();

  const firstDay = new Date(
    today.getFullYear(),
    0,
    1
  );

  const daysPassed = Math.floor(
    (today.getTime() -
      firstDay.getTime()) /
      86400000
  );

  return Math.ceil(
    (daysPassed +
      firstDay.getDay() +
      1) /
      7
  );
}

function getDaysLeftInWeek() {
  const currentDay =
    new Date().getDay();

  return currentDay === 0
    ? 0
    : 7 - currentDay;
}

export default function MonsterCard() {
  const { user } = useAuth();
  const { expenses } = useBudget();

  const {
    monsterHp,
    monsterMaxHp,
    monsterDefeated,
    availableAttacks,
    attackMonster,
    parkUnlocked,
  } = useGame();

  const [hit, setHit] =
    useState(false);

  const topExpense =
    useMemo(() => {
      if (expenses.length === 0) {
        return null;
      }

      return [...expenses].sort(
        (first, second) =>
          Number(
            second.amount || 0
          ) -
          Number(
            first.amount || 0
          )
      )[0];
    }, [expenses]);

  const topExpenseName =
    topExpense?.name ||
    "Spending";

  const topExpenseAmount =
    Number(
      topExpense?.amount || 0
    );

  const monsterName =
    `${topExpenseName} Monster`;

  const playerName =
    user?.name?.trim() ||
    "Mayor";

  const firstName =
    playerName.split(/\s+/)[0];

  const healthPercentage =
    Math.round(
      (monsterHp /
        monsterMaxHp) *
        100
    );

  const weekNumber =
    getWeekNumber();

  const daysLeft =
    getDaysLeftInWeek();

  function handleAttack() {
    const attacked =
      attackMonster();

    if (!attacked) {
      return;
    }

    setHit(true);

    window.setTimeout(() => {
      setHit(false);
    }, 350);
  }

  function getDescription() {
    if (monsterDefeated) {
      return `${firstName}, you defeated the monster and unlocked the City Park. Return to your city to see your new reward.`;
    }

    if (expenses.length === 0) {
      return `${firstName}, record your first expense to earn three attacks against the Weekly Monster.`;
    }

    if (availableAttacks === 0) {
      return `${firstName}, record another expense to earn three more attacks.`;
    }

    return `${topExpenseName} is your highest expense at ${topExpenseAmount.toLocaleString(
      "en-US"
    )} SAR. You currently have ${availableAttacks} attacks available.`;
  }

  return (
    <section className={styles.card}>
      <div className={styles.top}>
        <span>
          🔥 Week {weekNumber} •{" "}
          {monsterDefeated
            ? "Completed"
            : "Active"}
        </span>

        <div className={styles.time}>
          <small>Time left</small>

          <b>
            {daysLeft}{" "}
            {daysLeft === 1
              ? "day"
              : "days"}
          </b>
        </div>
      </div>

      <h2>Defeat the Monster</h2>

      <div
        className={`${styles.monster} ${
          hit ? styles.hit : ""
        }`}
      >
        <div
          className={styles.hornLeft}
        ></div>

        <div
          className={styles.hornRight}
        ></div>

        <div className={styles.body}>
          <div
            className={styles.eyeLeft}
          ></div>

          <div
            className={styles.eyeRight}
          ></div>

          <div
            className={
              styles.pupilLeft
            }
          ></div>

          <div
            className={
              styles.pupilRight
            }
          ></div>

          <div
            className={styles.browLeft}
          ></div>

          <div
            className={styles.browRight}
          ></div>

          <div
            className={
              styles.cheekLeft
            }
          ></div>

          <div
            className={
              styles.cheekRight
            }
          ></div>

          <div
            className={styles.mouth}
          ></div>

          <div className={styles.teeth}>
            <span></span>
            <span></span>
            <span></span>
          </div>

          <div
            className={styles.handLeft}
          ></div>

          <div
            className={styles.handRight}
          ></div>

          <div
            className={styles.footLeft}
          ></div>

          <div
            className={styles.footRight}
          ></div>
        </div>

        <div
          className={styles.shadow}
        ></div>
      </div>

      <h1>{monsterName}</h1>

      <p className={styles.description}>
        {getDescription()}
      </p>

      <div className={styles.progress}>
        <div
          style={{
            width: `${healthPercentage}%`,
          }}
        ></div>
      </div>

      <div className={styles.percent}>
        <span>Monster health</span>

        <b>
          {monsterHp} /{" "}
          {monsterMaxHp} HP
        </b>
      </div>

      <button
        type="button"
        className={styles.attack}
        onClick={handleAttack}
        disabled={
          availableAttacks === 0 ||
          monsterDefeated
        }
      >
        {monsterDefeated
          ? "🎉 Monster Defeated!"
          : availableAttacks > 0
            ? `⚔️ Attack Monster — ${availableAttacks} available`
            : "Record an expense to attack"}
      </button>

      {monsterDefeated && (
        <div className={styles.defeated}>
          🎉 Monster Defeated!
          +250 XP, +100 Coins and{" "}
          {parkUnlocked
            ? "City Park unlocked."
            : "a new city reward unlocked."}
        </div>
      )}
    </section>
  );
}