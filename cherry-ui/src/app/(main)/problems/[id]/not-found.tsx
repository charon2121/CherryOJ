import OJChrome from "@/components/oj/OJChrome.client";
import Link from "next/link";

export default function ProblemNotFound() {
  return (
    <OJChrome>
      <main className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
        <p className="text-sm font-medium text-rose-600 dark:text-rose-400">404</p>
        <h1 className="mt-2 text-2xl font-semibold text-zinc-900 dark:text-white">未找到该题目</h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">题号可能不存在或已下线。</p>
        <Link
          href="/problems"
          className="mt-8 inline-flex h-10 items-center justify-center rounded-lg bg-rose-600 px-5 text-sm font-medium text-white no-underline transition-colors hover:bg-rose-500"
        >
          返回题库
        </Link>
      </main>
    </OJChrome>
  );
}
