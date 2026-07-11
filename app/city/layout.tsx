import type { ReactNode } from "react";

import { redirect } from "next/navigation";

import { createClient } from "../../lib/supabase/server";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import styles from "./layout.module.css";

type CityLayoutProps = {
  children: ReactNode;
};

export default async function CityLayout({
  children,
}: CityLayoutProps) {
  const supabase = await createClient();

  const {
    data,
    error,
  } = await supabase.auth.getClaims();

  const userId = data?.claims?.sub;

  if (error || !userId) {
    redirect("/login");
  }

  return (
    <div className={styles.dashboard}>
      <Sidebar />

      <div className={styles.workspace}>
        <Navbar />

        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  );
}