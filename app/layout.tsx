import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";

import { AuthProvider } from "@/context/AuthContext";
import { BudgetProvider } from "@/context/BudgetContext";
import { GameProvider } from "@/context/GameContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { FinancialAnalysisProvider } from "@/context/FinancialAnalysisContext";

export const metadata: Metadata = {
  title: "CityWallet",
  description:
    "An interactive personal finance and city-building game",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html
      lang="en"
      dir="ltr"
      suppressHydrationWarning
    >
      <body>
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
      </body>
    </html>
  );
}