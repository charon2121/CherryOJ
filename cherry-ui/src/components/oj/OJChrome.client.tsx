"use client";

import type { UserProfile } from "@/lib/api/endpoints/auth.client";
import { logout as logoutApi } from "@/lib/api/endpoints/auth.client";
import CherryIcon from "@/components/icon/cherry";
import ThemeToggle from "@/components/theme/ThemeToggle.client";
import { useAuthStore } from "@/lib/auth/auth.store";
import { useUiStore } from "@/lib/state/ui.store";
import { Link } from "@heroui/react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef } from "react";

const nav = [
  { label: "题库", href: "/problems" },
  { label: "比赛", href: "#contests" },
  { label: "提交记录", href: "#submissions" },
  { label: "讨论", href: "#discuss" },
];

export default function OJChrome({
  children,
  user,
}: {
  children: React.ReactNode;
  user: UserProfile | null;
}) {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const menuOpen = useUiStore((s) => s.ojUserMenuOpen);
  const toggleMenuOpen = useUiStore((s) => s.toggleOjUserMenu);
  const closeMenu = useUiStore((s) => s.closeOjUserMenu);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }
    function onPointerDown(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        closeMenu();
      }
    }
    window.addEventListener("mousedown", onPointerDown);
    return () => {
      window.removeEventListener("mousedown", onPointerDown);
    };
  }, [closeMenu, menuOpen]);

  async function onLogout() {
    closeMenu();
    await logoutApi();
    setUser(null);
    router.replace("/login");
    router.refresh();
  }

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
            <CherryIcon />
            <span className="hidden sm:inline">
              <span>Cherry</span>
              <span className="text-rose-600">OJ</span>
            </span>
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
            {user ? (
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={toggleMenuOpen}
                  className="inline-flex h-8 items-center gap-2 rounded-lg px-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-200/70 dark:text-zinc-300 dark:hover:bg-white/[0.06]"
                  aria-haspopup="menu"
                  aria-expanded={menuOpen}
                >
                  <span className="hidden sm:inline">{user.nickname || user.username}</span>
                  <span className="sm:hidden">{(user.nickname || user.username).slice(0, 1)}</span>
                  <span className={`text-xs transition-transform ${menuOpen ? "rotate-180" : ""}`}>▾</span>
                </button>
                {menuOpen ? (
                  <div className="absolute right-0 top-10 z-50 w-52 overflow-hidden rounded-xl border border-zinc-200/90 bg-white shadow-lg dark:border-white/[0.08] dark:bg-[#111113]">
                    <div className="border-b border-zinc-200/80 px-4 py-3 dark:border-white/[0.08]">
                      <div className="text-sm font-medium text-zinc-900 dark:text-white">
                        {user.nickname || user.username}
                      </div>
                      <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{user.email}</div>
                    </div>
                    <div className="py-1.5">
                      {user.isAdmin === 1 ? (
                        <NextLink
                          href="/admin"
                          className="block px-4 py-2.5 text-sm text-zinc-700 no-underline transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-white/[0.06]"
                          onClick={closeMenu}
                        >
                          进入管理后台
                        </NextLink>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => void onLogout()}
                        className="block w-full px-4 py-2.5 text-left text-sm text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-white/[0.06]"
                      >
                        退出登录
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            ) : (
              <>
                <NextLink
                  href="/login"
                  className="hidden h-8 items-center justify-center rounded-lg px-3 text-sm font-medium text-zinc-700 no-underline transition-colors hover:bg-zinc-200/70 sm:inline-flex dark:text-zinc-300 dark:hover:bg-white/[0.06]"
                >
                  登录
                </NextLink>
                <NextLink
                  href="/register"
                  className="inline-flex h-8 items-center justify-center rounded-lg bg-rose-600 px-3 text-sm font-medium text-white no-underline hover:bg-rose-500"
                >
                  注册
                </NextLink>
              </>
            )}
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
