import styles from "../dashboardPages.module.css";

const players = [
  {
    rank: 1,
    name: "Sara",
    level: 12,
    score: 9820,
    savings: 6400,
    streak: 18,
  },
  {
    rank: 2,
    name: "rema",
    level: 11,
    score: 9140,
    savings: 5800,
    streak: 15,
  },
  {
    rank: 3,
    name: "Nouf",
    level: 10,
    score: 8650,
    savings: 5200,
    streak: 14,
  },
  {
    rank: 4,
    name: "Renad",
    level: 7,
    score: 7450,
    savings: 4100,
    streak: 9,
  },
  {
    rank: 5,
    name: "Noura",
    level: 8,
    score: 6980,
    savings: 3800,
    streak: 8,
  },
  {
    rank: 6,
    name: "Joud",
    level: 7,
    score: 6420,
    savings: 3500,
    streak: 7,
  },
];

export default function LeaderboardPage() {
  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <h2>City Builders Leaderboard</h2>

        <p>
          Compare your financial progress with other city
          builders.
        </p>
      </header>

      <section className={styles.statsGrid}>
        <article className={styles.statCard}>
          <span className={styles.statLabel}>
            Your position
          </span>

          <strong
            className={`${styles.statValue} ${styles.success}`}
          >
            4th
          </strong>

          <span className={styles.statDescription}>
            Top 10% of active builders
          </span>
        </article>

        <article className={styles.statCard}>
          <span className={styles.statLabel}>
            Total score
          </span>

          <strong className={styles.statValue}>
            7,450
          </strong>

          <span className={styles.statDescription}>
            1,200 points behind third place
          </span>
        </article>

        <article className={styles.statCard}>
          <span className={styles.statLabel}>
            Current streak
          </span>

          <strong className={styles.statValue}>
            9 days
          </strong>

          <span className={styles.statDescription}>
            Continue managing your budget
          </span>
        </article>
      </section>

      <section className={styles.leaderboard}>
        <div className={styles.leaderboardHeader}>
          <span>Rank</span>
          <span>Builder</span>
          <span>Score</span>
          <span>Total savings</span>
          <span>Streak</span>
        </div>

        {players.map((player) => (
          <div
            className={`${styles.leaderboardRow} ${
              player.name === "Renad"
                ? styles.currentUser
                : ""
            }`}
            key={player.name}
          >
            <span className={styles.rank}>
              {player.rank}
            </span>

            <div className={styles.player}>
              <div className={styles.playerAvatar}>
                {player.name.charAt(0)}
              </div>

              <div
                className={styles.playerInformation}
              >
                <strong>
                  {player.name}
                  {player.name === "Renad"
                    ? " (You)"
                    : ""}
                </strong>

                <span>
                  Level {player.level} Builder
                </span>
              </div>
            </div>

            <span className={styles.score}>
              {player.score.toLocaleString()}
            </span>

            <span className={styles.smallValue}>
              {player.savings.toLocaleString()} SAR
            </span>

            <span className={styles.smallValue}>
              {player.streak} days
            </span>
          </div>
        ))}
      </section>
    </div>
  );
}