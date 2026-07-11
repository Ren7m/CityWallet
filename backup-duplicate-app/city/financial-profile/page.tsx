"use client";

import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import Link from "next/link";

import {
  useFinancialAnalysis,
  type SurveyAnswers,
} from "@/context/FinancialAnalysisContext";

import styles from "./financial-profile.module.css";

export default function FinancialProfilePage() {
  const {
    survey,
    surveyCompleted,
    saveSurvey,
    financialScore,
    financialProfile,
    riskLevel,
    cityState,
  } = useFinancialAnalysis();

  const [form, setForm] =
    useState<SurveyAnswers>(
      survey
    );

  const [saved, setSaved] =
    useState(false);

  useEffect(() => {
    setForm(survey);
  }, [survey]);

  function updateField<
    Key extends keyof SurveyAnswers,
  >(
    field: Key,
    value: SurveyAnswers[Key]
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setSaved(false);
  }

  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    saveSurvey(form);
    setSaved(true);
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <span>
            FINANCIAL BEHAVIOR
          </span>

          <h1>
            Financial Profile Survey
          </h1>

          <p>
            Your answers are used to
            personalize the financial
            analysis, recommendations,
            city condition and weekly
            challenges.
          </p>
        </div>

        <Link
          href="/city"
          className={styles.backButton}
        >
          Back to City
        </Link>
      </header>

      <div className={styles.layout}>
        <form
          className={styles.form}
          onSubmit={handleSubmit}
        >
          <label>
            <span>
              What is your main financial
              goal?
            </span>

            <select
              value={
                form.financialGoal
              }
              onChange={(event) =>
                updateField(
                  "financialGoal",
                  event.target
                    .value as SurveyAnswers["financialGoal"]
                )
              }
            >
              <option value="save">
                Build savings
              </option>

              <option value="control">
                Control spending
              </option>

              <option value="purchase">
                Save for a purchase
              </option>

              <option value="emergency">
                Build an emergency fund
              </option>
            </select>
          </label>

          <label>
            <span>
              How do you usually make
              purchases?
            </span>

            <select
              value={
                form.spendingBehavior
              }
              onChange={(event) =>
                updateField(
                  "spendingBehavior",
                  event.target
                    .value as SurveyAnswers["spendingBehavior"]
                )
              }
            >
              <option value="planned">
                Most purchases are planned
              </option>

              <option value="balanced">
                Some purchases are planned
              </option>

              <option value="impulsive">
                I often buy impulsively
              </option>
            </select>
          </label>

          <label>
            <span>
              How often do you save?
            </span>

            <select
              value={
                form.savingHabit
              }
              onChange={(event) =>
                updateField(
                  "savingHabit",
                  event.target
                    .value as SurveyAnswers["savingHabit"]
                )
              }
            >
              <option value="monthly">
                Every month
              </option>

              <option value="sometimes">
                Sometimes
              </option>

              <option value="rarely">
                Rarely
              </option>
            </select>
          </label>

          <label>
            <span>
              Which challenge helps you
              most?
            </span>

            <select
              value={
                form.challengePreference
              }
              onChange={(event) =>
                updateField(
                  "challengePreference",
                  event.target
                    .value as SurveyAnswers["challengePreference"]
                )
              }
            >
              <option value="saving">
                Saving challenges
              </option>

              <option value="spending">
                Spending control
              </option>

              <option value="tracking">
                Expense tracking
              </option>
            </select>
          </label>

          <button type="submit">
            Save Financial Profile
          </button>

          {saved && (
            <p className={styles.saved}>
              Financial profile saved
              successfully.
            </p>
          )}
        </form>

        <aside className={styles.result}>
          <span>
            {surveyCompleted
              ? "CURRENT PROFILE"
              : "PROFILE PREVIEW"}
          </span>

          <h2>{financialProfile}</h2>

          <div className={styles.score}>
            {financialScore}

            <small>/100</small>
          </div>

          <div className={styles.resultRow}>
            <span>Risk level</span>
            <strong>{riskLevel}</strong>
          </div>

          <div className={styles.resultRow}>
            <span>City state</span>
            <strong>{cityState}</strong>
          </div>

          <Link
            href="/city/insights"
            className={styles.reportButton}
          >
            View Full Report
          </Link>
        </aside>
      </div>
    </main>
  );
}