"use client";

import { useMemo } from "react";

import {
  useRouter,
} from "next/navigation";

import { useAuth } from "@/context/AuthContext";
import { useBudget } from "@/context/BudgetContext";
import { useGame } from "@/context/GameContext";

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
    (
      daysPassed +
      firstDay.getDay() +
      1
    ) / 7
  );
}

function getDaysLeftInWeek() {
  const currentDay =
    new Date().getDay();

  return currentDay === 0
    ? 0
    : 7 - currentDay;
}

function clamp(
  value: number,
  minimum: number,
  maximum: number
) {
  return Math.min(
    Math.max(
      value,
      minimum
    ),
    maximum
  );
}

export default function MonsterCard() {
  const router = useRouter();

  const { user } = useAuth();

  const { expenses } =
    useBudget();

  const {
    monster,
  } = useGame();

  const topExpense = useMemo(() => {
    if (expenses.length === 0) {
      return null;
    }

    return [...expenses].sort(
      (
        first,
        second
      ) =>
        (
          Number(
            second.amount
          ) || 0
        ) -
        (
          Number(
            first.amount
          ) || 0
        )
    )[0];
  }, [expenses]);

  const playerName =
    user?.name?.trim() ||
    "Mayor";

  const firstName =
    playerName.split(/\s+/)[0];

  const topExpenseName =
    topExpense?.name ||
    "your spending";

  const topExpenseAmount =
    Number(
      topExpense?.amount
    ) || 0;

  const monsterMaxHp =
    Math.max(
      Number(
        monster.maxHp
      ) || 0,
      0
    );

  const monsterHp =
    clamp(
      Number(monster.hp) || 0,
      0,
      monsterMaxHp
    );

  const healthPercentage =
    monsterMaxHp > 0
      ? clamp(
          Math.round(
            (
              monsterHp /
              monsterMaxHp
            ) * 100
          ),
          0,
          100
        )
      : 0;

  const weekNumber =
    getWeekNumber();

  const daysLeft =
    getDaysLeftInWeek();

  function getDescription() {
    if (
      monster.rewardClaimed
    ) {
      return `${firstName}, you defeated the monster and already collected your real weekly victory reward.`;
    }

    if (monster.defeated) {
      return `${firstName}, you defeated the monster. Your victory reward of ${monster.rewardXp} XP and ${monster.rewardCoins} Coins is ready to claim.`;
    }

    if (
      expenses.length === 0
    ) {
      return `${firstName}, record your first real expense to activate your Weekly Monster battle progress.`;
    }

    return `${topExpenseName} is currently your highest recorded expense at ${topExpenseAmount.toLocaleString(
      "en-US",
      {
        maximumFractionDigits: 2,
      }
    )} SAR. Keep tracking real expenses and completing financial quests to weaken ${monster.name}.`;
  }

  function handleBattleAction() {
    if (monster.defeated) {
      return;
    }

    router.push(
      "/city/expenses"
    );
  }

  return (
    <section className={styles.card}>
      <div className={styles.top}>
        <span>
          🔥 Week {weekNumber}
          {" • "}
          {monster.defeated
            ? "Completed"
            : "Active"}
        </span>

        <div className={styles.time}>
          <small>
            Time left
          </small>

          <b>
            {daysLeft}{" "}
            {daysLeft === 1
              ? "day"
              : "days"}
          </b>
        </div>
      </div>

      <h2>
        Defeat the Monster
      </h2>

      <div
        className={styles.monster}
      >
        <div
          className={
            styles.hornLeft
          }
        />

        <div
          className={
            styles.hornRight
          }
        />

        <div className={styles.body}>
          <div
            className={
              styles.eyeLeft
            }
          />

          <div
            className={
              styles.eyeRight
            }
          />

          <div
            className={
              styles.pupilLeft
            }
          />

          <div
            className={
              styles.pupilRight
            }
          />

          <div
            className={
              styles.browLeft
            }
          />

          <div
            className={
              styles.browRight
            }
          />

          <div
            className={
              styles.cheekLeft
            }
          />

          <div
            className={
              styles.cheekRight
            }
          />

          <div
            className={styles.mouth}
          />

          <div
            className={styles.teeth}
          >
            <span />
            <span />
            <span />
          </div>

          <div
            className={
              styles.handLeft
            }
          />

          <div
            className={
              styles.handRight
            }
          />

          <div
            className={
              styles.footLeft
            }
          />

          <div
            className={
              styles.footRight
            }
          />
        </div>

        <div
          className={styles.shadow}
        />
      </div>

      <h1>
        {monster.name}
      </h1>

      <p
        className={
          styles.description
        }
      >
        {getDescription()}
      </p>

      <div
        className={styles.progress}
      >
        <div
          style={{
            width: `${healthPercentage}%`,
          }}
        />
      </div>

      <div className={styles.percent}>
        <span>
          Monster health
        </span>

        <b>
          {monsterHp}
          {" / "}
          {monsterMaxHp} HP
        </b>
      </div>

      <button
        type="button"
        className={styles.attack}
        onClick={
          handleBattleAction
        }
        disabled={
          monster.defeated
        }
      >
        {monster.defeated
          ? "🎉 Monster Defeated!"
          : expenses.length === 0
            ? "⚔️ Record First Expense to Attack"
            : "⚔️ Track Expense to Keep Attacking"}
      </button>

      {monster.defeated && (
        <div
          className={styles.defeated}
        >
          {monster.rewardClaimed
            ? "🎉 Monster defeated and victory reward claimed."
            : `🎉 Monster defeated! Victory reward ready: +${monster.rewardXp} XP and +${monster.rewardCoins} Coins.`}
        </div>
      )}
    </section>
  );
}