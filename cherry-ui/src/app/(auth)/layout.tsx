import AuthSnapshot from "@/components/auth/AuthSnapshot.client";
import { getCurrentUser } from "@/lib/session/get-current-user";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  return (
    <AuthSnapshot user={user}>
      <div className="min-h-dvh bg-[color:var(--background)] text-[color:var(--foreground)]">
        <div className="mx-auto flex min-h-dvh w-full max-w-[1280px] items-center justify-center px-4 py-8 sm:px-6">
          <div className="w-full max-w-[420px]">{children}</div>
        </div>
      </div>
    </AuthSnapshot>
  );
}
