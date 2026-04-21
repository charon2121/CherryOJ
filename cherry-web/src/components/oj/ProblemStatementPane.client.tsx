"use client";

import { Tag } from "@/components/ui/Tag";
import type { Problem } from "@/data/problems";
import { Link } from "@heroui/react";
import { BookOpen, FileText, History } from "lucide-react";
import { useMemo, useState } from "react";

type StatementTab = "description" | "solutions" | "submissions";

function difficultyTone(difficulty: Problem["difficulty"]) {
  if (difficulty === "入门") return "success" as const;
  if (difficulty === "进阶") return "warning" as const;
  return "danger" as const;
}

function tabClassName(active: boolean) {
  return [
    "inline-flex h-10 items-center gap-2 border-b-2 px-1 text-sm font-medium transition-colors",
    active
      ? "border-[color:var(--accent)] text-[color:var(--foreground)]"
      : "border-transparent text-[color:var(--muted)] hover:text-[color:var(--foreground)]",
  ].join(" ");
}

export default function ProblemStatementPane({ problem }: { problem: Problem }) {
  const [tab, setTab] = useState<StatementTab>("description");
  const descriptionBlocks = useMemo(() => problem.description.split(/\n\n+/), [problem.description]);

  return (
    <section className="min-w-0 border-b border-[color:var(--border)] bg-[color:var(--surface)] xl:flex xl:min-h-0 xl:flex-col xl:border-b-0 xl:border-r">
      <div className="shrink-0 border-b border-[color:var(--border)] px-4 py-3 sm:px-5">
        <nav className="mb-3 flex flex-wrap items-center gap-2 text-xs text-[color:var(--muted)]">
          <Link href="/" className="no-underline hover:text-[color:var(--accent)]">
            CherryOJ
          </Link>
          <span aria-hidden>/</span>
          <Link href="/problems" className="no-underline hover:text-[color:var(--accent)]">
            题库
          </Link>
          <span aria-hidden>/</span>
          <span className="text-[color:var(--foreground)]">{problem.id}</span>
        </nav>

        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Tag tone={difficultyTone(problem.difficulty)}>{problem.difficulty}</Tag>
            <Tag className="tabular-nums">{problem.acceptancePct.toFixed(1)}% 通过</Tag>
            <Tag>{problem.timeLimit}</Tag>
            <Tag>{problem.memoryLimit}</Tag>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-normal text-[color:var(--foreground)]">
              {problem.id}. {problem.title}
            </h1>
            <div className="flex flex-wrap gap-2">
              {problem.tags.map((tag) => (
                <Tag key={tag} bordered={false}>
                  {tag}
                </Tag>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="shrink-0 border-b border-[color:var(--border)] px-4 sm:px-5">
        <div className="flex h-11 items-center gap-5">
          <button type="button" className={tabClassName(tab === "description")} onClick={() => setTab("description")}>
            <FileText size={15} aria-hidden />
            描述
          </button>
          <button type="button" className={tabClassName(tab === "solutions")} onClick={() => setTab("solutions")}>
            <BookOpen size={15} aria-hidden />
            题解
          </button>
          <button type="button" className={tabClassName(tab === "submissions")} onClick={() => setTab("submissions")}>
            <History size={15} aria-hidden />
            提交记录
          </button>
        </div>
      </div>

      <div className="px-4 py-5 sm:px-5 xl:min-h-0 xl:flex-1 xl:overflow-y-auto">
        {tab === "description" ? (
          <div className="mx-auto max-w-4xl space-y-8">
            <section className="space-y-4">
              <div className="text-sm font-medium text-[color:var(--foreground)]">题目描述</div>
              <div className="space-y-4 text-[15px] leading-7 text-[color:var(--foreground)]">
                {descriptionBlocks.map((block, index) => (
                  <p key={index} className="whitespace-pre-wrap">
                    {block}
                  </p>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <div className="text-sm font-medium text-[color:var(--foreground)]">示例</div>
              <div className="space-y-4">
                {problem.examples.map((example, index) => (
                  <div
                    key={index}
                    className="space-y-3 border-l-2 border-[color:var(--accent)] bg-[color:var(--surface-secondary)] px-4 py-3"
                  >
                    <div className="text-xs font-medium uppercase tracking-normal text-[color:var(--muted)]">
                      示例 {index + 1}
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="mb-2 text-sm font-medium text-[color:var(--foreground)]">输入</div>
                        <pre className="overflow-auto rounded-md border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-2 font-mono text-xs leading-6 text-[color:var(--foreground)]">
                          {example.input}
                        </pre>
                      </div>
                      <div>
                        <div className="mb-2 text-sm font-medium text-[color:var(--foreground)]">输出</div>
                        <pre className="overflow-auto rounded-md border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-2 font-mono text-xs leading-6 text-[color:var(--foreground)]">
                          {example.output}
                        </pre>
                      </div>
                      {example.explanation ? (
                        <div>
                          <div className="mb-2 text-sm font-medium text-[color:var(--foreground)]">解释</div>
                          <p className="text-sm leading-6 text-[color:var(--muted)]">{example.explanation}</p>
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <div className="text-sm font-medium text-[color:var(--foreground)]">提示与约束</div>
              <ul className="space-y-2 text-sm leading-6 text-[color:var(--muted)]">
                {problem.constraints.map((constraint, index) => (
                  <li key={index} className="flex gap-2">
                    <span className="mt-[0.55rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--accent)]" />
                    <span>{constraint}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        ) : null}

        {tab === "solutions" ? (
          <div className="mx-auto flex max-w-3xl flex-col items-start gap-3 py-12">
            <Tag tone="accent" bordered={false}>
              题解
            </Tag>
            <h2 className="text-xl font-semibold tracking-normal text-[color:var(--foreground)]">暂无公开题解</h2>
            <p className="max-w-xl text-sm leading-6 text-[color:var(--muted)]">
              这道题暂时还没有公开题解。
            </p>
          </div>
        ) : null}

        {tab === "submissions" ? (
          <div className="mx-auto max-w-4xl space-y-4">
            <div>
              <h2 className="text-lg font-semibold tracking-normal text-[color:var(--foreground)]">最近提交</h2>
              <p className="mt-1 text-sm text-[color:var(--muted)]">暂无本题提交记录。</p>
            </div>
            <div className="overflow-hidden rounded-md border border-[color:var(--border)]">
              <div className="grid grid-cols-[1fr_0.8fr_0.8fr_1fr] bg-[color:var(--surface-secondary)] px-3 py-2 text-xs font-medium text-[color:var(--muted)]">
                <span>状态</span>
                <span>语言</span>
                <span>用时</span>
                <span>提交时间</span>
              </div>
              <div className="px-3 py-10 text-center text-sm text-[color:var(--muted)]">暂无提交记录</div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
