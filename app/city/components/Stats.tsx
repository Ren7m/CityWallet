"use client";

import { useMemo } from "react";

import { useBudget } from "@/context/BudgetContext";

import styles from "./Stats.module.css";

/*
  نستخدم هذا النوع فقط لحساب الـ Streak.
  لا ننشئ نسخة جديدة من expenses
  ولا نستخدم safeExpenses.
*/
type ExpenseWithDate = {
  createdAt?: string;
};

/*
  تنسيق المبالغ المالية.
*/
function formatMoney(value: number) {
  const safeValue = Number(value);

  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(
    Number.isFinite(safeValue)
      ? safeValue
      : 0
  );
}

/*
  تحويل التاريخ إلى مفتاح مثل:

  2026-07-10

  باستخدام التاريخ المحلي حتى لا تحدث
  مشاكل بسبب اختلاف المنطقة الزمنية.
*/
function getDateKey(date: Date) {
  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/*
  الرجوع أو التقدم بعدد معين من الأيام.
*/
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

/*
  حساب عدد الأيام المتتالية
  التي سجل فيها المستخدم مصروفًا.

  إذا سجل اليوم:
  يبدأ العد من اليوم.

  إذا لم يسجل اليوم لكنه سجل أمس:
  يبقى الـ Streak محفوظًا ويبدأ العد من أمس.

  إذا لم يسجل اليوم أو أمس:
  يصبح Streak = 0.
*/
function calculateStreak(
  expenses: readonly ExpenseWithDate[]
) {
  if (expenses.length === 0) {
    return 0;
  }

  const activeDays = new Set<string>();

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
      getDateKey(expenseDate)
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
    getDateKey(today);

  const yesterdayKey =
    getDateKey(yesterday);

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
      getDateKey(currentDate);

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

/*
  نستخدم هذه الدالة لقراءة بيانات الهدف
  بطريقة مرنة.

  تدعم مثلًا:

  targetAmount
  target
  amount

  و:

  currentAmount
  current
  savedAmount

  وهذا يسهل لاحقًا ربط Backend.
*/
function getNumberFromObject(
  value: unknown,
  possibleKeys: string[]
) {
  if (
    !value ||
    typeof value !== "object"
  ) {
    return 0;
  }

  for (const key of possibleKeys) {
    if (key in value) {
      const objectValue =
        value as Record<
          string,
          unknown
        >;

      const numberValue = Number(
        objectValue[key]
      );

      if (
        Number.isFinite(numberValue)
      ) {
        return numberValue;
      }
    }
  }

  return 0;
}

export default function Stats() {
  const {
    budget,
    expenses,
    totalSpent,
    balance,
    goal,
  } = useBudget();

  const stats = useMemo(() => {
    /*
      حساب الأيام المختلفة التي كان
      فيها نشاط مالي حقيقي.
    */
    const uniqueActiveDays =
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

      uniqueActiveDays.add(
        getDateKey(expenseDate)
      );
    });

    /*
      Level ديناميكي.

      يعتمد على:
      - عدد المصروفات المسجلة.
      - عدد الأيام التي كان فيها نشاط مالي.

      لا توجد قيمة Level ثابتة في الواجهة.
    */
    const activityScore =
      expenses.length +
      uniqueActiveDays.size;

    const level = Math.max(
      1,
      Math.ceil(
        activityScore / 5
      )
    );

    /*
      Streak الحقيقي من تواريخ المصروفات.
    */
    const streak =
      calculateStreak(expenses);

    /*
      قراءة بيانات الهدف بطريقة مرنة.
    */
    const goalTarget =
      getNumberFromObject(
        goal,
        [
          "targetAmount",
          "target",
          "amount",
        ]
      );

    const goalCurrent =
      getNumberFromObject(
        goal,
        [
          "currentAmount",
          "current",
          "savedAmount",
        ]
      );

    /*
      حساب نسبة الهدف الحقيقية.
    */
    const goalProgress =
      goalTarget > 0
        ? Math.min(
            Math.max(
              (goalCurrent /
                goalTarget) *
                100,
              0
            ),
            100
          )
        : null;

    return {
      level,
      streak,
      goalTarget,
      goalCurrent,
      goalProgress,
    };
  }, [
    expenses,
    goal,
  ]);

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div>
          <span
            className={styles.eyebrow}
          >
            FINANCIAL OVERVIEW
          </span>

          <h2>
            Your progress
          </h2>
        </div>
      </div>

      <div className={styles.grid}>
        {/* LEVEL */}

        <article className={styles.card}>
          <div className={styles.cardTop}>
            <span className={styles.label}>
              Level
            </span>

            <span className={styles.tag}>
              Activity
            </span>
          </div>

          <strong className={styles.value}>
            {stats.level}
          </strong>

          <p
            className={
              styles.description
            }
          >
            Based on your real financial
            activity.
          </p>
        </article>

        {/* STREAK */}

        <article className={styles.card}>
          <div className={styles.cardTop}>
            <span className={styles.label}>
              Streak
            </span>

            <span className={styles.tag}>
              Consistency
            </span>
          </div>

          <strong className={styles.value}>
            {stats.streak}

            <small>
              {stats.streak === 1
                ? " day"
                : " days"}
            </small>
          </strong>

          <p
            className={
              styles.description
            }
          >
            Consecutive days with recorded
            financial activity.
          </p>
        </article>

        {/* BALANCE */}

        <article className={styles.card}>
          <div className={styles.cardTop}>
            <span className={styles.label}>
              Balance
            </span>

            <span className={styles.tag}>
              Available
            </span>
          </div>

          <strong
            className={`${styles.value} ${
              balance < 0
                ? styles.negative
                : styles.positive
            }`}
          >
            {formatMoney(balance)}

            <small> SAR</small>
          </strong>

          <p
            className={
              styles.description
            }
          >
            Your current remaining budget.
          </p>
        </article>

        {/* TOTAL SPENT */}

        <article className={styles.card}>
          <div className={styles.cardTop}>
            <span className={styles.label}>
              Total Spent
            </span>

            <span className={styles.tag}>
              This month
            </span>
          </div>

          <strong className={styles.value}>
            {formatMoney(totalSpent)}

            <small> SAR</small>
          </strong>

          <p
            className={
              styles.description
            }
          >
            Total amount from your recorded
            expenses.
          </p>
        </article>

        {/* BUDGET */}

        <article className={styles.card}>
          <div className={styles.cardTop}>
            <span className={styles.label}>
              Budget
            </span>

            <span className={styles.tag}>
              Monthly
            </span>
          </div>

          <strong className={styles.value}>
            {formatMoney(budget)}

            <small> SAR</small>
          </strong>

          <p
            className={
              styles.description
            }
          >
            Your selected monthly spending
            limit.
          </p>
        </article>

        {/* GOAL */}

        <article className={styles.card}>
          <div className={styles.cardTop}>
            <span className={styles.label}>
              Goal
            </span>

            <span className={styles.tag}>
              Progress
            </span>
          </div>

          {stats.goalProgress !== null ? (
            <>
              <strong
                className={styles.value}
              >
                {Math.round(
                  stats.goalProgress
                )}

                <small>%</small>
              </strong>

              <div
                className={
                  styles.goalProgress
                }
              >
                <span
                  style={{
                    width: `${stats.goalProgress}%`,
                  }}
                />
              </div>

              <p
                className={
                  styles.description
                }
              >
                {formatMoney(
                  stats.goalCurrent
                )}{" "}
                of{" "}
                {formatMoney(
                  stats.goalTarget
                )}{" "}
                SAR
              </p>
            </>
          ) : (
            <>
              <strong
                className={
                  styles.noGoalValue
                }
              >
                No active goal
              </strong>

              <p
                className={
                  styles.description
                }
              >
                Your financial goal will
                appear here when one is
                created.
              </p>
            </>
          )}
        </article>
      </div>
    </section>
  );
}