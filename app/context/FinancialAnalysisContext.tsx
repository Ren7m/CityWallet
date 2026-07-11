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

export type FinancialGoal =
  | "save"
  | "control"
  | "purchase"
  | "emergency";

export type SpendingBehavior =
  | "planned"
  | "balanced"
  | "impulsive";

export type SavingHabit =
  | "monthly"
  | "sometimes"
  | "rarely";

export type ChallengePreference =
  | "saving"
  | "spending"
  | "tracking";

export type SurveyAnswers = {
  financialGoal: FinancialGoal;
  spendingBehavior: SpendingBehavior;
  savingHabit: SavingHabit;
  challengePreference: ChallengePreference;
};

export type CategorySummary = {
  name: string;
  amount: number;
  percentage: number;
};

export type FinancialRecommendation = {
  title: string;
  description: string;
  action: string;
  impact: "positive" | "warning" | "danger";
};

export type WeeklyChallenge = {
  title: string;
  description: string;
  progress: number;
  target: string;
  rewardXp: number;
  rewardCoins: number;
  completed: boolean;
};

export type MonthlySnapshot = {
  month: string;
  income: number;
  budget: number;
  spent: number;
  remaining: number;
};

export type CityFinancialState =
  | "flourishing"
  | "stable"
  | "warning"
  | "critical";

type ExpenseLike = {
  id?: string | number;
  name?: string;
  label?: string;
  description?: string;
  category?: string;
  amount?: number | string;
  date?: string;
};

type BudgetContextData = {
  monthlySalary?: number;
  income?: number;
  budget?: number;
  expenses?: ExpenseLike[];
  totalSpent?: number;
  balance?: number;
};

type FinancialAnalysisContextType = {
  survey: SurveyAnswers;
  surveyCompleted: boolean;
  saveSurvey: (answers: SurveyAnswers) => void;

  monthlyIncome: number;
  monthlyBudget: number;
  totalSpent: number;
  remainingBalance: number;

  budgetUsage: number;
  savingsAmount: number;
  savingsRate: number;
  safeDailyLimit: number;
  daysLeftInMonth: number;

  financialScore: number;
  financialLevel: number;
  financialProfile: string;
  riskLevel: "Low" | "Medium" | "High";

  cityState: CityFinancialState;
  cityMessage: string;

  categories: CategorySummary[];
  topCategory: CategorySummary | null;

  recommendations: FinancialRecommendation[];
  weeklyChallenge: WeeklyChallenge;
  monthlyHistory: MonthlySnapshot[];

  behaviorSummary: string;
};

const FinancialAnalysisContext =
  createContext<FinancialAnalysisContextType | null>(
    null
  );

const SURVEY_STORAGE_KEY =
  "citywallet-financial-survey";

const HISTORY_STORAGE_KEY =
  "citywallet-monthly-history";

const DEFAULT_SURVEY: SurveyAnswers = {
  financialGoal: "control",
  spendingBehavior: "balanced",
  savingHabit: "sometimes",
  challengePreference: "spending",
};

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  Housing: [
    "rent",
    "house",
    "housing",
    "electricity",
    "water",
    "internet",
    "utility",
    "إيجار",
    "بيت",
    "كهرباء",
    "ماء",
    "انترنت",
    "فاتورة",
  ],

  Food: [
    "food",
    "restaurant",
    "cafe",
    "coffee",
    "grocery",
    "meal",
    "مطعم",
    "كافيه",
    "قهوة",
    "طعام",
    "بقالة",
    "وجبة",
  ],

  Transport: [
    "fuel",
    "petrol",
    "uber",
    "taxi",
    "car",
    "transport",
    "bus",
    "بنزين",
    "اوبر",
    "تاكسي",
    "سيارة",
    "مواصلات",
    "باص",
  ],

  Shopping: [
    "shopping",
    "clothes",
    "amazon",
    "gift",
    "electronics",
    "mall",
    "تسوق",
    "ملابس",
    "هدية",
    "الكترونيات",
    "مول",
  ],

  Entertainment: [
    "cinema",
    "movie",
    "game",
    "netflix",
    "subscription",
    "entertainment",
    "سينما",
    "فيلم",
    "ألعاب",
    "اشتراك",
    "ترفيه",
  ],

  Health: [
    "hospital",
    "pharmacy",
    "medicine",
    "doctor",
    "gym",
    "health",
    "مستشفى",
    "صيدلية",
    "دواء",
    "طبيب",
    "نادي",
    "صحة",
  ],

  Education: [
    "course",
    "book",
    "university",
    "school",
    "education",
    "دورة",
    "كتاب",
    "جامعة",
    "مدرسة",
    "تعليم",
  ],

  Savings: [
    "saving",
    "savings",
    "investment",
    "deposit",
    "ادخار",
    "استثمار",
  ],
};

function toNumber(value: unknown) {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : 0;
}

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

function normalizeCategory(category: string) {
  const value = category
    .trim()
    .toLowerCase();

  const categories: Record<string, string> = {
    housing: "Housing",
    rent: "Housing",
    سكن: "Housing",
    إيجار: "Housing",

    food: "Food",
    restaurant: "Food",
    طعام: "Food",
    مطاعم: "Food",

    transport: "Transport",
    transportation: "Transport",
    مواصلات: "Transport",
    نقل: "Transport",

    shopping: "Shopping",
    تسوق: "Shopping",

    entertainment: "Entertainment",
    ترفيه: "Entertainment",

    health: "Health",
    صحة: "Health",

    education: "Education",
    تعليم: "Education",

    savings: "Savings",
    saving: "Savings",
    ادخار: "Savings",

    other: "Other",
    أخرى: "Other",
  };

  return categories[value] ?? "";
}

function classifyExpense(expense: ExpenseLike) {
  const explicitCategory =
    normalizeCategory(
      expense.category ?? ""
    );

  if (explicitCategory) {
    return explicitCategory;
  }

  const expenseText = [
    expense.name,
    expense.label,
    expense.description,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  for (const [category, keywords] of Object.entries(
    CATEGORY_KEYWORDS
  )) {
    const matched = keywords.some((keyword) =>
      expenseText.includes(
        keyword.toLowerCase()
      )
    );

    if (matched) {
      return category;
    }
  }

  return "Other";
}

function getDaysLeftInMonth() {
  const today = new Date();

  const finalDay = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0
  ).getDate();

  return Math.max(
    finalDay - today.getDate() + 1,
    1
  );
}

function getCurrentMonthLabel() {
  return new Date().toLocaleDateString(
    "en-US",
    {
      month: "short",
      year: "numeric",
    }
  );
}

export function FinancialAnalysisProvider({
  children,
}: {
  children: ReactNode;
}) {
  const budgetContext =
    useBudget() as BudgetContextData;

  const expenses =
    Array.isArray(budgetContext.expenses)
      ? budgetContext.expenses
      : [];

  const monthlyIncome = toNumber(
    budgetContext.monthlySalary ??
      budgetContext.income
  );

  const monthlyBudget = toNumber(
    budgetContext.budget
  );

  const calculatedSpent = expenses.reduce(
    (total, expense) =>
      total + toNumber(expense.amount),
    0
  );

  const totalSpent =
    budgetContext.totalSpent !== undefined
      ? toNumber(
          budgetContext.totalSpent
        )
      : calculatedSpent;

  const remainingBalance =
    budgetContext.balance !== undefined
      ? toNumber(budgetContext.balance)
      : monthlyBudget - totalSpent;

  const [survey, setSurvey] =
    useState<SurveyAnswers>(
      DEFAULT_SURVEY
    );

  const [
    surveyCompleted,
    setSurveyCompleted,
  ] = useState(false);

  const [
    monthlyHistory,
    setMonthlyHistory,
  ] = useState<MonthlySnapshot[]>(
    []
  );

  useEffect(() => {
    const storedSurvey =
      window.localStorage.getItem(
        SURVEY_STORAGE_KEY
      );

    if (!storedSurvey) {
      return;
    }

    try {
      const parsed =
        JSON.parse(
          storedSurvey
        ) as SurveyAnswers;

      setSurvey(parsed);
      setSurveyCompleted(true);
    } catch {
      window.localStorage.removeItem(
        SURVEY_STORAGE_KEY
      );
    }
  }, []);

  useEffect(() => {
    const storedHistory =
      window.localStorage.getItem(
        HISTORY_STORAGE_KEY
      );

    if (!storedHistory) {
      return;
    }

    try {
      const parsed =
        JSON.parse(
          storedHistory
        ) as MonthlySnapshot[];

      if (Array.isArray(parsed)) {
        setMonthlyHistory(parsed);
      }
    } catch {
      window.localStorage.removeItem(
        HISTORY_STORAGE_KEY
      );
    }
  }, []);

  useEffect(() => {
    if (
      monthlyIncome <= 0 &&
      monthlyBudget <= 0 &&
      totalSpent <= 0
    ) {
      return;
    }

    const currentMonth =
      getCurrentMonthLabel();

    const currentSnapshot: MonthlySnapshot = {
      month: currentMonth,
      income: monthlyIncome,
      budget: monthlyBudget,
      spent: totalSpent,
      remaining: remainingBalance,
    };

    setMonthlyHistory((current) => {
      const existingIndex =
        current.findIndex(
          (item) =>
            item.month === currentMonth
        );

      let updated: MonthlySnapshot[];

      if (existingIndex >= 0) {
        updated = current.map(
          (item, index) =>
            index === existingIndex
              ? currentSnapshot
              : item
        );
      } else {
        updated = [
          ...current,
          currentSnapshot,
        ];
      }

      const limited =
        updated.slice(-6);

      window.localStorage.setItem(
        HISTORY_STORAGE_KEY,
        JSON.stringify(limited)
      );

      return limited;
    });
  }, [
    monthlyIncome,
    monthlyBudget,
    totalSpent,
    remainingBalance,
  ]);

  const saveSurvey = useCallback(
    (answers: SurveyAnswers) => {
      setSurvey(answers);
      setSurveyCompleted(true);

      window.localStorage.setItem(
        SURVEY_STORAGE_KEY,
        JSON.stringify(answers)
      );
    },
    []
  );

  const budgetUsage =
    monthlyBudget > 0
      ? Math.round(
          (totalSpent /
            monthlyBudget) *
            100
        )
      : 0;

  const savingsAmount = Math.max(
    monthlyIncome - totalSpent,
    0
  );

  const savingsRate =
    monthlyIncome > 0
      ? Math.round(
          (savingsAmount /
            monthlyIncome) *
            100
        )
      : 0;

  const daysLeftInMonth =
    getDaysLeftInMonth();

  const safeDailyLimit =
    remainingBalance > 0
      ? Math.floor(
          remainingBalance /
            daysLeftInMonth
        )
      : 0;

  const categories =
    useMemo<CategorySummary[]>(() => {
      const categoryTotals =
        expenses.reduce<
          Record<string, number>
        >((result, expense) => {
          const category =
            classifyExpense(expense);

          result[category] =
            (result[category] ?? 0) +
            toNumber(expense.amount);

          return result;
        }, {});

      return Object.entries(
        categoryTotals
      )
        .map(([name, amount]) => ({
          name,
          amount,
          percentage:
            totalSpent > 0
              ? Math.round(
                  (amount /
                    totalSpent) *
                    100
                )
              : 0,
        }))
        .filter(
          (category) =>
            category.amount > 0
        )
        .sort(
          (first, second) =>
            second.amount -
            first.amount
        );
    }, [expenses, totalSpent]);

  const topCategory =
    categories[0] ?? null;

  const financialScore =
    useMemo(() => {
      if (
        monthlyBudget <= 0 ||
        monthlyIncome <= 0
      ) {
        return 0;
      }

      let score = 0;

      if (budgetUsage <= 50) {
        score += 40;
      } else if (
        budgetUsage <= 70
      ) {
        score += 34;
      } else if (
        budgetUsage <= 85
      ) {
        score += 25;
      } else if (
        budgetUsage <= 100
      ) {
        score += 15;
      } else {
        score += 3;
      }

      if (savingsRate >= 20) {
        score += 25;
      } else if (
        savingsRate >= 10
      ) {
        score += 18;
      } else if (
        savingsRate >= 5
      ) {
        score += 10;
      } else {
        score += 3;
      }

      if (expenses.length >= 8) {
        score += 15;
      } else if (
        expenses.length >= 4
      ) {
        score += 10;
      } else if (
        expenses.length > 0
      ) {
        score += 5;
      }

      if (
        survey.spendingBehavior ===
        "planned"
      ) {
        score += 10;
      } else if (
        survey.spendingBehavior ===
        "balanced"
      ) {
        score += 6;
      }

      if (
        survey.savingHabit ===
        "monthly"
      ) {
        score += 10;
      } else if (
        survey.savingHabit ===
        "sometimes"
      ) {
        score += 5;
      }

      return clamp(score, 0, 100);
    }, [
      monthlyBudget,
      monthlyIncome,
      budgetUsage,
      savingsRate,
      expenses.length,
      survey,
    ]);

  const riskLevel:
    | "Low"
    | "Medium"
    | "High" =
    financialScore >= 70
      ? "Low"
      : financialScore >= 40
        ? "Medium"
        : "High";

  const financialProfile =
    financialScore >= 85
      ? "Strategic Saver"
      : financialScore >= 70
        ? "Balanced Builder"
        : financialScore >= 50
          ? "Budget Explorer"
          : financialScore >= 25
            ? "Recovery Planner"
            : "Financial Beginner";

  const financialLevel = clamp(
    Math.floor(
      financialScore / 20
    ) + 1,
    1,
    5
  );

  const cityState: CityFinancialState =
    financialScore >= 75
      ? "flourishing"
      : financialScore >= 55
        ? "stable"
        : financialScore >= 30
          ? "warning"
          : "critical";

  const cityMessage =
    cityState === "flourishing"
      ? "Your city is flourishing because your financial behavior is healthy."
      : cityState === "stable"
        ? "Your city is stable. Continue controlling your spending."
        : cityState === "warning"
          ? "Your city needs attention because spending risk is increasing."
          : "Your city is in recovery mode because the budget is under high pressure.";

  const weeklyChallenge =
    useMemo<WeeklyChallenge>(() => {
      if (expenses.length < 5) {
        const progress = clamp(
          Math.round(
            (expenses.length / 5) *
              100
          ),
          0,
          100
        );

        return {
          title:
            "Track Five Expenses",
          description:
            "Record five expenses to improve your financial analysis.",
          progress,
          target: `${expenses.length}/5 expenses`,
          rewardXp: 60,
          rewardCoins: 20,
          completed:
            expenses.length >= 5,
        };
      }

      if (
        remainingBalance < 0 ||
        budgetUsage > 100
      ) {
        const progress = clamp(
          Math.round(
            100 -
              Math.max(
                budgetUsage - 100,
                0
              ) *
                4
          ),
          0,
          100
        );

        return {
          title:
            "Budget Recovery Week",
          description:
            "Avoid optional purchases and reduce spending in your highest category.",
          progress,
          target:
            "Return spending to the monthly budget",
          rewardXp: 180,
          rewardCoins: 60,
          completed:
            remainingBalance >= 0,
        };
      }

      if (
        survey.financialGoal ===
          "save" ||
        survey.financialGoal ===
          "emergency"
      ) {
        const targetRate = 15;

        const progress = clamp(
          Math.round(
            (savingsRate /
              targetRate) *
              100
          ),
          0,
          100
        );

        return {
          title:
            "15% Savings Challenge",
          description:
            "Keep at least 15% of your monthly income as savings.",
          progress,
          target: `${savingsRate}% / ${targetRate}%`,
          rewardXp: 150,
          rewardCoins: 50,
          completed:
            savingsRate >= targetRate,
        };
      }

      if (
        survey.spendingBehavior ===
        "impulsive"
      ) {
        const targetUsage = 70;

        const progress =
          budgetUsage <= targetUsage
            ? 100
            : clamp(
                100 -
                  (budgetUsage -
                    targetUsage) *
                    3,
                0,
                100
              );

        return {
          title:
            "Control Impulse Spending",
          description:
            "Keep total spending below 70% of your monthly budget.",
          progress,
          target: `${budgetUsage}% / ${targetUsage}%`,
          rewardXp: 140,
          rewardCoins: 45,
          completed:
            budgetUsage <= targetUsage,
        };
      }

      const targetUsage = 75;

      const progress =
        budgetUsage <= targetUsage
          ? 100
          : clamp(
              100 -
                (budgetUsage -
                  targetUsage) *
                  4,
              0,
              100
            );

      return {
        title:
          "Stay in the Safe Zone",
        description:
          "Keep your monthly spending below 75% of your budget.",
        progress,
        target: `${budgetUsage}% / ${targetUsage}%`,
        rewardXp: 120,
        rewardCoins: 40,
        completed:
          budgetUsage <= targetUsage,
      };
    }, [
      expenses.length,
      remainingBalance,
      budgetUsage,
      savingsRate,
      survey,
    ]);

  const recommendations =
    useMemo<
      FinancialRecommendation[]
    >(() => {
      const result: FinancialRecommendation[] =
        [];

      if (monthlyIncome <= 0) {
        result.push({
          title:
            "Enter Your Monthly Income",
          description:
            "Income is required to calculate your savings rate and financial capacity.",
          action:
            "Enter your monthly income in the budget page.",
          impact: "warning",
        });
      }

      if (monthlyBudget <= 0) {
        result.push({
          title:
            "Set a Monthly Budget",
          description:
            "A monthly budget gives CityWallet a clear spending limit.",
          action:
            "Set a realistic monthly budget before recording expenses.",
          impact: "warning",
        });
      }

      if (
        monthlyIncome > 0 &&
        monthlyBudget > monthlyIncome
      ) {
        result.push({
          title:
            "Review Your Budget Limit",
          description:
            "Your monthly budget is higher than your monthly income.",
          action:
            "Reduce the budget so it does not exceed your income.",
          impact: "danger",
        });
      }

      if (expenses.length === 0) {
        result.push({
          title:
            "Start Tracking Expenses",
          description:
            "No spending behavior can be analyzed before expenses are recorded.",
          action:
            "Record your first expense with a clear name and category.",
          impact: "warning",
        });
      }

      if (remainingBalance < 0) {
        result.push({
          title:
            "Start a Recovery Plan",
          description: `You exceeded your budget by ${Math.abs(
            remainingBalance
          ).toLocaleString(
            "en-US"
          )} SAR.`,
          action:
            "Pause optional spending for seven days and focus on essential expenses.",
          impact: "danger",
        });
      } else if (
        budgetUsage >= 85
      ) {
        result.push({
          title:
            "Spending Risk Is High",
          description: `You used ${budgetUsage}% of your monthly budget.`,
          action: `Keep daily spending below ${safeDailyLimit.toLocaleString(
            "en-US"
          )} SAR.`,
          impact: "danger",
        });
      } else if (
        budgetUsage >= 70
      ) {
        result.push({
          title:
            "Protect Your Remaining Budget",
          description: `You have used ${budgetUsage}% of your monthly budget.`,
          action: `Limit daily spending to approximately ${safeDailyLimit.toLocaleString(
            "en-US"
          )} SAR.`,
          impact: "warning",
        });
      }

      if (
        topCategory &&
        topCategory.percentage >= 40
      ) {
        const reductionTarget =
          Math.max(
            Math.round(
              topCategory.amount * 0.1
            ),
            20
          );

        result.push({
          title: `Reduce ${topCategory.name} Spending`,
          description: `${topCategory.name} represents ${topCategory.percentage}% of your total spending.`,
          action: `Try reducing this category by ${reductionTarget.toLocaleString(
            "en-US"
          )} SAR.`,
          impact: "warning",
        });
      }

      if (
        monthlyIncome > 0 &&
        savingsRate < 10
      ) {
        const savingTarget =
          Math.max(
            Math.round(
              monthlyIncome * 0.1
            ),
            50
          );

        result.push({
          title:
            "Increase Your Savings Rate",
          description: `Your current savings rate is ${savingsRate}%.`,
          action: `Reserve ${savingTarget.toLocaleString(
            "en-US"
          )} SAR before optional spending.`,
          impact: "warning",
        });
      }

      if (
        survey.spendingBehavior ===
        "impulsive"
      ) {
        result.push({
          title:
            "Use the 24-Hour Rule",
          description:
            "Your survey indicates that some purchases may be impulsive.",
          action:
            "Wait 24 hours before completing a non-essential purchase.",
          impact: "warning",
        });
      }

      if (
        financialScore >= 70
      ) {
        result.push({
          title:
            "Maintain Your Healthy Progress",
          description: `Your financial score is ${financialScore}/100.`,
          action:
            "Continue tracking expenses and complete the weekly challenge.",
          impact: "positive",
        });
      }

      return result.slice(0, 4);
    }, [
      monthlyIncome,
      monthlyBudget,
      expenses.length,
      remainingBalance,
      budgetUsage,
      safeDailyLimit,
      topCategory,
      savingsRate,
      survey.spendingBehavior,
      financialScore,
    ]);

  const behaviorSummary =
    useMemo(() => {
      if (
        monthlyIncome <= 0 ||
        monthlyBudget <= 0
      ) {
        return "CityWallet needs your income and monthly budget to complete the financial analysis.";
      }

      if (remainingBalance < 0) {
        return `Your current behavior has high financial risk. Spending exceeded the budget, and ${
          topCategory?.name ??
          "your highest category"
        } requires immediate attention.`;
      }

      if (financialScore >= 75) {
        return `Your financial behavior is healthy. You are using ${budgetUsage}% of your budget and saving approximately ${savingsRate}% of your income.`;
      }

      if (financialScore >= 50) {
        return `Your financial behavior is generally balanced, but spending should remain below the suggested daily limit of ${safeDailyLimit.toLocaleString(
          "en-US"
        )} SAR.`;
      }

      return `Your financial behavior needs improvement. Focus on ${
        topCategory?.name ??
        "non-essential spending"
      } and complete the weekly recovery challenge.`;
    }, [
      monthlyIncome,
      monthlyBudget,
      remainingBalance,
      topCategory,
      financialScore,
      budgetUsage,
      savingsRate,
      safeDailyLimit,
    ]);

  const value =
    useMemo<FinancialAnalysisContextType>(
      () => ({
        survey,
        surveyCompleted,
        saveSurvey,

        monthlyIncome,
        monthlyBudget,
        totalSpent,
        remainingBalance,

        budgetUsage,
        savingsAmount,
        savingsRate,
        safeDailyLimit,
        daysLeftInMonth,

        financialScore,
        financialLevel,
        financialProfile,
        riskLevel,

        cityState,
        cityMessage,

        categories,
        topCategory,

        recommendations,
        weeklyChallenge,
        monthlyHistory,

        behaviorSummary,
      }),
      [
        survey,
        surveyCompleted,
        saveSurvey,
        monthlyIncome,
        monthlyBudget,
        totalSpent,
        remainingBalance,
        budgetUsage,
        savingsAmount,
        savingsRate,
        safeDailyLimit,
        daysLeftInMonth,
        financialScore,
        financialLevel,
        financialProfile,
        riskLevel,
        cityState,
        cityMessage,
        categories,
        topCategory,
        recommendations,
        weeklyChallenge,
        monthlyHistory,
        behaviorSummary,
      ]
    );

  return (
    <FinancialAnalysisContext.Provider
      value={value}
    >
      {children}
    </FinancialAnalysisContext.Provider>
  );
}

export function useFinancialAnalysis() {
  const context = useContext(
    FinancialAnalysisContext
  );

  if (!context) {
    throw new Error(
      "useFinancialAnalysis must be used inside FinancialAnalysisProvider"
    );
  }

  return context;
}