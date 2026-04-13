import AdminChrome from "@/components/admin/AdminChrome.client";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminChrome>{children}</AdminChrome>;
}
