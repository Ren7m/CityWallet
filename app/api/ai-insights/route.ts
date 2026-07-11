import { NextResponse } from "next/server";

/* =========================
   TYPES
========================= */

type FinancialExpense = {
  name: string;
  amount: number;
  category: string;
  createdAt?: string;
};

type FinancialCategory = {
  name: string;
  amount: number;
  percentage: number;
};

type FinancialInput = {
  monthlyIncome: number;
  monthlyBudget: number;
  totalSpent: number;
  remainingBalance: number;
  budgetUsage: number;
  savingsAmount: number;
  savingsRate: number;
  safeDailyLimit: number;
  financialScore: number | null;
  riskLevel: string;

  expenses: FinancialExpense[];

  categories: FinancialCategory[];

  financialSurveyAnswers?: unknown;

  weeklyChallenge?: unknown;
};

type AIRecommendation = {
  title: string;
  description: string;
  action: string;

  priority:
    | "low"
    | "medium"
    | "high";
};

type AISuggestedMission = {
  title: string;
  description: string;
  target: string;
  reason: string;
};

type AIInsight = {
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

type GeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
};

type GeminiErrorResponse = {
  error?: {
    code?: number;
    message?: string;
    status?: string;
  };
};

/* =========================
   CONFIG
========================= */

const MODELS = [
  "gemini-3.5-flash",
  "gemini-2.5-flash",
];

const MAX_ATTEMPTS_PER_MODEL = 3;

/* =========================
   HELPERS
========================= */

function wait(
  milliseconds: number
) {
  return new Promise<void>(
    (resolve) => {
      setTimeout(
        resolve,
        milliseconds
      );
    }
  );
}

function isObject(
  value: unknown
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null
  );
}

function isRecommendation(
  value: unknown
): value is AIRecommendation {
  if (!isObject(value)) {
    return false;
  }

  return (
    typeof value.title ===
      "string" &&
    typeof value.description ===
      "string" &&
    typeof value.action ===
      "string" &&
    (
      value.priority === "low" ||
      value.priority ===
        "medium" ||
      value.priority === "high"
    )
  );
}

function isSuggestedMission(
  value: unknown
): value is AISuggestedMission {
  if (!isObject(value)) {
    return false;
  }

  return (
    typeof value.title ===
      "string" &&
    typeof value.description ===
      "string" &&
    typeof value.target ===
      "string" &&
    typeof value.reason ===
      "string"
  );
}

function isAIInsight(
  value: unknown
): value is AIInsight {
  if (!isObject(value)) {
    return false;
  }

  return (
    typeof value.title ===
      "string" &&

    typeof value.summary ===
      "string" &&

    typeof value.analysis ===
      "string" &&

    (
      value.warning === null ||
      typeof value.warning ===
        "string"
    ) &&

    Array.isArray(
      value.actions
    ) &&

    value.actions.every(
      (action) =>
        typeof action === "string"
    ) &&

    typeof value.expectedResult ===
      "string" &&

    Array.isArray(
      value.recommendations
    ) &&

    value.recommendations.every(
      isRecommendation
    ) &&

    isSuggestedMission(
      value.suggestedMission
    )
  );
}

function validateFinancialInput(
  value: unknown
):
  | {
      success: true;
      data: FinancialInput;
    }
  | {
      success: false;
      error: string;
    } {
  if (!isObject(value)) {
    return {
      success: false,

      error:
        "Financial data must be an object.",
    };
  }

  const expenses = value.expenses;

  const categories =
    value.categories;

  if (!Array.isArray(expenses)) {
    return {
      success: false,

      error:
        "Expenses must be an array.",
    };
  }

  if (!Array.isArray(categories)) {
    return {
      success: false,

      error:
        "Categories must be an array.",
    };
  }

  const validExpenses:
    FinancialExpense[] =
      expenses
        .filter(isObject)
        .map((expense) => ({
          name:
            typeof expense.name ===
              "string"
              ? expense.name
              : "Expense",

          amount:
            Number(
              expense.amount
            ) || 0,

          category:
            typeof expense.category ===
              "string"
              ? expense.category
              : "Other",

          createdAt:
            typeof expense.createdAt ===
              "string"
              ? expense.createdAt
              : undefined,
        }))
        .filter(
          (expense) =>
            expense.amount >= 0
        );

  const validCategories:
    FinancialCategory[] =
      categories
        .filter(isObject)
        .map((category) => ({
          name:
            typeof category.name ===
              "string"
              ? category.name
              : "Other",

          amount:
            Number(
              category.amount
            ) || 0,

          percentage:
            Number(
              category.percentage
            ) || 0,
        }));

  return {
    success: true,

    data: {
      monthlyIncome:
        Number(
          value.monthlyIncome
        ) || 0,

      monthlyBudget:
        Number(
          value.monthlyBudget
        ) || 0,

      totalSpent:
        Number(
          value.totalSpent
        ) || 0,

      remainingBalance:
        Number(
          value.remainingBalance
        ) || 0,

      budgetUsage:
        Number(
          value.budgetUsage
        ) || 0,

      savingsAmount:
        Number(
          value.savingsAmount
        ) || 0,

      savingsRate:
        Number(
          value.savingsRate
        ) || 0,

      safeDailyLimit:
        Number(
          value.safeDailyLimit
        ) || 0,

      financialScore:
        value.financialScore ===
          null ||
        value.financialScore ===
          undefined
          ? null
          : Number(
              value.financialScore
            ),

      riskLevel:
        typeof value.riskLevel ===
          "string"
          ? value.riskLevel
          : "Not available",

      expenses:
        validExpenses.slice(-30),

      categories:
        validCategories.slice(0, 20),

      financialSurveyAnswers:
        value.financialSurveyAnswers,

      weeklyChallenge:
        value.weeklyChallenge,
    },
  };
}

/* =========================
   GEMINI REQUEST
========================= */

async function requestGemini(
  apiKey: string,
  model: string,
  prompt: string
) {
  return fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",

        "x-goog-api-key":
          apiKey,
      },

      body: JSON.stringify({
        contents: [
          {
            role: "user",

            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],

        generationConfig: {
          temperature: 0.2,

          responseMimeType:
            "application/json",
        },
      }),
    }
  );
}

/* =========================
   POST
========================= */

export async function POST(
  request: Request
) {
  const apiKey =
    process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      {
        success: false,

        error:
          "GEMINI_API_KEY is missing.",
      },
      {
        status: 503,
      }
    );
  }

  try {
    /* =====================
       READ INPUT
    ===================== */

    const requestBody:
      unknown =
        await request.json();

    const validation =
      validateFinancialInput(
        requestBody
      );

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,

          error:
            validation.error,
        },
        {
          status: 400,
        }
      );
    }

    const financialData =
      validation.data;

    /* =====================
       NO FAKE ANALYSIS
    ===================== */

    if (
      financialData.expenses.length ===
      0
    ) {
      return NextResponse.json({
        success: true,

        hasData: false,

        advice: null,

        message:
          "Add your first expense before running AI analysis.",
      });
    }

    /* =====================
       REAL DATA ONLY
    ===================== */

    const realFinancialData = {
      monthlyIncome:
        financialData.monthlyIncome,

      monthlyBudget:
        financialData.monthlyBudget,

      totalSpent:
        financialData.totalSpent,

      remainingBalance:
        financialData.remainingBalance,

      budgetUsage:
        financialData.budgetUsage,

      savingsAmount:
        financialData.savingsAmount,

      savingsRate:
        financialData.savingsRate,

      safeDailyLimit:
        financialData.safeDailyLimit,

      financialScore:
        financialData.financialScore,

      riskLevel:
        financialData.riskLevel,

      categories:
        financialData.categories,

      recentExpenses:
        financialData.expenses,

      financialSurveyAnswers:
        financialData
          .financialSurveyAnswers ??
        null,

      weeklyChallenge:
        financialData
          .weeklyChallenge ??
        null,
    };

    /* =====================
       PROMPT
    ===================== */

    const prompt = `
You are FinBot, the real AI financial behavior coach inside CityWallet.

CityWallet is a gamified personal finance application where the user's real financial behavior affects a virtual city.

Your job is to analyze ONLY the real financial data supplied by the application.

STRICT RULES:

1. Never invent financial numbers.
2. Never invent expenses.
3. Never invent income.
4. Never invent savings.
5. Never invent percentages.
6. Never claim the user spent, earned, saved or exceeded any amount unless that fact exists in the supplied data.
7. Do not invent XP.
8. Do not invent coins.
9. Do not invent streaks.
10. Do not invent rewards.
11. Do not invent challenge progress.
12. Do not claim that an AI-suggested mission is already completed or active.
13. The application itself controls game rewards and progress.
14. Base every conclusion only on the supplied financial data.
15. Do not shame the user.
16. Do not guarantee outcomes.
17. Do not recommend specific investments, loans, credit cards or financial products.
18. Do not provide legal or tax advice.
19. Keep guidance educational, practical and supportive.
20. Give exactly three measurable actions.
21. Give no more than three recommendations.
22. The suggested mission must directly relate to the user's real financial behavior.
23. The suggested mission must not contain a fake reward.
24. Write all user-facing content in English.
25. Return valid JSON only.
26. Do not use markdown.
27. Do not wrap the JSON inside code fences.

REAL CITYWALLET FINANCIAL DATA:

${JSON.stringify(
  realFinancialData,
  null,
  2
)}

Return exactly this structure:

{
  "title": "short personalized title",
  "summary": "short summary based only on supplied data",
  "analysis": "clear analysis of the user's actual financial behavior",
  "warning": "specific justified warning or null",
  "actions": [
    "specific measurable action one",
    "specific measurable action two",
    "specific measurable action three"
  ],
  "expectedResult": "possible educational result of following these actions without guaranteeing an outcome",
  "recommendations": [
    {
      "title": "short recommendation title",
      "description": "recommendation based only on supplied data",
      "action": "specific measurable next action",
      "priority": "low"
    }
  ],
  "suggestedMission": {
    "title": "mission title related to real behavior",
    "description": "clear mission description",
    "target": "specific measurable mission target",
    "reason": "why this mission matches the supplied financial data"
  }
}
`.trim();

    /* =====================
       RETRY + FALLBACK
    ===================== */

    const attemptErrors: Array<{
      model: string;
      attempt: number;
      status: number;
      message: string;
    }> = [];

    for (const model of MODELS) {
      for (
        let attempt = 1;
        attempt <=
        MAX_ATTEMPTS_PER_MODEL;
        attempt += 1
      ) {
        const response =
          await requestGemini(
            apiKey,
            model,
            prompt
          );

        const responseText =
          await response.text();

        /* =================
           SUCCESS
        ================= */

        if (response.ok) {
          let result:
            | GeminiResponse
            | null = null;

          try {
            result = JSON.parse(
              responseText
            ) as GeminiResponse;
          } catch {
            return NextResponse.json(
              {
                success: false,

                error:
                  "Gemini returned invalid API JSON.",

                model,
              },
              {
                status: 502,
              }
            );
          }

          const generatedText =
            result.candidates?.[0]
              ?.content?.parts?.[0]
              ?.text;

          if (
            typeof generatedText !==
            "string"
          ) {
            return NextResponse.json(
              {
                success: false,

                error:
                  "Gemini returned no analysis content.",

                model,
              },
              {
                status: 502,
              }
            );
          }

          let parsedAdvice:
            unknown;

          try {
            parsedAdvice =
              JSON.parse(
                generatedText
              );
          } catch {
            console.error(
              "Invalid Gemini generated JSON:",
              generatedText
            );

            return NextResponse.json(
              {
                success: false,

                error:
                  "Gemini returned invalid analysis JSON.",

                model,
              },
              {
                status: 502,
              }
            );
          }

          if (
            !isAIInsight(
              parsedAdvice
            )
          ) {
            console.error(
              "Invalid Gemini analysis structure:",
              parsedAdvice
            );

            return NextResponse.json(
              {
                success: false,

                error:
                  "Gemini returned an invalid analysis structure.",

                model,
              },
              {
                status: 502,
              }
            );
          }

          return NextResponse.json({
            success: true,

            hasData: true,

            model,

            attempts: attempt,

            advice:
              parsedAdvice,
          });
        }

        /* =================
           ERROR DETAILS
        ================= */

        let geminiError:
          | GeminiErrorResponse
          | null = null;

        try {
          geminiError =
            JSON.parse(
              responseText
            ) as GeminiErrorResponse;
        } catch {
          geminiError = null;
        }

        const errorMessage =
          geminiError?.error
            ?.message ||
          responseText ||
          "Unknown Gemini error.";

        attemptErrors.push({
          model,

          attempt,

          status:
            response.status,

          message:
            errorMessage,
        });

        console.error(
          `Gemini request failed | model=${model} | attempt=${attempt}`,
          {
            status:
              response.status,

            message:
              errorMessage,
          }
        );

        /* =================
           RETRYABLE
        ================= */

        const shouldRetry =
          response.status === 503 ||
          response.status === 429 ||
          response.status === 500;

        if (
          shouldRetry &&
          attempt <
            MAX_ATTEMPTS_PER_MODEL
        ) {
          const delay =
            1000 *
            Math.pow(
              2,
              attempt - 1
            );

          await wait(delay);

          continue;
        }

        /*
          ننتقل للنموذج التالي.
        */

        break;
      }
    }

    /* =====================
       ALL MODELS FAILED
    ===================== */

    return NextResponse.json(
      {
        success: false,

        error:
          "AI analysis is temporarily unavailable.",

        message:
          "Gemini models failed after automatic retries.",

        triedModels: MODELS,

        details:
          attemptErrors,
      },
      {
        status: 503,
      }
    );
  } catch (error) {
    console.error(
      "AI Insights route error:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        error:
          error instanceof Error
            ? error.message
            : "Unable to generate AI analysis.",
      },
      {
        status: 500,
      }
    );
  }
}