"use client";

import type { UserProfile } from "@/lib/api/endpoints/auth.client";
import { logout as logoutApi } from "@/lib/api/endpoints/auth.client";
import { useAuthStore } from "@/lib/auth/auth.store";
import { Badge, Button, Card, Link } from "@heroui/react";
import NextLink from "next/link";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  { label: "题目", href: "/admin" },
  { label: "新建", href: "/admin/problems/new" },
];

export default function AdminChrome({
  children,
  user,
}: {
  children: React.ReactNode;
  user: UserProfile;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);

  async function onLogout() {
    await logoutApi();
    setUser(null);
    router.replace("/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#f7f7f8] text-zinc-900">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[220px_1fr]">
        <aside className="border-b border-zinc-200/80 bg-[#fbfbfc] lg:border-b-0 lg:border-r">
          <div className="px-4 py-4">
            <Link href="/admin" className="flex items-center gap-3 text-zinc-900 no-underline">
              <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-xs font-semibold text-white">
                C
              </div>
              <div>
                <div className="text-sm font-semibold tracking-tight">Cherry</div>
                <div className="text-[11px] text-zinc-500">Admin</div>
              </div>
            </Link>
          </div>

          <nav className="px-3 pb-3">
            <div className="space-y-0.5">
              {navItems.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm no-underline transition-colors ${
                      active
                        ? "bg-zinc-900 text-white"
                        : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                    }`}
                  >
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>

          <div className="px-3 py-3">
            <Card className="border border-zinc-200/80 bg-white shadow-none">
              <Card.Content className="space-y-3 p-3">
                <div className="space-y-1">
                  <div className="text-sm font-medium text-zinc-900">{user.nickname || user.username}</div>
                  <div className="text-xs text-zinc-500">{user.email}</div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="soft" color="success">
                    Admin
                  </Badge>
                </div>

                <div className="flex gap-2">
                  <NextLink
                    href="/problems"
                    className="inline-flex flex-1 items-center justify-center rounded-lg border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-700 no-underline hover:bg-zinc-50"
                  >
                    前台
                  </NextLink>
                  <Button size="sm" variant="danger-soft" className="flex-1" onPress={() => void onLogout()}>
                    退出
                  </Button>
                </div>
              </Card.Content>
            </Card>
          </div>
        </aside>

        <div className="min-w-0">
          <header className="border-b border-zinc-200/80 bg-[#fdfdfd]">
            <div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div>
                <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-400">Workspace</div>
                <div className="mt-1 text-xl font-semibold tracking-tight text-zinc-900">内容管理</div>
              </div>
              <div className="flex gap-2">
                <NextLink
                  href="/admin"
                  className="inline-flex h-8 items-center justify-center rounded-lg px-3 text-sm font-medium text-zinc-700 no-underline hover:bg-zinc-100"
                >
                  题目
                </NextLink>
                <NextLink
                  href="/admin/problems/new"
                  className="inline-flex h-8 items-center justify-center rounded-lg bg-zinc-900 px-3 text-sm font-medium text-white no-underline hover:bg-zinc-800"
                >
                  新建
                </NextLink>
              </div>
            </div>
          </header>

          <main className="px-4 py-5 sm:px-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
