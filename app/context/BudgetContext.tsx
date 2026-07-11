"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

export type Expense = {
  id: number;
  name: string;
  amount: number;
  category: string;
  createdAt?: string;
};

export type FinancialGoal = {
  title?: string;
  type?: string;
  targetAmount?: number;
};

type NewExpense = {
  name: string;
  amount: number;
  category: string;
  createdAt?: string;
};

type BudgetContextType = {
  monthlySalary: number;
  setMonthlySalary:
    Dispatch<SetStateAction<number>>;

  budget: number;
  setBudget:
    Dispatch<SetStateAction<number>>;

  expenses: Expense[];
  setExpenses:
    Dispatch<SetStateAction<Expense[]>>;

  goal: FinancialGoal | null;
  setGoal:
    Dispatch<
      SetStateAction<
        FinancialGoal | null
      >
    >;

  addExpense: (
    expense: NewExpense
  ) => void;

  removeExpense: (
    id: number | string
  ) => void;

  clearExpenses: () => void;

  totalSpent: number;
  balance: number;
  salaryRemaining: number;
  budgetUsage: number;

  isReady: boolean;
};

type StoredFinance = {
  monthlySalary: number;
  budget: number;
  expenses: Expense[];
  goal: FinancialGoal | null;
};

const BudgetContext =
  createContext<BudgetContextType | null>(
    null
  );

const STORAGE_KEY =
  "fincity-finance-data";

export function BudgetProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [
    monthlySalary,
    setMonthlySalary,
  ] = useState(0);

  const [budget, setBudget] =
    useState(0);

  const [expenses, setExpenses] =
    useState<Expense[]>([]);

  const [goal, setGoal] =
    useState<FinancialGoal | null>(null);

  const [isReady, setIsReady] =
    useState(false);

  useEffect(() => {
    const storedData =
      window.sessionStorage.getItem(
        STORAGE_KEY
      );

    if (storedData) {
      try {
        const parsed =
          JSON.parse(
            storedData
          ) as StoredFinance;

        setMonthlySalary(
          Number(
            parsed.monthlySalary || 0
          )
        );

        setBudget(
          Number(parsed.budget || 0)
        );

        setExpenses(
          Array.isArray(parsed.expenses)
            ? parsed.expenses
            : []
        );

        setGoal(parsed.goal ?? null);
      } catch {
        window.sessionStorage.removeItem(
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

    const financeData: StoredFinance = {
      monthlySalary,
      budget,
      expenses,
      goal,
    };

    window.sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(financeData)
    );
  }, [
    monthlySalary,
    budget,
    expenses,
    goal,
    isReady,
  ]);

  const addExpense = useCallback(
    (expense: NewExpense) => {
      const amount = Number(
        expense.amount
      );

      if (
        !expense.name.trim() ||
        !expense.category.trim() ||
        !Number.isFinite(amount) ||
        amount <= 0
      ) {
        return;
      }

      const newExpense: Expense = {
        id: Date.now(),
        name: expense.name.trim(),
        amount,
        category:
          expense.category.trim(),
        createdAt:
          expense.createdAt ??
          new Date().toISOString(),
      };

      setExpenses((current) => [
        ...current,
        newExpense,
      ]);
    },
    []
  );

  const removeExpense = useCallback(
    (id: number | string) => {
      setExpenses((current) =>
        current.filter(
          (expense) =>
            String(expense.id) !==
            String(id)
        )
      );
    },
    []
  );

  const clearExpenses =
    useCallback(() => {
      setExpenses([]);
    }, []);

  const totalSpent = useMemo(() => {
    return expenses.reduce(
      (total, expense) =>
        total +
        Number(expense.amount || 0),
      0
    );
  }, [expenses]);

  const balance =
    budget - totalSpent;

  const salaryRemaining =
    monthlySalary - totalSpent;

  const budgetUsage =
    budget > 0
      ? Math.round(
          (totalSpent / budget) * 100
        )
      : 0;

  const value =
    useMemo<BudgetContextType>(
      () => ({
        monthlySalary,
        setMonthlySalary,

        budget,
        setBudget,

        expenses,
        setExpenses,

        goal,
        setGoal,

        addExpense,
        removeExpense,
        clearExpenses,

        totalSpent,
        balance,
        salaryRemaining,
        budgetUsage,

        isReady,
      }),
      [
        monthlySalary,
        budget,
        expenses,
        goal,
        addExpense,
        removeExpense,
        clearExpenses,
        totalSpent,
        balance,
        salaryRemaining,
        budgetUsage,
        isReady,
      ]
    );

  return (
    <BudgetContext.Provider
      value={value}
    >
      {children}
    </BudgetContext.Provider>
  );
}

export function useBudget() {
  const context =
    useContext(BudgetContext);

  if (!context) {
    throw new Error(
      "useBudget must be used inside BudgetProvider"
    );
  }

  return context;
}