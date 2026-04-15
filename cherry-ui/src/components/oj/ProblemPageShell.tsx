import type { Problem } from "@/data/problems";
import { Badge, Link } from "@heroui/react";

import ProblemEditorPane from "./ProblemEditorPane.client";

function diffPill(d: Problem["difficulty"]) {
  if (d === "入门") return "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300";
  if (d === "进阶") return "bg-amber-500/15 text-amber-900 dark:text-amber-300";
  return "bg-rose-500/15 text-rose-900 dark:text-rose-300";
}

export default function ProblemPageShell({ problem }: { problem: Problem }) {
  const descriptionBlocks = problem.description.split(/\n\n+/);

  return (
    <div className="flex min-h-[calc(100dvh-3.5rem)] flex-col border-t border-zinc-200/80 dark:border-white/[0.06] lg:flex-row">
      <section className="flex w-full flex-col border-zinc-200/80 dark:border-white/[0.06] lg:w-[46%] lg:max-w-xl lg:border-r xl:max-w-none xl:flex-1">
        <div className="border-b border-zinc-200/80 px-4 py-3 dark:border-white/[0.06] sm:px-5">
          <nav className="mb-2 flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
            <Link href="/" className="no-underline hover:text-rose-600 dark:hover:text-rose-400">
              CherryOJ
            </Link>
            <span aria-hidden>/</span>
            <Link href="/problems" className="no-underline hover:text-rose-600 dark:hover:text-rose-400">
              题库
            </Link>
            <span aria-hidden>/</span>
            <span className="text-zinc-700 dark:text-zinc-300">{problem.id}</span>
          </nav>
          <div className="flex flex-wrap items-center gap-2 gap-y-2">
            <h1 className="text-lg font-semibold text-zinc-900 dark:text-white sm:text-xl">
              {problem.id}. {problem.title}
            </h1>
            <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${diffPill(problem.difficulty)}`}>
              {problem.difficulty}
            </span>
            <Badge variant="soft" className="tabular-nums">
              {problem.acceptancePct.toFixed(1)}% 通过
            </Badge>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {problem.tags.map((t) => (
              <Badge key={t} variant="soft">
                {t}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-5 sm:px-5">
          <div className="mx-auto max-w-2xl space-y-8 text-[15px] leading-relaxed text-zinc-700 dark:text-zinc-300">
            <section className="space-y-5">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">题目描述</h2>
                <div className="text-xs text-zinc-500">
                  时限 <strong className="text-zinc-700 dark:text-zinc-300">{problem.timeLimit}</strong> · 内存{" "}
                  <strong className="text-zinc-700 dark:text-zinc-300">{problem.memoryLimit}</strong>
                </div>
              </div>
              {descriptionBlocks.map((block, index) => (
                <p key={index} className="whitespace-pre-wrap">
                  {block}
                </p>
              ))}
            </section>

            <section>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">示例</h2>
              <div className="space-y-4">
                {problem.examples.map((ex, idx) => (
                  <div
                    key={idx}
                    className="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 dark:border-white/[0.08] dark:bg-zinc-950/50"
                  >
                    <div className="grid gap-0 sm:grid-cols-2">
                      <div className="border-b border-zinc-200 p-3 sm:border-b-0 sm:border-r dark:border-white/[0.08]">
                        <div className="mb-1 text-xs font-medium text-zinc-500">输入</div>
                        <pre className="font-mono text-xs text-zinc-800 dark:text-zinc-200">{ex.input}</pre>
                      </div>
                      <div className="p-3">
                        <div className="mb-1 text-xs font-medium text-zinc-500">输出</div>
                        <pre className="font-mono text-xs text-zinc-800 dark:text-zinc-200">{ex.output}</pre>
                      </div>
                    </div>
                    {ex.explanation ? (
                      <div className="border-t border-zinc-200 px-3 py-2 text-xs text-zinc-600 dark:border-white/[0.08] dark:text-zinc-400">
                        解释：{ex.explanation}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">提示与约束</h2>
              <ul className="list-inside list-disc space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
                {problem.constraints.map((constraint, index) => (
                  <li key={index}>{constraint}</li>
                ))}
              </ul>
            </section>

            <section className="rounded-lg border border-zinc-200 bg-zinc-50/70 p-4 dark:border-white/[0.08] dark:bg-white/[0.03]">
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">题解</h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                官方题解与社区题解将在此展示。接入内容服务后可按点赞与时间排序。
              </p>
            </section>
          </div>
        </div>
      </section>

      <ProblemEditorPane problem={problem} />
    </div>
  );
}
