"use client";

import {
  useLanguage,
} from "@/context/LanguageContext";

import styles from "./LanguageSwitcher.module.css";

export default function LanguageSwitcher() {
  const {
    language,
    setLanguage,
  } = useLanguage();

  return (
    <div
      className={styles.switcher}
      role="group"
      aria-label="Language selection"
    >
      <button
        type="button"
        className={
          language === "en-US"
            ? styles.active
            : ""
        }
        onClick={() =>
          setLanguage("en-US")
        }
        aria-pressed={
          language === "en-US"
        }
      >
        <span
          className={
            styles.desktopLabel
          }
        >
          English
        </span>

        <span
          className={
            styles.mobileLabel
          }
        >
          EN
        </span>
      </button>

      <button
        type="button"
        className={
          language === "ar-SA"
            ? styles.active
            : ""
        }
        onClick={() =>
          setLanguage("ar-SA")
        }
        aria-pressed={
          language === "ar-SA"
        }
      >
        <span
          className={
            styles.desktopLabel
          }
        >
          العربية السعودية
        </span>

        <span
          className={
            styles.mobileLabel
          }
        >
          عربي
        </span>
      </button>
    </div>
  );
}