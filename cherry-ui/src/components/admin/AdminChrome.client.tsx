"use client";

import RequireAdmin from "@/components/auth/RequireAdmin.client";
import { useAuthStore } from "@/lib/auth/auth.store";
import NextLink from "next/link";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  { label: "题目管理", href: "/admin" },
  { label: "新建题目", href: "/admin/problems/new" },
];

export default function AdminChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  async function onLogout() {
    await logout();
    router.replace("/login");
    router.refresh();
  }

  return (
    <RequireAdmin>
      <div className="min-h-screen bg-[#f4f1eb] text-zinc-900">
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 -z-10 opacity-70"
          style={{
            backgroundImage:
              "radial-gradient(circle at top left, rgba(190, 24, 93, 0.12), transparent 32%), radial-gradient(circle at bottom right, rgba(161, 98, 7, 0.10), transparent 28%)",
          }}
        />

        <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[260px_1fr]">
          <aside className="border-b border-zinc-200/80 bg-[#111111] px-5 py-6 text-zinc-100 lg:border-b-0 lg:border-r lg:px-6">
            <NextLink href="/admin" className="inline-flex items-center gap-2 text-lg font-semibold no-underline">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-rose-600 text-sm font-bold text-white">
                C
              </span>
              <span>
                Cherry<span className="text-rose-400">Admin</span>
              </span>
            </NextLink>

            <nav className="mt-8 flex flex-col gap-1.5">
              {navItems.map((item) => {
                const active = pathname === item.href;
                return (
                  <NextLink
                    key={item.href}
                    href={item.href}
                    className={`rounded-xl px-3 py-2.5 text-sm font-medium no-underline transition-colors ${
                      active
                        ? "bg-white text-zinc-900"
                        : "text-zinc-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </NextLink>
                );
              })}
            </nav>

            <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">当前账号</div>
              <div className="mt-2 text-sm font-medium text-white">{user?.nickname || user?.username}</div>
              <div className="mt-1 text-xs text-zinc-400">{user?.email}</div>
              <button
                type="button"
                onClick={() => void onLogout()}
                className="mt-4 inline-flex h-9 items-center justify-center rounded-lg bg-white/10 px-3 text-sm text-zinc-100 transition-colors hover:bg-white/20"
              >
                退出登录
              </button>
            </div>
          </aside>

          <div className="min-w-0">
            <header className="border-b border-zinc-200/80 bg-white/80 px-4 py-4 backdrop-blur-md sm:px-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-600">
                    Admin Console
                  </div>
                  <div className="mt-1 text-lg font-semibold text-zinc-900">后台管理</div>
                </div>
                <NextLink
                  href="/problems"
                  className="inline-flex h-9 items-center justify-center rounded-lg border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-700 no-underline transition-colors hover:bg-zinc-50"
                >
                  返回前台
                </NextLink>
              </div>
            </header>

            <main className="px-4 py-6 sm:px-6">{children}</main>
          </div>
        </div>
      </div>
    </RequireAdmin>
  );
}
