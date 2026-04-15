import AuthSnapshot from "@/components/auth/AuthSnapshot.client";
import AdminChrome from "@/components/admin/AdminChrome.client";
import { requireAdmin } from "@/lib/session/require-admin";
import { ReactNode } from "react";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await requireAdmin("/admin");
  return (
    <AuthSnapshot user={user}>
      <AdminChrome user={user}>{children}</AdminChrome>
    </AuthSnapshot>
  );
}
