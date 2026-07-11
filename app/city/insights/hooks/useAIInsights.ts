"use client";

import {
  useCallback,
  useState,
} from "react";

/* =========================
   AI TYPES
========================= */

export type AIRecommendation = {
  title: string;
  description: string;
  action: string;

  priority:
    | "low"
    | "medium"
    | "high";
};

export type AISuggestedMission = {
  title: string;
  description: string;
  target: string;
  reason: string;
};

export type AIInsight = {
  title: string;
  summary: string;
  analysis: string;
  warning: string | null;
  actions: string[];
  expectedResult: string;

  recommendations:
    AIRecommendation[];

  suggestedMission:
    AISuggestedMission;
};

/* =========================
   INPUT TYPES
========================= */

type ExpenseInput = {
  name: string;
  amount: number;
  category: string;
  createdAt?: string;
};

type CategoryInput = {
  name: string;
  amount: number;
  percentage: number;
};

export type AIAnalysisInput = {
  monthlyIncome: number;
  monthlyBudget: number;
  totalSpent: number;
  remainingBalance: number;
  budgetUsage: number;
  savingsAmount: number;
  savingsRate: number;
  safeDailyLimit: number;

  financialScore:
    | number
    | null;

  riskLevel: string;

  expenses:
    ExpenseInput[];

  categories:
    CategoryInput[];

  financialSurveyAnswers?: unknown;

  weeklyChallenge?: unknown;
};

/* =========================
   API RESPONSE
========================= */

type APIResponse = {
  success: boolean;

  hasData?: boolean;

  model?: string;

  attempts?: number;

  advice?: AIInsight | null;

  error?: string;

  message?: string;
};

/* =========================
   HOOK
========================= */

export function useAIInsights() {
  const [
    aiInsight,
    setAIInsight,
  ] = useState<AIInsight | null>(
    null
  );

  const [
    isAnalyzing,
    setIsAnalyzing,
  ] = useState(false);

  const [
    aiError,
    setAIError,
  ] = useState("");

  const [
    aiModel,
    setAIModel,
  ] = useState("");

  const [
    aiAttempts,
    setAIAttempts,
  ] = useState(0);

  const analyzeFinancialData =
    useCallback(
      async (
        data: AIAnalysisInput
      ) => {
        if (
          data.expenses.length === 0
        ) {
          setAIInsight(null);

          setAIError(
            "Add your first expense before running FinBot analysis."
          );

          return null;
        }

        setIsAnalyzing(true);

        setAIError("");

        try {
          const response =
            await fetch(
              "/api/ai-insights",
              {
                method: "POST",

                headers: {
                  "Content-Type":
                    "application/json",
                },

                body:
                  JSON.stringify(
                    data
                  ),
              }
            );

          const result =
            (await response.json()) as
              APIResponse;

          if (
            !response.ok ||
            !result.success
          ) {
            throw new Error(
              result.error ||
                result.message ||
                "Unable to generate AI analysis."
            );
          }

          if (
            result.hasData === false ||
            !result.advice
          ) {
            setAIInsight(null);

            setAIError(
              result.message ||
                "Add financial activity before running AI analysis."
            );

            return null;
          }

          setAIInsight(
            result.advice
          );

          setAIModel(
            result.model || ""
          );

          setAIAttempts(
            result.attempts || 1
          );

          return result.advice;
        } catch (error) {
          const message =
            error instanceof Error
              ? error.message
              : "Unable to generate AI analysis.";

          setAIError(message);

          return null;
        } finally {
          setIsAnalyzing(false);
        }
      },
      []
    );

  const clearAIInsight =
    useCallback(() => {
      setAIInsight(null);

      setAIError("");

      setAIModel("");

      setAIAttempts(0);
    }, []);

  return {
    aiInsight,

    isAnalyzing,

    aiError,

    aiModel,

    aiAttempts,

    analyzeFinancialData,

    clearAIInsight,
  };
}