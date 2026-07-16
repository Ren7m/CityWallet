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

import { useBudget } from "@/context/BudgetContext";

type GameQuest = {
  id: string;
  title: string;
};

type MonsterData = {
  name: string;
  maxHp: number;
  hp: number;
  damage: number;
  defeated: boolean;
  rewardClaimed: boolean;
  rewardXp: number;
  rewardCoins: number;
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

  monsterHp: number;
  monsterMaxHp: number;
  monsterDefeated: boolean;

  availableAttacks: number;
  parkUnlocked: boolean;

  monster: MonsterData;

  attackMonster: () => boolean;
  claimMonsterReward: () => boolean;

  quests: GameQuest[];
  claimQuest: (
    questId: string
  ) => boolean;

  resetGameProgress: () => void;
};

type StoredGameData = {
  xp: number;
  coins: number;
  monsterHp: number;
  availableAttacks: number;
  processedExpenseIds: string[];
  unlockedUpgrades: string[];
  rewardGranted: boolean;
};

const GameContext =
  createContext<GameContextType | null>(
    null
  );

const STORAGE_KEY =
  "fincity-game-progress";

const MONSTER_MAX_HP = 100;
const ATTACK_DAMAGE = 35;
const ATTACKS_PER_EXPENSE = 3;
const XP_PER_EXPENSE = 10;
const XP_PER_LEVEL = 250;

const MONSTER_REWARD_XP = 250;
const MONSTER_REWARD_COINS = 100;

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

export function GameProvider({
  children,
}: {
  children: ReactNode;
}) {
  const {
    budget,
    expenses,
    totalSpent,
  } = useBudget();

  const [xp, setXp] =
    useState(0);

  const [coins, setCoins] =
    useState(0);

  const [
    monsterHp,
    setMonsterHp,
  ] = useState(
    MONSTER_MAX_HP
  );

  const [
    availableAttacks,
    setAvailableAttacks,
  ] = useState(0);

  const [
    processedExpenseIds,
    setProcessedExpenseIds,
  ] = useState<string[]>([]);

  const [
    unlockedUpgrades,
    setUnlockedUpgrades,
  ] = useState<string[]>([]);

  const [
    rewardGranted,
    setRewardGranted,
  ] = useState(false);

  const [
    isReady,
    setIsReady,
  ] = useState(false);

  useEffect(() => {
    const savedData =
      window.localStorage.getItem(
        STORAGE_KEY
      );

    if (savedData) {
      try {
        const parsed =
          JSON.parse(
            savedData
          ) as Partial<StoredGameData>;

        const savedXp =
          Number(parsed.xp);

        const savedCoins =
          Number(parsed.coins);

        const savedMonsterHp =
          Number(
            parsed.monsterHp
          );

        const savedAttacks =
          Number(
            parsed.availableAttacks
          );

        setXp(
          Number.isFinite(savedXp)
            ? Math.max(savedXp, 0)
            : 0
        );

        setCoins(
          Number.isFinite(savedCoins)
            ? Math.max(
                savedCoins,
                0
              )
            : 0
        );

        setMonsterHp(
          Number.isFinite(
            savedMonsterHp
          )
            ? clamp(
                savedMonsterHp,
                0,
                MONSTER_MAX_HP
              )
            : MONSTER_MAX_HP
        );

        setAvailableAttacks(
          Number.isFinite(
            savedAttacks
          )
            ? Math.max(
                savedAttacks,
                0
              )
            : 0
        );

        setProcessedExpenseIds(
          Array.isArray(
            parsed.processedExpenseIds
          )
            ? parsed.processedExpenseIds.map(
                String
              )
            : []
        );

        setUnlockedUpgrades(
          Array.isArray(
            parsed.unlockedUpgrades
          )
            ? parsed.unlockedUpgrades
            : []
        );

        setRewardGranted(
          Boolean(
            parsed.rewardGranted
          )
        );
      } catch {
        window.localStorage.removeItem(
          STORAGE_KEY
        );
      }
    }

    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    const gameData: StoredGameData = {
      xp,
      coins,
      monsterHp,
      availableAttacks,
      processedExpenseIds,
      unlockedUpgrades,
      rewardGranted,
    };

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(gameData)
    );
  }, [
    xp,
    coins,
    monsterHp,
    availableAttacks,
    processedExpenseIds,
    unlockedUpgrades,
    rewardGranted,
    isReady,
  ]);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    const currentExpenses =
      Array.isArray(expenses)
        ? expenses
        : [];

    const newExpenseIds =
      currentExpenses
        .map((expense) =>
          String(expense.id)
        )
        .filter(
          (expenseId) =>
            !processedExpenseIds.includes(
              expenseId
            )
        );

    if (
      newExpenseIds.length === 0
    ) {
      return;
    }

    setProcessedExpenseIds(
      (current) => [
        ...current,
        ...newExpenseIds,
      ]
    );

    setAvailableAttacks(
      (current) =>
        current +
        newExpenseIds.length *
          ATTACKS_PER_EXPENSE
    );

    setXp(
      (current) =>
        current +
        newExpenseIds.length *
          XP_PER_EXPENSE
    );
  }, [
    expenses,
    processedExpenseIds,
    isReady,
  ]);

  const safeBudget =
    Number(budget) || 0;

  const safeSpent =
    Number(totalSpent) || 0;

  const budgetUsage =
    safeBudget > 0
      ? (safeSpent /
          safeBudget) *
        100
      : 0;

  const cityHealth =
    safeBudget > 0
      ? clamp(
          Math.round(
            100 -
              Math.max(
                budgetUsage - 60,
                0
              ) *
                2
          ),
          0,
          100
        )
      : 0;

  const monsterDefeated =
    monsterHp <= 0;

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

  const streak =
    expenses.length > 0
      ? 1
      : 0;

  const parkUnlocked =
    unlockedUpgrades.includes(
      "city-park"
    );

  const attackMonster =
    useCallback(() => {
      if (
        availableAttacks <= 0 ||
        monsterHp <= 0
      ) {
        return false;
      }

      const nextMonsterHp =
        Math.max(
          monsterHp -
            ATTACK_DAMAGE,
          0
        );

      setAvailableAttacks(
        (current) =>
          Math.max(
            current - 1,
            0
          )
      );

      setMonsterHp(
        nextMonsterHp
      );

      if (
        nextMonsterHp === 0 &&
        !rewardGranted
      ) {
        setRewardGranted(true);

        setXp(
          (current) =>
            current +
            MONSTER_REWARD_XP
        );

        setCoins(
          (current) =>
            current +
            MONSTER_REWARD_COINS
        );

        setUnlockedUpgrades(
          (current) =>
            current.includes(
              "city-park"
            )
              ? current
              : [
                  ...current,
                  "city-park",
                ]
        );
      }

      return true;
    }, [
      availableAttacks,
      monsterHp,
      rewardGranted,
    ]);

  const claimMonsterReward =
    useCallback(() => {
      return false;
    }, []);

  const resetGameProgress =
    useCallback(() => {
      setXp(0);
      setCoins(0);

      setMonsterHp(
        MONSTER_MAX_HP
      );

      setAvailableAttacks(0);

      setProcessedExpenseIds(
        []
      );

      setUnlockedUpgrades(
        []
      );

      setRewardGranted(false);

      window.localStorage.removeItem(
        STORAGE_KEY
      );
    }, []);

  const monster =
    useMemo<MonsterData>(
      () => ({
        name:
          "Weekly Spending Monster",

        maxHp:
          MONSTER_MAX_HP,

        hp: monsterHp,

        damage:
          MONSTER_MAX_HP -
          monsterHp,

        defeated:
          monsterDefeated,

        rewardClaimed:
          rewardGranted,

        rewardXp:
          MONSTER_REWARD_XP,

        rewardCoins:
          MONSTER_REWARD_COINS,
      }),
      [
        monsterHp,
        monsterDefeated,
        rewardGranted,
      ]
    );

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

        monsterHp,

        monsterMaxHp:
          MONSTER_MAX_HP,

        monsterDefeated,

        availableAttacks,

        parkUnlocked,

        monster,

        attackMonster,

        claimMonsterReward,

        quests: [],

        claimQuest: () =>
          false,

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
        monsterHp,
        monsterDefeated,
        availableAttacks,
        parkUnlocked,
        monster,
        attackMonster,
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