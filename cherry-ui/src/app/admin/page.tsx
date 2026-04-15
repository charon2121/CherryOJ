import { Badge, Button, Card, Link } from "@heroui/react";

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
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">题目</h1>
          <p className="mt-1 text-sm text-zinc-500">管理题目条目、状态和编辑入口。</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="flat">{page.total} 条</Badge>
          <Button as={Link} href="/admin/problems/new" color="primary" size="sm">
            新建题目
          </Button>
        </div>
      </div>

      <Card className="border border-zinc-200/80 bg-white shadow-none">
        <Card.Content className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-200/80 bg-zinc-50/80 text-xs text-zinc-500">
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
                  <tr key={problem.id} className="border-b border-zinc-100/90 hover:bg-zinc-50/60">
                    <td className="px-5 py-3.5 font-mono text-xs text-zinc-500">{problem.problemCode || problem.id}</td>
                    <td className="px-5 py-3.5">
                      <div className="font-medium text-zinc-900">{problem.title}</div>
                      <div className="mt-0.5 text-xs text-zinc-500">ID {problem.id}</div>
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge color={difficultyColor(problem.difficulty)} variant="flat">
                        {difficultyLabel(problem.difficulty)}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge variant="flat">{statusLabel(problem.status)}</Badge>
                    </td>
                    <td className="px-5 py-3.5 text-zinc-600">{problem.defaultTimeLimitMs} ms</td>
                    <td className="px-5 py-3.5 text-zinc-600">{problem.defaultMemoryLimitMb} MB</td>
                    <td className="px-5 py-3.5 text-zinc-500">{formatDateTime(problem.updatedAt)}</td>
                    <td className="px-5 py-3.5">
                      <Button as={Link} href={`/admin/problems/${problem.id}`} size="sm" variant="light">
                        编辑
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {page.items.length === 0 ? (
            <div className="px-6 py-14 text-center text-sm text-zinc-500">当前没有题目数据。</div>
          ) : null}
        </Card.Content>
      </Card>
    </div>
  );
}
