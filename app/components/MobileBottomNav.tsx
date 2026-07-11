"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./MobileBottomNav.module.css";

const items = [
  { href: "/city", icon: "🏙️", label: "City" },
  { href: "/city/insights", icon: "📊", label: "Insights" },
  { href: "/city/expenses", icon: "➕", label: "Add" },
  { href: "/city/challenges", icon: "🎯", label: "Quests" },
  { href: "/city/profile", icon: "👤", label: "Profile" },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className={styles.nav}>
      {items.map((item) => {
        const isActive =
          item.href === "/city"
            ? pathname === "/city"
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.link} ${isActive ? styles.active : ""} ${
              item.label === "Add" ? styles.addButton : ""
            }`}
          >
            <span className={styles.icon}>{item.icon}</span>
            <span className={styles.label}>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}