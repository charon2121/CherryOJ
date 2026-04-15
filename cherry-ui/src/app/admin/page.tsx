import { Tag } from "@/components/ui/Tag";
import { Card, Link } from "@heroui/react";
import NextLink from "next/link";

import { listAdminProblems } from "@/lib/api/endpoints/admin-problems";

function difficultyLabel(value: number) {
  if (value === 1) return "入门";
  if (value === 2) return "进阶";
  return "提高";
}

function difficultyColor(value: number): "success" | "warning" | "danger" {
  if (value === 1) return "success";
  if (value === 2) return "warning";
  return "danger";
}

function statusLabel(value: number) {
  if (value === 1) return "已发布";
  if (value === 0) return "下线";
  return `状态 ${value}`;
}

function formatDateTime(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default async function AdminProblemsPage() {
  let page;
  try {
    page = await listAdminProblems({ page: 1, pageSize: 50 });
  } catch {
    page = { items: [], total: 0, page: 1, pageSize: 50 };
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[color:var(--foreground)]">题目</h1>
          <p className="mt-1 text-sm text-[color:var(--muted)]">管理题目条目、状态和编辑入口。</p>
        </div>
        <div className="flex items-center gap-2">
          <Tag>{page.total} 条</Tag>
          <NextLink
            href="/admin/problems/new"
            className="inline-flex h-8 items-center justify-center rounded-lg bg-[color:var(--accent)] px-3 text-sm font-medium text-[color:var(--accent-foreground)] no-underline hover:opacity-90"
          >
            新建题目
          </NextLink>
        </div>
      </div>

      <Card className="border border-[color:var(--border)] bg-[color:var(--surface)] shadow-none">
        <Card.Content className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead>
                <tr className="border-b border-[color:var(--border)] bg-[color:var(--surface-secondary)] text-xs text-[color:var(--muted)]">
                  <th className="px-5 py-3 font-medium">题号</th>
                  <th className="px-5 py-3 font-medium">标题</th>
                  <th className="px-5 py-3 font-medium">难度</th>
                  <th className="px-5 py-3 font-medium">状态</th>
                  <th className="px-5 py-3 font-medium">时间限制</th>
                  <th className="px-5 py-3 font-medium">内存限制</th>
                  <th className="px-5 py-3 font-medium">更新时间</th>
                  <th className="px-5 py-3 font-medium">操作</th>
                </tr>
              </thead>
              <tbody>
                {page.items.map((problem) => (
                  <tr key={problem.id} className="border-b border-[color:var(--border)] hover:bg-[color:var(--surface-secondary)]">
                    <td className="px-5 py-3.5 font-mono text-xs text-[color:var(--muted)]">{problem.problemCode || problem.id}</td>
                    <td className="px-5 py-3.5">
                      <div className="font-medium text-[color:var(--foreground)]">{problem.title}</div>
                      <div className="mt-0.5 text-xs text-[color:var(--muted)]">ID {problem.id}</div>
                    </td>
                    <td className="px-5 py-3.5">
                      <Tag tone={difficultyColor(problem.difficulty)}>
                        {difficultyLabel(problem.difficulty)}
                      </Tag>
                    </td>
                    <td className="px-5 py-3.5">
                      <Tag>{statusLabel(problem.status)}</Tag>
                    </td>
                    <td className="px-5 py-3.5 text-[color:var(--muted)]">{problem.defaultTimeLimitMs} ms</td>
                    <td className="px-5 py-3.5 text-[color:var(--muted)]">{problem.defaultMemoryLimitMb} MB</td>
                    <td className="px-5 py-3.5 text-[color:var(--muted)]">{formatDateTime(problem.updatedAt)}</td>
                    <td className="px-5 py-3.5">
                      <Link
                        href={`/admin/problems/${problem.id}`}
                        className="inline-flex h-8 items-center justify-center rounded-lg px-3 text-sm font-medium no-underline hover:bg-[color:var(--surface-secondary)]"
                      >
                        编辑
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {page.items.length === 0 ? (
            <div className="px-6 py-14 text-center text-sm text-[color:var(--muted)]">当前没有题目数据。</div>
          ) : null}
        </Card.Content>
      </Card>
    </div>
  );
}
