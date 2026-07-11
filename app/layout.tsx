import type {
  Metadata,
} from "next";

import AppShell from "./AppShell";

import "./globals.css";

export const metadata: Metadata = {
  title: "CityWallet",

  description:
    "A gamified personal finance platform that turns financial habits into an interactive city experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppShell>
          {children}
        </AppShell>
      </body>
    </html>
  );
}