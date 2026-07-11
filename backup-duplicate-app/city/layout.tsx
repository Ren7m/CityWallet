import type { ReactNode } from "react";

import AuthGuard from "./components/AuthGuard";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import styles from "./layout.module.css";

type CityLayoutProps = {
  children: ReactNode;
};

export default function CityLayout({
  children,
}: CityLayoutProps) {
  return (
    <AuthGuard>
      <div className={styles.dashboard}>
        <Sidebar />

        <div className={styles.workspace}>
          <Navbar />

          <main className={styles.content}>
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}