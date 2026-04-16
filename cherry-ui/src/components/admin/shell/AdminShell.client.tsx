"use client";

import type { UserProfile } from "@/lib/api/endpoints/auth.client";
import AdminSidebar from "./AdminSidebar.client";

export default function AdminShell({
  children,
  user,
}: {
  children: React.ReactNode;
  user: UserProfile;
}) {
  return (
    <div className="grid min-h-screen grid-cols-1 bg-[color:var(--background)] text-[color:var(--foreground)] lg:grid-cols-[240px_1fr]">
      <aside className="sticky top-0 hidden h-screen border-r border-[color:var(--border)] bg-[color:var(--surface)] lg:block">
        <AdminSidebar user={user} />
      </aside>
      <main className="min-h-screen min-w-0 overflow-y-auto">
        <div className="p-4 sm:p-6">{children}</div>
      </main>
    </div>
  );
}
