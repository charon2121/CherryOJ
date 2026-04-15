"use client";

import type { UserProfile } from "@/lib/api/endpoints/auth.client";
import { logout as logoutApi } from "@/lib/api/endpoints/auth.client";
import { useAuthStore } from "@/lib/auth/auth.store";
import ThemeToggle from "@/components/theme/ThemeToggle.client";
import { Button, Dropdown, Label, Link } from "@heroui/react";
import { ChevronRight, FolderOpen, LayoutGrid, List, LogOut, Plus, SquareArrowOutUpRight, User2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";

const navGroups = [
  {
    id: "problems",
    label: "题目管理",
    items: [
      { label: "全部题目", href: "/admin", icon: "list" },
      { label: "新建题目", href: "/admin/problems/new", icon: "plus" },
    ],
    icon: "folder",
  },
] as const;

function NavIcon({
  name,
  className,
}: {
  name: "folder" | "list" | "plus";
  className?: string;
}) {
  if (name === "folder") return <FolderOpen className={className} strokeWidth={1.8} />;
  if (name === "plus") return <Plus className={className} strokeWidth={1.8} />;
  return <List className={className} strokeWidth={1.8} />;
}

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
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    problems: true,
  });

  const activeGroupId = useMemo(
    () => navGroups.find((group) => group.items.some((item) => pathname === item.href))?.id ?? null,
    [pathname],
  );

  async function onLogout() {
    await logoutApi();
    setUser(null);
    router.replace("/login");
    router.refresh();
  }

  function toggleGroup(id: string) {
    setExpandedGroups((current) => ({
      ...current,
      [id]: !current[id],
    }));
  }

  return (
    <div className="min-h-screen bg-[color:var(--background)] text-[color:var(--foreground)]">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[220px_1fr]">
        <aside className="flex border-b border-[color:var(--border)] bg-[color:var(--surface)] lg:min-h-screen lg:flex-col lg:border-b-0 lg:border-r">
          <div className="px-4 py-4">
            <Link href="/admin" className="flex items-center gap-3 text-[color:var(--foreground)] no-underline">
              <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[color:var(--foreground)] text-xs font-semibold text-[color:var(--background)]">
                C
              </div>
              <div>
                <div className="text-sm font-semibold tracking-tight">Cherry</div>
                <div className="text-[11px] text-[color:var(--muted)]">Admin</div>
              </div>
            </Link>
          </div>

          <nav className="px-3 pb-4 lg:flex-1">
            <div className="mb-3 px-3 text-[11px] font-medium uppercase tracking-[0.14em] text-[color:var(--muted)]">
              内容
            </div>
            <div className="space-y-1.5">
              {navGroups.map((group) => {
                const open = expandedGroups[group.id] ?? group.id === activeGroupId;
                return (
                  <div key={group.id} className="space-y-1">
                    <Button
                      variant="tertiary"
                      onPress={() => toggleGroup(group.id)}
                      className={`h-10 w-full justify-between rounded-xl px-3 ${
                        group.id === activeGroupId
                          ? "bg-[color:var(--surface-secondary)] text-[color:var(--foreground)]"
                          : "text-[color:var(--muted)] hover:bg-[color:var(--surface-secondary)] hover:text-[color:var(--foreground)]"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <NavIcon name={group.icon} className="h-4 w-4" />
                        <span>{group.label}</span>
                      </span>
                      <ChevronRight className={`h-4 w-4 transition-transform ${open ? "rotate-90" : ""}`} strokeWidth={1.8} />
                    </Button>

                    {open ? (
                      <div className="space-y-1 pl-3">
                        {group.items.map((item) => {
                          const active = pathname === item.href;
                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              className={`flex h-9 items-center gap-2 rounded-xl px-3 text-sm no-underline transition-colors ${
                                active
                                  ? "bg-[color:var(--foreground)] text-[color:var(--background)]"
                                  : "text-[color:var(--muted)] hover:bg-[color:var(--surface-secondary)] hover:text-[color:var(--foreground)]"
                              }`}
                            >
                              <NavIcon name={item.icon} className="h-4 w-4" />
                              <span>{item.label}</span>
                            </Link>
                          );
                        })}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </nav>
        </aside>

        <div className="min-w-0">
          <header className="border-b border-[color:var(--border)] bg-[color:var(--surface)]">
            <div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div>
                <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-[color:var(--muted)]">Workspace</div>
                <div className="mt-1 flex items-center gap-2 text-xl font-semibold tracking-tight text-[color:var(--foreground)]">
                  <LayoutGrid className="h-4 w-4 text-[color:var(--muted)]" strokeWidth={1.9} />
                  <span>内容管理</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <Dropdown>
                  <Button variant="secondary" size="sm" className="gap-2 rounded-xl">
                    <User2 className="h-4 w-4 text-[color:var(--muted)]" strokeWidth={1.9} />
                    <span>{user.nickname || user.username}</span>
                  </Button>
                  <Dropdown.Popover className="min-w-[220px]">
                    <Dropdown.Menu
                      onAction={(key) => {
                        if (key === "new-problem") {
                          router.push("/admin/problems/new");
                          return;
                        }
                        if (key === "front") {
                          router.push("/problems");
                          return;
                        }
                        if (key === "logout") {
                          void onLogout();
                        }
                      }}
                    >
                      <Dropdown.Section>
                        <Dropdown.Item id="identity" textValue={user.nickname || user.username} isDisabled>
                          <div className="flex flex-col">
                            <Label>{user.nickname || user.username}</Label>
                            <span className="text-xs text-[color:var(--muted)]">{user.email}</span>
                          </div>
                        </Dropdown.Item>
                      </Dropdown.Section>
                      <Dropdown.Section>
                        <Dropdown.Item id="new-problem" textValue="新建题目">
                          <div className="flex items-center gap-2">
                            <Plus className="h-4 w-4" strokeWidth={1.9} />
                            <Label>新建题目</Label>
                          </div>
                        </Dropdown.Item>
                        <Dropdown.Item id="front" textValue="返回前台">
                          <div className="flex items-center gap-2">
                            <SquareArrowOutUpRight className="h-4 w-4" strokeWidth={1.9} />
                            <Label>返回前台</Label>
                          </div>
                        </Dropdown.Item>
                        <Dropdown.Item id="logout" textValue="退出登录" variant="danger">
                          <div className="flex items-center gap-2">
                            <LogOut className="h-4 w-4" strokeWidth={1.9} />
                            <Label>退出登录</Label>
                          </div>
                        </Dropdown.Item>
                      </Dropdown.Section>
                    </Dropdown.Menu>
                  </Dropdown.Popover>
                </Dropdown>
              </div>
            </div>
          </header>

          <main className="px-4 py-5 sm:px-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
