"use client";

import Sidebar from "../city/components/Sidebar";
import { useBudget } from "@/context/BudgetContext";

import styles from "./profile.module.css";

export default function ProfilePage() {
  const {
    budget,
    expenses,
    totalSpent,
    balance,
  } = useBudget();

  const budgetUsage =
    budget > 0
      ? Math.round((totalSpent / budget) * 100)
      : 0;

  const cityStatus =
    budgetUsage >= 100
      ? "Critical"
      : budgetUsage >= 70
        ? "Warning"
        : "Healthy";

  return (
    <main className={styles.page}>
      <Sidebar />

      <section className={styles.content}>
        <header className={styles.header}>
          <div>
            <span className={styles.eyebrow}>
              FINCITY ACCOUNT
            </span>

            <h1>Profile</h1>

            <p>
              View your financial progress, city status and
              achievements.
            </p>
          </div>

          <div className={styles.status}>
            <span
              className={`${styles.statusDot} ${
                cityStatus === "Healthy"
                  ? styles.healthyDot
                  : cityStatus === "Warning"
                    ? styles.warningDot
                    : styles.criticalDot
              }`}
            ></span>

            City status: {cityStatus}
          </div>
        </header>

        <div className={styles.profileLayout}>
          <aside className={styles.profileCard}>
            <div className={styles.avatarRing}>
              <div className={styles.avatar}>R</div>
            </div>

            <h2>Renad</h2>
            <p>CityWallet Builder</p>

            <div className={styles.levelCard}>
              <div>
                <span>Current level</span>
                <strong>Level 7</strong>
              </div>

              <div>
                <span>Total XP</span>
                <strong>2,450</strong>
              </div>
            </div>

            <div className={styles.levelProgress}>
              <div className={styles.levelTrack}>
                <span></span>
              </div>

              <div className={styles.levelLabels}>
                <span>2,450 XP</span>
                <span>3,000 XP</span>
              </div>
            </div>

            <div className={styles.memberInformation}>
              <div>
                <span>Member since</span>
                <strong>2026</strong>
              </div>

              <div>
                <span>Builder rank</span>
                <strong>#4</strong>
              </div>

              <div>
                <span>Current streak</span>
                <strong>9 days</strong>
              </div>
            </div>
          </aside>

          <div className={styles.mainColumn}>
            <section className={styles.statsGrid}>
              <article className={styles.statCard}>
                <div className={styles.statIcon}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>

                <div>
                  <span className={styles.statLabel}>
                    Monthly budget
                  </span>

                  <strong>
                    {budget.toLocaleString()} SAR
                  </strong>

                  <small>Active monthly plan</small>
                </div>
              </article>

              <article className={styles.statCard}>
                <div
                  className={`${styles.statIcon} ${styles.balanceIcon}`}
                >
                  <span></span>
                </div>

                <div>
                  <span className={styles.statLabel}>
                    Remaining balance
                  </span>

                  <strong
                    className={
                      balance >= 0
                        ? styles.positive
                        : styles.negative
                    }
                  >
                    {balance.toLocaleString()} SAR
                  </strong>

                  <small>After recorded expenses</small>
                </div>
              </article>

              <article className={styles.statCard}>
                <div
                  className={`${styles.statIcon} ${styles.transactionIcon}`}
                >
                  <span></span>
                  <span></span>
                  <span></span>
                </div>

                <div>
                  <span className={styles.statLabel}>
                    Transactions
                  </span>

                  <strong>{expenses.length}</strong>

                  <small>Recorded this month</small>
                </div>
              </article>
            </section>

            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <span className={styles.cardEyebrow}>
                    MONTHLY PERFORMANCE
                  </span>

                  <h3>Budget progress</h3>

                  <p>
                    Your current spending compared with your
                    monthly budget.
                  </p>
                </div>

                <span
                  className={`${styles.badge} ${
                    cityStatus === "Healthy"
                      ? styles.healthyBadge
                      : cityStatus === "Warning"
                        ? styles.warningBadge
                        : styles.criticalBadge
                  }`}
                >
                  {cityStatus}
                </span>
              </div>

              <div className={styles.budgetDetails}>
                <div>
                  <span>Total spent</span>

                  <strong>
                    {totalSpent.toLocaleString()} SAR
                  </strong>
                </div>

                <div>
                  <span>Remaining</span>

                  <strong
                    className={
                      balance >= 0
                        ? styles.positive
                        : styles.negative
                    }
                  >
                    {balance.toLocaleString()} SAR
                  </strong>
                </div>

                <div>
                  <span>Budget usage</span>

                  <strong>{budgetUsage}%</strong>
                </div>
              </div>

              <div className={styles.progressTrack}>
                <div
                  className={`${styles.progressFill} ${
                    budgetUsage >= 100
                      ? styles.criticalProgress
                      : budgetUsage >= 70
                        ? styles.warningProgress
                        : styles.healthyProgress
                  }`}
                  style={{
                    width: `${Math.min(budgetUsage, 100)}%`,
                  }}
                ></div>
              </div>

              <div className={styles.progressLabels}>
                <span>0%</span>
                <span>Warning level: 70%</span>
                <span>100%</span>
              </div>
            </section>

            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <span className={styles.cardEyebrow}>
                    CITY MILESTONES
                  </span>

                  <h3>Achievements</h3>

                  <p>
                    Milestones unlocked through your CityWallet
                    journey.
                  </p>
                </div>

                <span className={styles.achievementCount}>
                  4 unlocked
                </span>
              </div>

              <div className={styles.achievementGrid}>
                <article className={styles.achievement}>
                  <div className={styles.achievementMark}>
                    <span className={styles.cityMark}></span>
                  </div>

                  <div>
                    <strong>First City</strong>

                    <p>
                      Created your first personal finance city.
                    </p>

                    <span className={styles.unlocked}>
                      Unlocked
                    </span>
                  </div>
                </article>

                <article className={styles.achievement}>
                  <div className={styles.achievementMark}>
                    <span className={styles.budgetMark}></span>
                  </div>

                  <div>
                    <strong>Budget Planner</strong>

                    <p>
                      Created and started tracking a monthly
                      budget.
                    </p>

                    <span className={styles.unlocked}>
                      Unlocked
                    </span>
                  </div>
                </article>

                <article className={styles.achievement}>
                  <div className={styles.achievementMark}>
                    <span className={styles.expenseMark}></span>
                  </div>

                  <div>
                    <strong>Expense Tracker</strong>

                    <p>
                      Recorded financial transactions inside
                      CityWallet.
                    </p>

                    <span className={styles.unlocked}>
                      Unlocked
                    </span>
                  </div>
                </article>

                <article className={styles.achievement}>
                  <div className={styles.achievementMark}>
                    <span className={styles.healthMark}></span>
                  </div>

                  <div>
                    <strong>Healthy City</strong>

                    <p>
                      Kept spending below the critical budget
                      limit.
                    </p>

                    <span className={styles.unlocked}>
                      Unlocked
                    </span>
                  </div>
                </article>

                <article
                  className={`${styles.achievement} ${styles.locked}`}
                >
                  <div className={styles.achievementMark}>
                    <span className={styles.lockMark}></span>
                  </div>

                  <div>
                    <strong>Saving Master</strong>

                    <p>
                      Save at least 30% of your monthly budget.
                    </p>

                    <span className={styles.lockedText}>
                      Locked
                    </span>
                  </div>
                </article>

                <article
                  className={`${styles.achievement} ${styles.locked}`}
                >
                  <div className={styles.achievementMark}>
                    <span className={styles.lockMark}></span>
                  </div>

                  <div>
                    <strong>Perfect Month</strong>

                    <p>
                      Complete a month without entering the
                      warning level.
                    </p>

                    <span className={styles.lockedText}>
                      Locked
                    </span>
                  </div>
                </article>
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}