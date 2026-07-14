"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type AppLanguage =
  | "en-US"
  | "ar-SA";

type LanguageContextType = {
  language: AppLanguage;

  isArabic: boolean;

  isEnglish: boolean;

  setLanguage: (
    language: AppLanguage
  ) => void;

  toggleLanguage: () => void;
};

const STORAGE_KEY =
  "citywallet-language";

const DEFAULT_LANGUAGE:
  AppLanguage = "en-US";

const LanguageContext =
  createContext<
    LanguageContextType | undefined
  >(undefined);

type LanguageProviderProps = {
  children: ReactNode;
};

export function LanguageProvider({
  children,
}: LanguageProviderProps) {
  const [
    language,
    setLanguageState,
  ] =
    useState<AppLanguage>(
      DEFAULT_LANGUAGE
    );

  const [
    isReady,
    setIsReady,
  ] = useState(false);

  useEffect(() => {
    const savedLanguage =
      window.localStorage.getItem(
        STORAGE_KEY
      );

    if (
      savedLanguage === "en-US" ||
      savedLanguage === "ar-SA"
    ) {
      setLanguageState(
        savedLanguage
      );
    }

    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    const isArabicLanguage =
      language === "ar-SA";

    window.localStorage.setItem(
      STORAGE_KEY,
      language
    );

    document.documentElement.lang =
      language;

    document.documentElement.dir =
      isArabicLanguage
        ? "rtl"
        : "ltr";

    document.body.dir =
      isArabicLanguage
        ? "rtl"
        : "ltr";
  }, [
    language,
    isReady,
  ]);

  function setLanguage(
    newLanguage: AppLanguage
  ) {
    setLanguageState(
      newLanguage
    );
  }

  function toggleLanguage() {
    setLanguageState(
      (currentLanguage) =>
        currentLanguage === "en-US"
          ? "ar-SA"
          : "en-US"
    );
  }

  const value =
    useMemo<LanguageContextType>(
      () => ({
        language,

        isArabic:
          language === "ar-SA",

        isEnglish:
          language === "en-US",

        setLanguage,

        toggleLanguage,
      }),
      [language]
    );

  return (
    <LanguageContext.Provider
      value={value}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context =
    useContext(
      LanguageContext
    );

  if (!context) {
    throw new Error(
      "useLanguage must be used inside LanguageProvider"
    );
  }

  return context;
}