"use client";

import { usePathname } from "next/navigation";
import MobileBottomNav from "./MobileBottomNav";
import styles from "./AppShell.module.css";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const hideBottomNav =
    pathname === "/" ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/expense") ||
    pathname.startsWith("/goals");

  return (
    <div className={hideBottomNav ? styles.app : styles.appWithBottomNav}>
      {children}
      {!hideBottomNav && <MobileBottomNav />}
    </div>
  );
}