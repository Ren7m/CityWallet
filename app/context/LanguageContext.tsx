"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  translations,
  type Language,
  type TranslationKey,
} from "@/translations";

type TranslationValues = Record<
  string,
  string | number
>;

type LanguageContextType = {
  language: Language;
  isArabic: boolean;
  isReady: boolean;
  setLanguage: (language: Language) => void;
  t: (
    key: TranslationKey,
    values?: TranslationValues
  ) => string;
  formatNumber: (value: number) => string;
};

const LanguageContext =
  createContext<LanguageContextType | null>(null);

const LANGUAGE_STORAGE_KEY =
  "fincity-language";

function isLanguage(
  value: string | null
): value is Language {
  return value === "ar" || value === "en";
}

function updateDocumentLanguage(
  language: Language
) {
  document.documentElement.lang = language;
  document.documentElement.dir =
    language === "ar" ? "rtl" : "ltr";
}

export function LanguageProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [language, setCurrentLanguage] =
    useState<Language>("en");

  const [isReady, setIsReady] =
    useState(false);

  useEffect(() => {
    const savedLanguage =
      window.localStorage.getItem(
        LANGUAGE_STORAGE_KEY
      );

    if (isLanguage(savedLanguage)) {
      setCurrentLanguage(savedLanguage);
      updateDocumentLanguage(savedLanguage);
    } else {
      updateDocumentLanguage("en");
    }

    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    window.localStorage.setItem(
      LANGUAGE_STORAGE_KEY,
      language
    );

    updateDocumentLanguage(language);
  }, [language, isReady]);

  const setLanguage = useCallback(
    (newLanguage: Language) => {
      setCurrentLanguage(newLanguage);
    },
    []
  );

  const t = useCallback(
    (
      key: TranslationKey,
      values?: TranslationValues
    ) => {
      let text =
        translations[language][key] ??
        translations.en[key] ??
        key;

      if (values) {
        Object.entries(values).forEach(
          ([name, value]) => {
            text = text.replaceAll(
              `{{${name}}}`,
              String(value)
            );
          }
        );
      }

      return text;
    },
    [language]
  );

  const formatNumber = useCallback(
    (value: number) => {
      return new Intl.NumberFormat(
        language === "ar"
          ? "ar-SA"
          : "en-US",
        {
          maximumFractionDigits: 2,
        }
      ).format(value);
    },
    [language]
  );

  const value = useMemo(
    () => ({
      language,
      isArabic: language === "ar",
      isReady,
      setLanguage,
      t,
      formatNumber,
    }),
    [
      language,
      isReady,
      setLanguage,
      t,
      formatNumber,
    ]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error(
      "useLanguage must be used inside LanguageProvider"
    );
  }

  return context;
}