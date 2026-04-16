import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono } from "next/font/google";
import AuthProvider from "@/components/auth/AuthProvider.client";
import ThemeProvider from "@/components/theme/ThemeProvider.client";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  title: "CherryOJ — 在线评测",
  description: "现代在线评测系统：题库、比赛、提交与实时反馈",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body
        className={`${dmSans.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
