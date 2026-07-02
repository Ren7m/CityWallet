"use client";

import Link from "next/link";
import CityView from "../components/CityView";
import styles from "./full.module.css";

export default function FullCityPage() {
  return (
    <main className={styles.page}>
      <Link href="/city" className={styles.back}>
        ← Back
      </Link>

      <section className={styles.cityWrap}>
        <CityView />
      </section>
    </main>
  );
}