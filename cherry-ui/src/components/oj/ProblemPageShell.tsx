import { Tag } from "@/components/ui/Tag";
import type { Problem } from "@/data/problems";
import { Link } from "@heroui/react";

import ProblemEditorPane from "./ProblemEditorPane.client";

function difficultyTone(difficulty: Problem["difficulty"]) {
  if (difficulty === "入门") return "success" as const;
  if (difficulty === "进阶") return "warning" as const;
  return "danger" as const;
}

export default function ProblemPageShell({ problem }: { problem: Problem }) {
  const descriptionBlocks = problem.description.split(/\n\n+/);

  return (
    <main className="min-h-[calc(100dvh-3.5rem)] border-t border-[color:var(--border)] bg-[color:var(--background)]">
      <div className="grid min-h-[calc(100dvh-3.5rem)] xl:grid-cols-[minmax(0,1fr)_minmax(540px,46%)]">
        <section className="min-w-0 border-b border-[color:var(--border)] bg-[color:var(--surface)] xl:border-b-0 xl:border-r">
          <div className="border-b border-[color:var(--border)] px-4 py-3 sm:px-5">
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
                <h1 className="text-2xl font-semibold tracking-tight text-[color:var(--foreground)]">
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

          <div className="border-b border-[color:var(--border)] px-4 sm:px-5">
            <div className="flex h-11 items-center gap-5 text-sm">
              <div className="border-b-2 border-[color:var(--accent)] pb-3 pt-3 font-medium text-[color:var(--foreground)]">
                描述
              </div>
              <div className="pb-3 pt-3 text-[color:var(--muted)]">题解</div>
              <div className="pb-3 pt-3 text-[color:var(--muted)]">提交记录</div>
            </div>
          </div>

          <div className="overflow-y-auto px-4 py-5 sm:px-5">
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
                    <div key={index} className="space-y-3 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-secondary)] p-4">
                      <div className="text-xs font-medium uppercase tracking-[0.12em] text-[color:var(--muted)]">
                        示例 {index + 1}
                      </div>

                      <div className="space-y-3">
                        <div>
                          <div className="mb-2 text-sm font-medium text-[color:var(--foreground)]">输入</div>
                          <pre className="overflow-auto rounded-lg bg-[color:var(--surface)] px-3 py-2 font-mono text-xs leading-6 text-[color:var(--foreground)]">
                            {example.input}
                          </pre>
                        </div>
                        <div>
                          <div className="mb-2 text-sm font-medium text-[color:var(--foreground)]">输出</div>
                          <pre className="overflow-auto rounded-lg bg-[color:var(--surface)] px-3 py-2 font-mono text-xs leading-6 text-[color:var(--foreground)]">
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
                      <span className="mt-[0.55rem] h-1.5 w-1.5 rounded-full bg-[color:var(--accent)]" />
                      <span>{constraint}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>
        </section>

        <ProblemEditorPane problem={problem} />
      </div>
    </main>
  );
}
