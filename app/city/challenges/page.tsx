import MonsterCard from "../../challenges/components/MonsterCard";
import RewardsCard from "../../challenges/components/RewardsCard";
import AttackHistory from "../../challenges/components/AttackHistory";
import AITip from "../../challenges/components/AITip";

import styles from "./challenges.module.css";

export default function CityChallengesPage() {
  return (
    <div className={styles.page}>
      <section className={styles.monsterColumn}>
        <MonsterCard />
      </section>

      <aside className={styles.sideColumn}>
        <RewardsCard />
        <AttackHistory />
        <AITip />
      </aside>
    </div>
  );
}