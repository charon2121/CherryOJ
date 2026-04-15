import AuthSnapshot from "@/components/auth/AuthSnapshot.client";
import OJChrome from "@/components/oj/OJChrome.client";
import { getCurrentUser } from "@/lib/session/get-current-user";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <AuthSnapshot user={user}>
      <OJChrome user={user}>{children}</OJChrome>
    </AuthSnapshot>
  );
}
