import AuthSnapshot from "@/components/auth/AuthSnapshot.client";
import { getCurrentUser } from "@/lib/session/get-current-user";
import Link from "next/link";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  return (
    <AuthSnapshot user={user}>
      <div className="min-h-dvh bg-zinc-50 text-zinc-900 dark:bg-[#070708] dark:text-zinc-100">
        <div className="mx-auto flex min-h-dvh max-w-lg flex-col justify-center px-4 py-12 sm:px-6">
          <div className="mb-8 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-lg font-semibold tracking-tight text-zinc-900 no-underline dark:text-white"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-rose-500 to-rose-700 text-sm font-bold text-white shadow-lg shadow-rose-500/25">
                C
              </span>
              CherryOJ
            </Link>
          </div>
          {children}
        </div>
      </div>
    </AuthSnapshot>
  );
}
