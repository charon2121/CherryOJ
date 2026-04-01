"use client";

import ThemeToggle from "@/components/theme/ThemeToggle.client";
import { Button, Link } from "@heroui/react";

const nav = [
  { label: "题库", href: "/problems" },
  { label: "比赛", href: "#contests" },
  { label: "提交记录", href: "#submissions" },
  { label: "讨论", href: "#discuss" },
];

export default function OJChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-[#070708] dark:text-zinc-100">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 opacity-30 dark:hidden"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(225, 29, 72, 0.14), transparent), radial-gradient(ellipse 60% 40% at 100% 0%, rgba(244, 63, 94, 0.08), transparent)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 hidden opacity-[0.55] dark:block"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(225, 29, 72, 0.22), transparent), radial-gradient(ellipse 60% 40% at 100% 0%, rgba(244, 63, 94, 0.12), transparent)",
        }}
      />

      <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/80 backdrop-blur-md dark:border-white/[0.06] dark:bg-[#070708]/85">
        <div className="mx-auto flex h-14 max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-6">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2 text-lg font-semibold tracking-tight text-zinc-900 no-underline dark:text-white"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-rose-500 to-rose-700 text-sm font-bold text-white shadow-lg shadow-rose-500/25">
              C
            </span>
            <span className="hidden sm:inline">CherryOJ</span>
          </Link>
          <nav className="hidden min-w-0 flex-1 items-center justify-center gap-0.5 md:flex lg:gap-1">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-2.5 py-2 text-sm text-zinc-600 no-underline transition-colors hover:bg-zinc-200/70 hover:text-zinc-900 lg:px-3 dark:text-zinc-400 dark:hover:bg-white/[0.06] dark:hover:text-zinc-100"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex shrink-0 items-center gap-2">
            <ThemeToggle />
            <Button size="sm" variant="tertiary" className="hidden sm:inline-flex">
              登录
            </Button>
            <Button size="sm" className="bg-rose-600 text-white hover:bg-rose-500">
              注册
            </Button>
          </div>
        </div>
      </header>

      {children}
    </div>
  );
}
