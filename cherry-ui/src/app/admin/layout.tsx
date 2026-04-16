import type { ReactNode } from "react";
import AdminQueryProvider from "./providers";
import AdminShell from "@/components/admin/shell/AdminShell.client";
import { requireAdmin } from "@/lib/session/require-admin";
import AuthSnapshot from "@/components/auth/AuthSnapshot.client";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await requireAdmin();

  return (
    <AdminQueryProvider>
      <AuthSnapshot user={user}>
        <AdminShell user={user}>{children}</AdminShell>
      </AuthSnapshot>
    </AdminQueryProvider>
  );
}
