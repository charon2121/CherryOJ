"use client";

import ThemeToggle from "@/components/theme/ThemeToggle.client";
import { logout as logoutApi, type UserProfile } from "@/lib/api/endpoints/auth.client";
import { useAuthStore } from "@/lib/auth/auth.store";
import { Button, Link } from "@heroui/react";
import {
  BookOpen,
  CircleHelp,
  List,
  LogOut,
  Plus,
  SquareArrowOutUpRight,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

type NavItem = {
  label: string;
  href: string;
  icon: typeof List;
  description?: string;
};

const contentItems: NavItem[] = [
  { label: "题目管理", href: "/admin/problems", icon: BookOpen, description: "Problems" },
  { label: "新建题目", href: "/admin/problems/new", icon: Plus, description: "Create" },
];

function SidebarNavItem({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={`group relative flex h-11 w-full items-center gap-3 rounded-xl px-3 text-sm no-underline transition-colors ${
        active
          ? "bg-[color:var(--surface-secondary)] text-[color:var(--foreground)]"
          : "text-[color:var(--muted)] hover:bg-[color:var(--surface-secondary)] hover:text-[color:var(--foreground)]"
      }`}
    >
      {active ? <span className="absolute left-0 h-5 w-0.5 rounded-full bg-[color:var(--accent)]" /> : null}
      <span
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
          active ? "bg-[color:var(--surface)]" : "bg-transparent"
        }`}
      >
        <Icon className="h-4 w-4" strokeWidth={1.85} />
      </span>
      <span className="min-w-0">
        <span className="block leading-4">{item.label}</span>
        {item.description ? (
          <span className="block text-[11px] leading-4 text-[color:var(--muted)]">{item.description}</span>
        ) : null}
      </span>
    </Link>
  );
}

export default function AdminSidebar({ user }: { user: UserProfile }) {
  const pathname = usePathname();
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  async function onLogout() {
    await logoutApi();
    setUser(null);
    router.replace("/login");
    router.refresh();
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-[color:var(--border)] px-3 py-3">
        <Link
          href="/admin/problems"
          className="flex w-full items-center gap-3 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-secondary)] px-3 py-3 text-[color:var(--foreground)] no-underline transition-colors hover:bg-[color:var(--surface-tertiary)]"
          aria-label="返回后台题目管理"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[color:var(--foreground)] text-xs font-semibold text-[color:var(--background)]">
            C
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold leading-4 tracking-tight">CherryOJ</span>
            <span className="block truncate text-[11px] leading-4 text-[color:var(--muted)]">
              Management Console
            </span>
          </span>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4">
        <div className="space-y-5">
          <div>
            <div className="mb-2 px-3 text-[11px] font-medium uppercase tracking-[0.14em] text-[color:var(--muted)]">
              Workspace
            </div>
            <div className="w-full space-y-1">
              {contentItems.map((item) => (
                <SidebarNavItem
                  key={item.href}
                  item={item}
                  active={pathname === item.href || (item.href === "/admin/problems" && pathname === "/admin")}
                />
              ))}
            </div>
          </div>
        </div>
      </nav>

      <div className="border-t border-[color:var(--border)] p-3">
        <div className="space-y-1">
          <div className="flex h-11 items-center justify-between rounded-xl px-3 text-sm text-[color:var(--muted)]">
            <span className="flex items-center gap-3">
              <CircleHelp className="h-4 w-4" strokeWidth={1.85} />
              主题
            </span>
            <ThemeToggle />
          </div>
          <Button
            type="button"
            variant="tertiary"
            className="h-11 w-full justify-start gap-3 rounded-xl px-3 text-[color:var(--muted)] hover:text-[color:var(--foreground)]"
            onPress={() => router.push("/problems")}
          >
            <SquareArrowOutUpRight className="h-4 w-4" strokeWidth={1.85} />
            返回前台
          </Button>
          <Button
            type="button"
            variant="tertiary"
            className="h-11 w-full justify-start gap-3 rounded-xl px-3 text-[color:var(--danger)]"
            onPress={() => {
              void onLogout();
            }}
          >
            <LogOut className="h-4 w-4" strokeWidth={1.85} />
            退出登录
          </Button>
        </div>
        <div className="sr-only">当前管理员：{user.username}</div>
      </div>
    </div>
  );
}
