"use client";

import type {
  ReactNode,
} from "react";

import {
  AuthProvider,
} from "@/context/AuthContext";

import {
  BudgetProvider,
} from "@/context/BudgetContext";

import {
  GameProvider,
} from "@/context/GameContext";

import {
  FinancialAnalysisProvider,
} from "@/context/FinancialAnalysisContext";

import {
  LanguageProvider,
} from "@/context/LanguageContext";

type AppShellProps = {
  children: ReactNode;
};

export default function AppShell({
  children,
}: AppShellProps) {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BudgetProvider>
          <GameProvider>
            <FinancialAnalysisProvider>
              {children}
            </FinancialAnalysisProvider>
          </GameProvider>
        </BudgetProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}