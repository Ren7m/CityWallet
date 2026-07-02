"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useAuth } from "@/context/AuthContext";
import { useGame } from "@/context/GameContext";

import styles from "./Sidebar.module.css";

type IconName =
  | "city"
  | "insights"
  | "leaderboard"
  | "monster"
  | "profile"
  | "settings";

type NavigationItem = {
  href: string;
  label: string;
  icon: IconName;
};

const navigation: NavigationItem[] = [
  {
    href: "/city",
    label: "My City",
    icon: "city",
  },
  {
    href: "/city/insights",
    label: "AI Insights",
    icon: "insights",
  },
  {
    href: "/city/leaderboard",
    label: "Leaderboard",
    icon: "leaderboard",
  },
  {
    href: "/city/challenges",
    label: "Weekly Monster",
    icon: "monster",
  },
  {
    href: "/city/profile",
    label: "Profile",
    icon: "profile",
  },
  {
    href: "/city/settings",
    label: "Settings",
    icon: "settings",
  },
];

function NavigationIcon({
  name,
}: {
  name: IconName;
}) {
  if (name === "city") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 21V9l6-4v16M9 21V3l7 4v14M16 21v-9l5-3v12" />

        <path d="M6 11h1M6 15h1M12 8h1M12 12h1M12 16h1M19 14h1M19 18h1" />
      </svg>
    );
  }

  if (name === "insights") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 20V11M10 20V5M16 20v-8M22 20V8M2 20h22" />

        <path d="m4 8 5-4 6 4 7-6" />
      </svg>
    );
  }

  if (name === "leaderboard") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8 21H4v-8h4v8ZM14 21h-4V7h4v14ZM20 21h-4V3h4v18ZM3 21h18" />
      </svg>
    );
  }

  if (name === "monster") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8 7V4M16 7V4M6 10H3M21 10h-3" />

        <path d="M7 8h10l2 4-2 7H7l-2-7 2-4Z" />

        <circle cx="10" cy="13" r="1" />

        <circle cx="14" cy="13" r="1" />

        <path d="M10 16h4" />
      </svg>
    );
  }

  if (name === "profile") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="8" r="4" />

        <path d="M4 21c1-5 4-7 8-7s7 2 8 7" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="3" />

      <path d="M19 12a7 7 0 0 0-.1-1l2-1.5-2-3.4-2.4 1a8 8 0 0 0-1.7-1L14.5 3h-5L9 6.1a8 8 0 0 0-1.7 1l-2.4-1-2 3.4L5 11a7 7 0 0 0 0 2l-2 1.5 2 3.4 2.4-1a8 8 0 0 0 1.7 1l.4 3.1h5l.4-3.1a8 8 0 0 0 1.7-1l2.4 1 2-3.4-2.1-1.5a7 7 0 0 0 .1-1Z" />
    </svg>
  );
}

export default function Sidebar() {
  const pathname = usePathname();

  const { user } = useAuth();

  const {
    level,
    xp,
    availableAttacks,
    monsterDefeated,
  } = useGame();

  function isActive(href: string) {
    if (href === "/city") {
      return pathname === "/city";
    }

    return pathname.startsWith(href);
  }

  const playerName =
    user?.name?.trim() || "Mayor";

  const playerInitials =
    user?.initials ||
    playerName
      .charAt(0)
      .toUpperCase();

  return (
    <aside className={styles.sidebar}>
      <Link
        href="/city"
        className={styles.logo}
      >
        <span className={styles.logoMark}>
          CW
        </span>

        <span className={styles.logoText}>
          CityWallet
        </span>
      </Link>

      <p className={styles.sectionTitle}>
        MAIN MENU
      </p>

      <nav className={styles.navigation}>
        {navigation.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.link} ${
              isActive(item.href)
                ? styles.active
                : ""
            }`}
          >
            <span className={styles.icon}>
              <NavigationIcon
                name={item.icon}
              />
            </span>

            <span className={styles.linkText}>
              {item.label}
            </span>

            {item.icon === "monster" && (
              <span className={styles.badge}>
                {monsterDefeated
                  ? "✓"
                  : availableAttacks}
              </span>
            )}
          </Link>
        ))}
      </nav>

      <div className={styles.profileCard}>
        <div className={styles.avatar}>
          {playerInitials}
        </div>

        <div
          className={
            styles.profileInformation
          }
        >
          <strong>{playerName}</strong>

          <span>
            Level {level} Builder
          </span>
        </div>

        <div className={styles.xp}>
          {xp}
        </div>
      </div>
    </aside>
  );
}