import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono } from "next/font/google";
import { cookies } from "next/headers";
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

type ThemeSetting = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

const THEME_COOKIE_NAME = "cherry-ui-theme";

function parseTheme(value?: string): ThemeSetting {
  return value === "light" || value === "dark" || value === "system" ? value : "system";
}

function resolveServerTheme(theme: ThemeSetting): ResolvedTheme {
  return theme === "light" ? "light" : "dark";
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme = parseTheme((await cookies()).get(THEME_COOKIE_NAME)?.value);
  const resolvedTheme = resolveServerTheme(theme);
  const htmlClassName = resolvedTheme === "dark" ? "dark" : undefined;

  return (
    <html
      lang="zh-CN"
      className={htmlClassName}
      data-theme={resolvedTheme}
      style={{ colorScheme: resolvedTheme }}
      suppressHydrationWarning
    >
      <body
        className={`${dmSans.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <ThemeProvider initialTheme={theme} initialResolvedTheme={resolvedTheme}>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
