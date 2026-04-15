"use client";

import type { Difficulty, Problem } from "@/data/problems";
import { Badge, Button, Input, Link } from "@heroui/react";
import { useMemo, useState } from "react";

function diffPillClass(d: Difficulty) {
  if (d === "入门") return "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300";
  if (d === "进阶") return "bg-amber-500/15 text-amber-900 dark:text-amber-300";
  return "bg-rose-500/15 text-rose-900 dark:text-rose-300";
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
    return initialProblems.filter((p) => {
      if (difficulty !== "全部" && p.difficulty !== difficulty) return false;
      const q = query.trim().toLowerCase();
      if (!q) return true;
      const hay = `${p.id} ${p.title} ${p.tags.join(" ")}`.toLowerCase();
      return hay.includes(q);
    });
  }, [difficulty, initialProblems, query]);

  return (
    <>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            共 {rows.length} 题 · 搜索题号、标题或知识点
          </p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
          <Input
            placeholder="搜索题目…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full min-w-[240px] sm:w-72"
            aria-label="搜索题目"
          />
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <Button
            key={f}
            size="sm"
            variant={difficulty === f ? "primary" : "tertiary"}
            className={difficulty === f ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900" : undefined}
            onPress={() => setDifficulty(f)}
          >
            {f}
          </Button>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-200/90 bg-white shadow-sm dark:border-white/[0.08] dark:bg-[#0c0c0e] dark:shadow-none">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/90 text-xs font-medium uppercase tracking-wide text-zinc-500 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-zinc-500">
                <th className="px-4 py-3 font-medium">状态</th>
                <th className="px-4 py-3 font-medium">题号</th>
                <th className="px-4 py-3 font-medium">题目</th>
                <th className="px-4 py-3 font-medium">难度</th>
                <th className="px-4 py-3 font-medium">通过率</th>
                <th className="px-4 py-3 font-medium">标签</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-zinc-100 transition-colors hover:bg-zinc-50/90 dark:border-white/[0.05] dark:hover:bg-white/[0.04]"
                >
                  <td className="px-4 py-3">
                    <span className="inline-block h-2 w-2 rounded-full bg-zinc-200 dark:bg-zinc-700" title="未尝试" />
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-zinc-500 dark:text-zinc-400">{p.id}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/problems/${p.routeId ?? p.id}`}
                      className="font-medium text-zinc-900 no-underline hover:text-rose-600 dark:text-zinc-100 dark:hover:text-rose-400"
                    >
                      {p.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${diffPillClass(p.difficulty)}`}>
                      {p.difficulty}
                    </span>
                  </td>
                  <td className="px-4 py-3 tabular-nums text-zinc-600 dark:text-zinc-400">
                    {p.acceptancePct.toFixed(1)}%
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {p.tags.map((t) => (
                        <Badge key={t} variant="soft" className="text-[11px]">
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {rows.length === 0 ? (
          <p className="px-4 py-12 text-center text-sm text-zinc-500">没有匹配的题目，试试其它关键词或难度。</p>
        ) : null}
      </div>
    </>
  );
}
