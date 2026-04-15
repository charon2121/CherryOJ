import AdminChrome from "@/components/admin/AdminChrome.client";
import { requireAdmin } from "@/lib/session/require-admin";
import { ReactNode } from "react";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await requireAdmin("/admin");
  return <AdminChrome user={user}>{children}</AdminChrome>;
}
