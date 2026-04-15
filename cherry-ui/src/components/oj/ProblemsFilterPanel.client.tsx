"use client";

import { Tag } from "@/components/ui/Tag";
import type { Difficulty, Problem } from "@/data/problems";
import { Button, Input, Link } from "@heroui/react";
import { useMemo, useState } from "react";

function difficultyTone(difficulty: Difficulty) {
  if (difficulty === "入门") return "success" as const;
  if (difficulty === "进阶") return "warning" as const;
  return "danger" as const;
}

function statusTone(acceptancePct: number) {
  if (acceptancePct >= 70) return "success" as const;
  if (acceptancePct >= 35) return "warning" as const;
  return "danger" as const;
}

function excerpt(text: string) {
  const normalized = text.replace(/\s+/g, " ").trim();
  return normalized.length > 56 ? `${normalized.slice(0, 56)}...` : normalized;
}

const FILTERS: Array<Difficulty | "全部"> = ["全部", "入门", "进阶", "提高"];

export default function ProblemsFilterPanel({
  initialProblems,
}: {
  initialProblems: Problem[];
}) {
  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty | "全部">("全部");

  const rows = useMemo(() => {
    return initialProblems.filter((problem) => {
      if (difficulty !== "全部" && problem.difficulty !== difficulty) return false;
      const q = query.trim().toLowerCase();
      if (!q) return true;
      const haystack = `${problem.id} ${problem.title} ${problem.tags.join(" ")} ${problem.description}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [difficulty, initialProblems, query]);

  const activeLabel = difficulty === "全部" ? "全部难度" : difficulty;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 border-b border-[color:var(--border)] pb-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold tracking-tight text-[color:var(--foreground)]">题目索引</h2>
          <p className="text-sm text-[color:var(--muted)]">
            共 {rows.length} 题命中当前筛选。标题、题号、知识点和题面摘要都会参与搜索。
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 lg:w-auto lg:flex-row lg:items-center">
          <Input
            placeholder="搜索题号、标题、标签或题面摘要"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="w-full lg:w-[340px]"
            aria-label="搜索题目"
          />
          <Button
            variant="tertiary"
            onPress={() => {
              setQuery("");
              setDifficulty("全部");
            }}
            isDisabled={!query && difficulty === "全部"}
          >
            清空筛选
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {FILTERS.map((filter) => (
          <Button
            key={filter}
            size="sm"
            variant={difficulty === filter ? "primary" : "tertiary"}
            className={difficulty === filter ? "bg-[color:var(--foreground)] text-[color:var(--background)]" : undefined}
            onPress={() => setDifficulty(filter)}
          >
            {filter}
          </Button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <Tag>{rows.length} 条结果</Tag>
        <Tag>{activeLabel}</Tag>
        {query ? <Tag tone="accent">关键词：{query}</Tag> : null}
      </div>

      <div className="overflow-hidden rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead>
              <tr className="border-b border-[color:var(--border)] bg-[color:var(--surface-secondary)] text-xs uppercase tracking-[0.12em] text-[color:var(--muted)]">
                <th className="px-4 py-3 font-medium">状态</th>
                <th className="px-4 py-3 font-medium">题号</th>
                <th className="px-4 py-3 font-medium">题目</th>
                <th className="px-4 py-3 font-medium">难度</th>
                <th className="px-4 py-3 font-medium">通过率</th>
                <th className="px-4 py-3 font-medium">时限</th>
                <th className="px-4 py-3 font-medium">内存</th>
                <th className="px-4 py-3 font-medium">标签</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((problem) => (
                <tr
                  key={problem.id}
                  className="border-b border-[color:var(--border)] transition-colors last:border-b-0 hover:bg-[color:var(--surface-secondary)]"
                >
                  <td className="px-4 py-3">
                    <Tag tone={statusTone(problem.acceptancePct)} bordered={false}>
                      {problem.acceptancePct >= 70 ? "稳" : problem.acceptancePct >= 35 ? "中" : "难"}
                    </Tag>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-[color:var(--muted)]">{problem.id}</td>
                  <td className="px-4 py-3">
                    <div className="space-y-1">
                      <Link
                        href={`/problems/${problem.routeId ?? problem.id}`}
                        className="font-medium text-[color:var(--foreground)] no-underline hover:text-[color:var(--accent)]"
                      >
                        {problem.title}
                      </Link>
                      <p className="max-w-[38rem] text-xs leading-5 text-[color:var(--muted)]">
                        {excerpt(problem.description)}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Tag tone={difficultyTone(problem.difficulty)}>{problem.difficulty}</Tag>
                  </td>
                  <td className="px-4 py-3 tabular-nums text-[color:var(--foreground)]">
                    {problem.acceptancePct.toFixed(1)}%
                  </td>
                  <td className="px-4 py-3 text-[color:var(--muted)]">{problem.timeLimit}</td>
                  <td className="px-4 py-3 text-[color:var(--muted)]">{problem.memoryLimit}</td>
                  <td className="px-4 py-3">
                    <div className="flex max-w-[240px] flex-wrap gap-1">
                      {problem.tags.map((tag) => (
                        <Tag key={tag}>{tag}</Tag>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {rows.length === 0 ? (
          <div className="px-4 py-14 text-center">
            <div className="text-sm font-medium text-[color:var(--foreground)]">没有匹配的题目</div>
            <p className="mt-1 text-sm text-[color:var(--muted)]">试试换一个关键词，或者先切回“全部难度”。</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
