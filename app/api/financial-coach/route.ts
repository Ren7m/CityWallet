import { NextResponse } from "next/server";

type CoachAdvice = {
  title: string;
  analysis: string;
  actions: string[];
  expectedResult: string;
};

function isCoachAdvice(
  value: unknown
): value is CoachAdvice {
  if (
    !value ||
    typeof value !== "object"
  ) {
    return false;
  }

  const advice =
    value as Partial<CoachAdvice>;

  return (
    typeof advice.title ===
      "string" &&
    typeof advice.analysis ===
      "string" &&
    Array.isArray(
      advice.actions
    ) &&
    advice.actions.every(
      (action) =>
        typeof action === "string"
    ) &&
    typeof advice.expectedResult ===
      "string"
  );
}

export async function POST(
  request: Request
) {
  const apiKey =
    process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "GEMINI_API_KEY is missing.",
      },
      {
        status: 503,
      }
    );
  }

  try {
    const financialData =
      await request.json();

    const prompt = `
You are the personalized financial coach inside CityWallet.

Analyze:
- monthly income
- monthly budget
- total spending
- remaining balance
- expense categories
- financial survey answers
- financial score
- weekly challenge

Give practical educational guidance.

Do not recommend specific investments, loans, credit cards, financial products or guaranteed outcomes.

User data:
${JSON.stringify(
  financialData,
  null,
  2
)}

Return JSON only:

{
  "title": "short personalized title",
  "analysis": "clear analysis of the user's financial behavior",
  "actions": [
    "measurable action one",
    "measurable action two",
    "measurable action three"
  ],
  "expectedResult": "how these actions may improve the user's budget and CityWallet progress"
}
`;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent",
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
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],

          generationConfig: {
            temperature: 0.3,
            responseMimeType:
              "application/json",
          },
        }),
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        {
          error:
            "Gemini request failed.",
        },
        {
          status: 502,
        }
      );
    }

    const result =
      await response.json();

    const responseText =
      result.candidates?.[0]
        ?.content?.parts?.[0]
        ?.text;

    if (
      typeof responseText !==
      "string"
    ) {
      return NextResponse.json(
        {
          error:
            "Gemini returned no content.",
        },
        {
          status: 502,
        }
      );
    }

    const parsed =
      JSON.parse(
        responseText
      ) as unknown;

    if (!isCoachAdvice(parsed)) {
      return NextResponse.json(
        {
          error:
            "Invalid Gemini response.",
        },
        {
          status: 502,
        }
      );
    }

    return NextResponse.json({
      advice: parsed,
    });
  } catch {
    return NextResponse.json(
      {
        error:
          "Unable to generate advice.",
      },
      {
        status: 500,
      }
    );
  }
}