import { Tag } from "@/components/ui/Tag";
import type { Problem } from "@/data/problems";
import { Card, Link } from "@heroui/react";

import ProblemsFilterPanel from "./ProblemsFilterPanel.client";

function countByDifficulty(problems: Problem[], difficulty: Problem["difficulty"]) {
  return problems.filter((problem) => problem.difficulty === difficulty).length;
}

function topTags(problems: Problem[]) {
  const counter = new Map<string, number>();
  for (const problem of problems) {
    for (const tag of problem.tags) {
      counter.set(tag, (counter.get(tag) ?? 0) + 1);
    }
  }
  return [...counter.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);
}

export default function ProblemsPageShell({
  initialProblems,
}: {
  initialProblems: Problem[];
}) {
  const total = initialProblems.length;
  const entry = countByDifficulty(initialProblems, "入门");
  const intermediate = countByDifficulty(initialProblems, "进阶");
  const advanced = countByDifficulty(initialProblems, "提高");
  const tags = topTags(initialProblems);

  return (
    <main className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 sm:py-10">
      <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-[color:var(--muted)]">
        <Link href="/" className="no-underline hover:text-[color:var(--accent)]">
          CherryOJ
        </Link>
        <span aria-hidden>/</span>
        <span className="text-[color:var(--foreground)]">题库</span>
      </nav>

      <section className="grid gap-6 border-b border-[color:var(--border)] pb-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-5">
          <div className="space-y-3">
            <Tag size="md">Problem Set</Tag>
            <div className="space-y-3">
              <h1 className="text-3xl font-semibold tracking-tight text-[color:var(--foreground)] sm:text-4xl">
                题库应该像工作台的索引页，
                <span className="text-[color:var(--accent)]"> 而不是卡片陈列页。</span>
              </h1>
              <p className="max-w-3xl text-base leading-7 text-[color:var(--muted)]">
                这里集中展示题号、难度、通过率、标签与时空限制。信息层级保持紧凑，筛选与跳转动作保持直接，
                用户可以快速定位下一道题，而不是在视觉装饰里找入口。
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <Card className="border border-[color:var(--border)] bg-[color:var(--surface)] shadow-none">
              <Card.Content className="space-y-1 p-4">
                <div className="text-2xl font-semibold tracking-tight text-[color:var(--foreground)]">{total}</div>
                <div className="text-sm font-medium text-[color:var(--foreground)]">可浏览题目</div>
                <div className="text-sm text-[color:var(--muted)]">从基础训练到专题提高</div>
              </Card.Content>
            </Card>
            <Card className="border border-[color:var(--border)] bg-[color:var(--surface)] shadow-none">
              <Card.Content className="space-y-1 p-4">
                <div className="text-2xl font-semibold tracking-tight text-[color:var(--foreground)]">{entry}</div>
                <div className="text-sm font-medium text-[color:var(--foreground)]">入门题</div>
                <div className="text-sm text-[color:var(--muted)]">适合语法、模拟与常规模板练习</div>
              </Card.Content>
            </Card>
            <Card className="border border-[color:var(--border)] bg-[color:var(--surface)] shadow-none">
              <Card.Content className="space-y-1 p-4">
                <div className="text-2xl font-semibold tracking-tight text-[color:var(--foreground)]">
                  {intermediate + advanced}
                </div>
                <div className="text-sm font-medium text-[color:var(--foreground)]">进阶与提高</div>
                <div className="text-sm text-[color:var(--muted)]">适合进入图论、数据结构与动态规划</div>
              </Card.Content>
            </Card>
          </div>
        </div>

        <div className="space-y-4">
          <Card className="border border-[color:var(--border)] bg-[color:var(--surface)] shadow-none">
            <Card.Header className="border-b border-[color:var(--border)] px-4 py-3">
              <Card.Title className="text-base text-[color:var(--foreground)]">当前分布</Card.Title>
            </Card.Header>
            <Card.Content className="space-y-3 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[color:var(--muted)]">入门</span>
                <Tag tone="success">{entry}</Tag>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[color:var(--muted)]">进阶</span>
                <Tag tone="warning">{intermediate}</Tag>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[color:var(--muted)]">提高</span>
                <Tag tone="danger">{advanced}</Tag>
              </div>
            </Card.Content>
          </Card>

          <Card className="border border-[color:var(--border)] bg-[color:var(--surface)] shadow-none">
            <Card.Header className="border-b border-[color:var(--border)] px-4 py-3">
              <Card.Title className="text-base text-[color:var(--foreground)]">高频标签</Card.Title>
            </Card.Header>
            <Card.Content className="space-y-3 p-4">
              <div className="flex flex-wrap gap-2">
                {tags.map(([tag, count]) => (
                  <Tag key={tag}>
                    {tag} · {count}
                  </Tag>
                ))}
              </div>
              <p className="text-sm leading-6 text-[color:var(--muted)]">
                先用题号和标题筛选，再用难度和标签缩小范围，这一页的目标是尽快进入下一道题。
              </p>
            </Card.Content>
          </Card>
        </div>
      </section>

      <section className="py-8">
        <ProblemsFilterPanel initialProblems={initialProblems} />
      </section>
    </main>
  );
}
