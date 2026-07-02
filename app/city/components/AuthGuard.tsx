"use client";

import {
  useEffect,
  type ReactNode,
} from "react";

import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";

import styles from "./AuthGuard.module.css";

export default function AuthGuard({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();

  const {
    user,
    isReady,
  } = useAuth();

  useEffect(() => {
    if (isReady && !user) {
      router.replace("/login");
    }
  }, [isReady, user, router]);

  if (!isReady || !user) {
    return (
      <div className={styles.loading}>
        <div className={styles.loader}>
          <span></span>
          <span></span>
          <span></span>
        </div>

        <strong>
          Loading your financial city...
        </strong>
      </div>
    );
  }

  return children;
}