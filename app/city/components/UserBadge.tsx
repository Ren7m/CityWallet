"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";

import styles from "./UserBadge.module.css";

export default function UserBadge() {
  const router = useRouter();

  const { user, logout } =
    useAuth();

  if (!user) {
    return null;
  }

  function handleLogout() {
    logout();
    router.replace("/");
  }

  return (
    <div className={styles.wrapper}>
      <Link
        href="/city/profile"
        className={styles.profile}
      >
        <span className={styles.avatar}>
          {user.initials}
        </span>

        <span
          className={
            styles.information
          }
        >
          <strong>{user.name}</strong>
          <small>{user.email}</small>
        </span>
      </Link>

      <button
        type="button"
        onClick={handleLogout}
      >
        Log out
      </button>
    </div>
  );
}