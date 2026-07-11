"use client";

import { useMemo } from "react";

import { useAuth } from "@/context/AuthContext";
import { useBudget } from "@/context/BudgetContext";

export type ChallengeAttack = {
  id: string;
  title: string;
  description: string;
  category: string;
  amount: number;
  damage: number;
  createdAt: string;
};

export type ChallengeTip = {
  title: string;
  message: string;
  status: "good" | "warning" | "danger" | "neutral";
};

const MONSTER_MAX_HP = 1000;
const XP_PER_LEVEL = 500;

function clamp(
  value: number,
  minimum: number,
  maximum: number
) {
  return Math.min(
    Math.max(value, minimum),
    maximum
  );
}

function calculateStreak(
  dates: Array<string | undefined>
) {
  const dateKeys = Array.from(
    new Set(
      dates
        .filter(
          (date): date is string =>
            Boolean(date)
        )
        .map((date) =>
          new Date(date)
            .toISOString()
            .slice(0, 10)
        )
    )
  ).sort((first, second) =>
    second.localeCompare(first)
  );

  if (dateKeys.length === 0) {
    return 0;
  }

  let streak = 1;

  for (
    let index = 1;
    index < dateKeys.length;
    index += 1
  ) {
    const previousDate = new Date(
      dateKeys[index - 1]
    );

    const currentDate = new Date(
      dateKeys[index]
    );

    const difference =
      previousDate.getTime() -
      currentDate.getTime();

    const differenceInDays =
      Math.round(
        difference /
          (1000 * 60 * 60 * 24)
      );

    if (differenceInDays !== 1) {
      break;
    }

    streak += 1;
  }

  return streak;
}

export function useChallengeData() {
  const { user } = useAuth();

  const {
    monthlySalary,
    budget,
    expenses,
    totalSpent,
    balance,
  } = useBudget();

  const safeSalary = Number(
    monthlySalary || 0
  );

  const safeBudget = Number(
    budget || 0
  );

  const safeSpent = Number(
    totalSpent || 0
  );

  const safeBalance = Number(
    balance || 0
  );

  const budgetUsage =
    safeBudget > 0
      ? Math.round(
          (safeSpent / safeBudget) *
            100
        )
      : 0;

  const categoryTotals = useMemo(() => {
    return expenses.reduce<
      Record<string, number>
    >((totals, expense) => {
      const category =
        expense.category || "Other";

      totals[category] =
        (totals[category] || 0) +
        Number(expense.amount || 0);

      return totals;
    }, {});
  }, [expenses]);

  const highestCategory =
    useMemo(() => {
      const entries = Object.entries(
        categoryTotals
      );

      if (entries.length === 0) {
        return {
          name: "No expenses",
          amount: 0,
          percentage: 0,
        };
      }

      const [name, amount] =
        entries.sort(
          (first, second) =>
            second[1] - first[1]
        )[0];

      const percentage =
        safeSpent > 0
          ? Math.round(
              (amount / safeSpent) * 100
            )
          : 0;

      return {
        name,
        amount,
        percentage,
      };
    }, [categoryTotals, safeSpent]);

  const attacks =
    useMemo<ChallengeAttack[]>(() => {
      return [...expenses]
        .reverse()
        .slice(0, 6)
        .map((expense) => {
          const amount = Number(
            expense.amount || 0
          );

          const amountScore =
            safeBudget > 0
              ? Math.round(
                  (amount / safeBudget) *
                    100
                )
              : 0;

          const damage = clamp(
            20 +
              Math.max(
                0,
                60 - amountScore
              ),
            20,
            80
          );

          return {
            id: String(expense.id),
            title: expense.name,
            description: `${expense.category} expense recorded`,
            category:
              expense.category ||
              "Other",
            amount,
            damage,
            createdAt:
              expense.createdAt ??
              new Date().toISOString(),
          };
        });
    }, [expenses, safeBudget]);

  const trackingDamage = Math.min(
    expenses.length * 45,
    360
  );

  const disciplineDamage =
    expenses.length > 0 &&
    safeBudget > 0
      ? clamp(
          100 - budgetUsage,
          0,
          100
        ) * 5
      : 0;

  const balanceDamage =
    expenses.length > 0 &&
    safeBalance > 0 &&
    safeBudget > 0
      ? Math.round(
          (safeBalance / safeBudget) *
            220
        )
      : 0;

  const monsterDamage = clamp(
    Math.round(
      trackingDamage +
        disciplineDamage +
        balanceDamage
    ),
    0,
    MONSTER_MAX_HP
  );

  const monsterHp = Math.max(
    MONSTER_MAX_HP -
      monsterDamage,
    0
  );

  const monsterHealthPercentage =
    Math.round(
      (monsterHp / MONSTER_MAX_HP) *
        100
    );

  const monsterDefeated =
    monsterHp === 0;

  const trackingXp =
    expenses.length * 5;

  const budgetBonusXp =
    expenses.length >= 3 &&
    budgetUsage <= 70
      ? 120
      : 0;

  const savingsBonusXp =
    safeBudget > 0 &&
    safeBalance >= safeBudget * 0.25
      ? 150
      : 0;

  const monsterBonusXp =
    monsterDefeated ? 250 : 0;

  const xp =
    trackingXp +
    budgetBonusXp +
    savingsBonusXp +
    monsterBonusXp;

  const level =
    Math.floor(xp / XP_PER_LEVEL) +
    1;

  const currentLevelXp =
    xp % XP_PER_LEVEL;

  const levelProgress = Math.round(
    (currentLevelXp /
      XP_PER_LEVEL) *
      100
  );

  const coins = Math.floor(xp / 5);

  const streak = calculateStreak(
    expenses.map(
      (expense) =>
        expense.createdAt
    )
  );

  const cityHealth = clamp(
    100 -
      Math.max(
        budgetUsage - 60,
        0
      ) *
        2,
    0,
    100
  );

  const aiTip =
    useMemo<ChallengeTip>(() => {
      if (safeBudget <= 0) {
        return {
          title: "Set your budget",
          message:
            "Add your monthly salary and budget in Settings to activate personalized challenges.",
          status: "neutral",
        };
      }

      if (expenses.length === 0) {
        return {
          title: "Start tracking",
          message:
            "Record your first expense to begin damaging the Weekly Monster.",
          status: "neutral",
        };
      }

      if (safeBalance < 0) {
        return {
          title:
            "Budget recovery mission",
          message: `You exceeded your budget by ${Math.abs(
            safeBalance
          ).toLocaleString(
            "en-US"
          )} SAR. Reduce optional spending to restore city health.`,
          status: "danger",
        };
      }

      if (budgetUsage >= 80) {
        return {
          title:
            "The monster is getting stronger",
          message: `You have used ${budgetUsage}% of your monthly budget. Focus on essential expenses for the rest of the month.`,
          status: "warning",
        };
      }

      if (
        highestCategory.percentage >=
        40
      ) {
        return {
          title: `Review ${highestCategory.name}`,
          message: `${highestCategory.name} represents ${highestCategory.percentage}% of your recorded spending. A small reduction will deal more damage to the monster.`,
          status: "warning",
        };
      }

      return {
        title:
          "Great financial progress",
        message: `You still have ${safeBalance.toLocaleString(
          "en-US"
        )} SAR available. Continue tracking expenses to defeat the monster.`,
        status: "good",
      };
    }, [
      safeBudget,
      expenses.length,
      safeBalance,
      budgetUsage,
      highestCategory,
    ]);

  return {
    player: {
      name: user?.name ?? "Mayor",
      email: user?.email ?? "",
      initials:
        user?.initials ?? "M",
      xp,
      coins,
      streak,
      level,
      currentLevelXp,
      xpRequiredForNextLevel:
        XP_PER_LEVEL,
      levelProgress,
    },

    finance: {
      monthlySalary: safeSalary,
      budget: safeBudget,
      totalSpent: safeSpent,
      balance: safeBalance,
      budgetUsage,
      cityHealth,
      highestCategory,
      transactionCount:
        expenses.length,
    },

    monster: {
      name: "Impulse Monster",
      maxHp: MONSTER_MAX_HP,
      hp: monsterHp,
      healthPercentage:
        monsterHealthPercentage,
      damage: monsterDamage,
      defeated: monsterDefeated,
      rewardXp: 250,
      rewardCoins: 100,
    },

    attacks,
    aiTip,
  };
}