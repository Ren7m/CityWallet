"use client";

import { useAuth } from "@/context/AuthContext";
import { useGame } from "@/context/GameContext";

import styles from "./RewardsCard.module.css";

export default function RewardsCard() {
  const { user } = useAuth();

  const {
    xp,
    coins,
    level,

    currentLevelXp,
    xpRequiredForNextLevel,

    monster,
    claimMonsterReward,
  } = useGame();

  const firstName =
    user?.name
      ?.trim()
      .split(/\s+/)[0] ||
    "Mayor";

  const rewardStatus =
    monster.rewardClaimed
      ? "Claimed"

      : monster.defeated
        ? "Ready to Claim"

        : "Defeat Monster";

  const rewards = [
    {
      icon: "⭐",

      title:
        `${xp} XP`,

      text:
        `Level ${level} • ${currentLevelXp}/${xpRequiredForNextLevel} XP`,
    },

    {
      icon: "🪙",

      title:
        `${coins} Coins`,

      text:
        `${firstName}'s real game balance`,
    },

    {
      icon: "❤️",

      title:
        `${monster.hp}/${monster.maxHp} HP`,

      text:
        monster.defeated
          ? "Monster defeated"
          : "Monster health remaining",
    },

    {
      icon: "🏆",

      title:
        `+${monster.rewardXp} XP`,

      text:
        `+${monster.rewardCoins} Coins • ${rewardStatus}`,
    },
  ];

  function handleClaimReward() {
    claimMonsterReward();
  }

  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <h2>
          🎁 Rewards
        </h2>

        <span>
          {monster.rewardClaimed
            ? "Reward Claimed"
            : monster.defeated
              ? "Reward Ready"
              : "Complete Mission"}
        </span>
      </div>

      <div className={styles.grid}>
        {rewards.map(
          (reward) => (
            <div
              key={reward.icon}
              className={
                styles.reward
              }
            >
              <div
                className={
                  styles.icon
                }
              >
                {reward.icon}
              </div>

              <h3>
                {reward.title}
              </h3>

              <p>
                {reward.text}
              </p>
            </div>
          )
        )}
      </div>

      <button
        type="button"
        className={styles.claim}
        onClick={
          handleClaimReward
        }
        disabled={
          !monster.defeated ||
          monster.rewardClaimed
        }
      >
        {monster.rewardClaimed
          ? "Rewards Claimed ✓"

          : monster.defeated
            ? `Claim +${monster.rewardXp} XP & +${monster.rewardCoins} Coins`

            : "Defeat Monster to Unlock"}
      </button>
    </section>
  );
}