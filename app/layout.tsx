import type { Metadata } from "next";
import "./globals.css";

import { LanguageProvider } from "@/context/LanguageContext";
import { AuthProvider } from "@/context/AuthContext";
import { BudgetProvider } from "@/context/BudgetContext";
import { GameProvider } from "@/context/GameContext";
import { FinancialAnalysisProvider } from "@/context/FinancialAnalysisContext";

import AppShell from "./components/AppShell";

export const metadata: Metadata = {
  title: "CityWallet",
  description: "A gamified personal finance city simulator.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          <AuthProvider>
            <BudgetProvider>
              <GameProvider>
                <FinancialAnalysisProvider>
                  <AppShell>{children}</AppShell>
                </FinancialAnalysisProvider>
              </GameProvider>
            </BudgetProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}