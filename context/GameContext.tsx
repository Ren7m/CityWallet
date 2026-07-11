"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { useAuth } from "@/context/AuthContext";
import { useBudget } from "@/context/BudgetContext";

/* =========================
   TYPES
========================= */

export type GameQuest = {
  id: string;
  title: string;
  description: string;
  progress: number;
  completed: boolean;
  claimed: boolean;
  rewardXp: number;
  rewardCoins: number;
};

export type WeeklyMonster = {
  name: string;
  description: string;
  maxHp: number;
  hp: number;
  damage: number;
  defeated: boolean;
  rewardClaimed: boolean;
  rewardXp: number;
  rewardCoins: number;
};

type QuestReward = {
  xp: number;
  coins: number;
};

type StoredGameData = {
  claimedQuestIds: string[];
  monsterRewardClaimed: boolean;
};

type GameContextType = {
  xp: number;
  coins: number;
  streak: number;

  level: number;
  currentLevelXp: number;
  xpRequiredForNextLevel: number;
  levelProgress: number;

  cityHealth: number;
  hasFinancialData: boolean;

  quests: GameQuest[];

  claimQuest: (
    questId: string
  ) => boolean;

  monster: WeeklyMonster;

  claimMonsterReward: () => boolean;

  resetGameProgress: () => void;
};

/* =========================
   CONSTANTS
========================= */

const XP_PER_LEVEL = 250;

const QUEST_REWARDS: Record<
  string,
  QuestReward
> = {
  "first-expense": {
    xp: 30,
    coins: 10,
  },

  "expense-tracker": {
    xp: 80,
    coins: 20,
  },

  "budget-guardian": {
    xp: 120,
    coins: 35,
  },

  "savings-builder": {
    xp: 150,
    coins: 40,
  },
};

const MONSTER_REWARD = {
  xp: 250,
  coins: 100,
};

/* =========================
   CONTEXT
========================= */

const GameContext =
  createContext<GameContextType | null>(
    null
  );

/* =========================
   HELPERS
========================= */

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

function getLocalDateKey(
  date = new Date()
) {
  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function shiftDate(
  date: Date,
  numberOfDays: number
) {
  const result = new Date(date);

  result.setDate(
    result.getDate() + numberOfDays
  );

  return result;
}

function calculateStreak(
  expenses: {
    createdAt?: string;
  }[]
) {
  if (expenses.length === 0) {
    return 0;
  }

  const activeDays =
    new Set<string>();

  expenses.forEach((expense) => {
    if (!expense.createdAt) {
      return;
    }

    const expenseDate = new Date(
      expense.createdAt
    );

    if (
      Number.isNaN(
        expenseDate.getTime()
      )
    ) {
      return;
    }

    activeDays.add(
      getLocalDateKey(expenseDate)
    );
  });

  if (activeDays.size === 0) {
    return 0;
  }

  const today = new Date();

  const yesterday = shiftDate(
    today,
    -1
  );

  const todayKey =
    getLocalDateKey(today);

  const yesterdayKey =
    getLocalDateKey(yesterday);

  let currentDate: Date;

  if (activeDays.has(todayKey)) {
    currentDate = today;
  } else if (
    activeDays.has(yesterdayKey)
  ) {
    currentDate = yesterday;
  } else {
    return 0;
  }

  let streak = 0;

  while (true) {
    const currentKey =
      getLocalDateKey(currentDate);

    if (
      !activeDays.has(currentKey)
    ) {
      break;
    }

    streak += 1;

    currentDate = shiftDate(
      currentDate,
      -1
    );
  }

  return streak;
}

/* =========================
   PROVIDER
========================= */

export function GameProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { user } = useAuth();

  const {
    budget,
    expenses,
    totalSpent,
    balance,
  } = useBudget();

  const [
    claimedQuestIds,
    setClaimedQuestIds,
  ] = useState<string[]>([]);

  const [
    monsterRewardClaimed,
    setMonsterRewardClaimed,
  ] = useState(false);

  const [
    isReady,
    setIsReady,
  ] = useState(false);

  /* =========================
     STORAGE
  ========================= */

  const storageKey = useMemo(() => {
    const userIdentifier =
      user?.email
        ?.trim()
        .toLowerCase() ||
      "guest";

    return `citywallet-game-data:${userIdentifier}`;
  }, [user?.email]);

  useEffect(() => {
    setIsReady(false);

    setClaimedQuestIds([]);

    setMonsterRewardClaimed(false);

    const storedGame =
      window.sessionStorage.getItem(
        storageKey
      );

    if (storedGame) {
      try {
        const parsed =
          JSON.parse(
            storedGame
          ) as Partial<StoredGameData>;

        setClaimedQuestIds(
          Array.isArray(
            parsed.claimedQuestIds
          )
            ? parsed.claimedQuestIds
            : []
        );

        setMonsterRewardClaimed(
          Boolean(
            parsed.monsterRewardClaimed
          )
        );
      } catch {
        window.sessionStorage.removeItem(
          storageKey
        );
      }
    }

    setIsReady(true);
  }, [storageKey]);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    const gameData: StoredGameData = {
      claimedQuestIds,
      monsterRewardClaimed,
    };

    window.sessionStorage.setItem(
      storageKey,
      JSON.stringify(gameData)
    );
  }, [
    claimedQuestIds,
    monsterRewardClaimed,
    isReady,
    storageKey,
  ]);

  /* =========================
     FINANCIAL VALUES
  ========================= */

  const currentBudget =
    Number(budget) || 0;

  const currentSpent =
    Number(totalSpent) || 0;

  const currentBalance =
    Number(balance) || 0;

  const budgetUsage =
    currentBudget > 0
      ? Math.round(
          (currentSpent /
            currentBudget) *
            100
        )
      : 0;

  const hasFinancialData =
    currentBudget > 0 &&
    expenses.length > 0;

  /* =========================
     STREAK
  ========================= */

  const streak = useMemo(() => {
    return calculateStreak(
      expenses
    );
  }, [expenses]);

  /* =========================
     QUESTS
  ========================= */

  const quests =
    useMemo<GameQuest[]>(() => {
      const firstExpenseProgress =
        Math.min(
          expenses.length * 100,
          100
        );

      const fiveExpensesProgress =
        Math.min(
          Math.round(
            (expenses.length / 5) *
              100
          ),
          100
        );

      const disciplineProgress =
        currentBudget > 0 &&
        expenses.length > 0
          ? clamp(
              Math.round(
                ((100 -
                  budgetUsage) /
                  30) *
                  100
              ),
              0,
              100
            )
          : 0;

      const requiredSavings =
        currentBudget * 0.25;

      const savingsProgress =
        expenses.length > 0 &&
        requiredSavings > 0
          ? clamp(
              Math.round(
                (Math.max(
                  currentBalance,
                  0
                ) /
                  requiredSavings) *
                  100
              ),
              0,
              100
            )
          : 0;

      return [
        {
          id: "first-expense",

          title: "First Step",

          description:
            "Record your first expense in CityWallet.",

          progress:
            firstExpenseProgress,

          completed:
            expenses.length >= 1,

          claimed:
            claimedQuestIds.includes(
              "first-expense"
            ),

          rewardXp:
            QUEST_REWARDS[
              "first-expense"
            ].xp,

          rewardCoins:
            QUEST_REWARDS[
              "first-expense"
            ].coins,
        },

        {
          id: "expense-tracker",

          title: "Expense Tracker",

          description:
            "Record five financial transactions.",

          progress:
            fiveExpensesProgress,

          completed:
            expenses.length >= 5,

          claimed:
            claimedQuestIds.includes(
              "expense-tracker"
            ),

          rewardXp:
            QUEST_REWARDS[
              "expense-tracker"
            ].xp,

          rewardCoins:
            QUEST_REWARDS[
              "expense-tracker"
            ].coins,
        },

        {
          id: "budget-guardian",

          title: "Budget Guardian",

          description:
            "Record at least three expenses while keeping budget usage at 70% or lower.",

          progress:
            disciplineProgress,

          completed:
            expenses.length >= 3 &&
            budgetUsage <= 70,

          claimed:
            claimedQuestIds.includes(
              "budget-guardian"
            ),

          rewardXp:
            QUEST_REWARDS[
              "budget-guardian"
            ].xp,

          rewardCoins:
            QUEST_REWARDS[
              "budget-guardian"
            ].coins,
        },

        {
          id: "savings-builder",

          title: "Savings Builder",

          description:
            "Keep at least 25% of your monthly budget available.",

          progress:
            savingsProgress,

          completed:
            expenses.length > 0 &&
            currentBudget > 0 &&
            currentBalance >=
              requiredSavings,

          claimed:
            claimedQuestIds.includes(
              "savings-builder"
            ),

          rewardXp:
            QUEST_REWARDS[
              "savings-builder"
            ].xp,

          rewardCoins:
            QUEST_REWARDS[
              "savings-builder"
            ].coins,
        },
      ];
    }, [
      expenses.length,
      currentBudget,
      currentBalance,
      budgetUsage,
      claimedQuestIds,
    ]);

  /* =========================
     XP
  ========================= */

  const xp = useMemo(() => {
    const expenseXp =
      expenses.length * 5;

    const questXp =
      claimedQuestIds.reduce(
        (
          total,
          questId
        ) => {
          const reward =
            QUEST_REWARDS[questId];

          return (
            total +
            (reward?.xp ?? 0)
          );
        },
        0
      );

    const monsterXp =
      monsterRewardClaimed
        ? MONSTER_REWARD.xp
        : 0;

    return (
      expenseXp +
      questXp +
      monsterXp
    );
  }, [
    expenses.length,
    claimedQuestIds,
    monsterRewardClaimed,
  ]);

  /* =========================
     COINS
  ========================= */

  const coins = useMemo(() => {
    const questCoins =
      claimedQuestIds.reduce(
        (
          total,
          questId
        ) => {
          const reward =
            QUEST_REWARDS[questId];

          return (
            total +
            (reward?.coins ?? 0)
          );
        },
        0
      );

    const monsterCoins =
      monsterRewardClaimed
        ? MONSTER_REWARD.coins
        : 0;

    return (
      questCoins +
      monsterCoins
    );
  }, [
    claimedQuestIds,
    monsterRewardClaimed,
  ]);

  /* =========================
     LEVEL
  ========================= */

  const level =
    Math.floor(
      xp / XP_PER_LEVEL
    ) + 1;

  const currentLevelXp =
    xp % XP_PER_LEVEL;

  const levelProgress =
    Math.round(
      (currentLevelXp /
        XP_PER_LEVEL) *
        100
    );

  /* =========================
     CITY HEALTH
  ========================= */

  const cityHealth =
    !hasFinancialData
      ? 0
      : clamp(
          100 -
            Math.max(
              0,
              budgetUsage - 50
            ) *
              2,
          0,
          100
        );

  /* =========================
     CLAIM QUEST
  ========================= */

  const claimQuest = useCallback(
    (
      questId: string
    ) => {
      const quest = quests.find(
        (item) =>
          item.id === questId
      );

      if (
        !quest ||
        !quest.completed ||
        quest.claimed
      ) {
        return false;
      }

      setClaimedQuestIds(
        (current) => [
          ...current,
          quest.id,
        ]
      );

      return true;
    },
    [quests]
  );

  /* =========================
     MONSTER
  ========================= */

  const monster =
    useMemo<WeeklyMonster>(() => {
      const trackingDamage =
        Math.min(
          expenses.length * 55,
          300
        );

      const disciplineDamage =
        expenses.length > 0 &&
        currentBudget > 0
          ? clamp(
              100 -
                budgetUsage,
              0,
              100
            ) * 5
          : 0;

      const questDamage =
        claimedQuestIds.length *
        100;

      const totalDamage = clamp(
        Math.round(
          trackingDamage +
            disciplineDamage +
            questDamage
        ),
        0,
        1000
      );

      const hp = Math.max(
        1000 - totalDamage,
        0
      );

      return {
        name:
          "Impulse Monster",

        description:
          "Defeat the monster by tracking expenses, completing quests and staying within your budget.",

        maxHp: 1000,

        hp,

        damage: totalDamage,

        defeated:
          hp === 0 ||
          monsterRewardClaimed,

        rewardClaimed:
          monsterRewardClaimed,

        rewardXp:
          MONSTER_REWARD.xp,

        rewardCoins:
          MONSTER_REWARD.coins,
      };
    }, [
      expenses.length,
      currentBudget,
      budgetUsage,
      claimedQuestIds.length,
      monsterRewardClaimed,
    ]);

  /* =========================
     CLAIM MONSTER REWARD
  ========================= */

  const claimMonsterReward =
    useCallback(() => {
      if (
        !monster.defeated ||
        monsterRewardClaimed
      ) {
        return false;
      }

      setMonsterRewardClaimed(
        true
      );

      return true;
    }, [
      monster.defeated,
      monsterRewardClaimed,
    ]);

  /* =========================
     RESET GAME
  ========================= */

  const resetGameProgress =
    useCallback(() => {
      setClaimedQuestIds([]);

      setMonsterRewardClaimed(
        false
      );

      window.sessionStorage.removeItem(
        storageKey
      );
    }, [storageKey]);

  /* =========================
     VALUE
  ========================= */

  const value =
    useMemo<GameContextType>(
      () => ({
        xp,

        coins,

        streak,

        level,

        currentLevelXp,

        xpRequiredForNextLevel:
          XP_PER_LEVEL,

        levelProgress,

        cityHealth,

        hasFinancialData,

        quests,

        claimQuest,

        monster,

        claimMonsterReward,

        resetGameProgress,
      }),
      [
        xp,
        coins,
        streak,
        level,
        currentLevelXp,
        levelProgress,
        cityHealth,
        hasFinancialData,
        quests,
        claimQuest,
        monster,
        claimMonsterReward,
        resetGameProgress,
      ]
    );

  return (
    <GameContext.Provider
      value={value}
    >
      {children}
    </GameContext.Provider>
  );
}

/* =========================
   HOOK
========================= */

export function useGame() {
  const context =
    useContext(GameContext);

  if (!context) {
    throw new Error(
      "useGame must be used inside GameProvider"
    );
  }

  return context;
}