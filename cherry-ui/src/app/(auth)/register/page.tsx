import RegisterPage from "@/components/auth/RegisterPage.client";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="rounded-lg border border-zinc-200/80 bg-white/90 px-6 py-12 text-center text-sm text-zinc-500 dark:border-white/[0.08] dark:bg-zinc-900/80 dark:text-zinc-400">
          加载中…
        </div>
      }
    >
      <RegisterPage />
    </Suspense>
  );
}
