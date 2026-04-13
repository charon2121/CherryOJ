import Link from "next/link";

import { listAdminProblems } from "@/lib/api/endpoints/admin-problems";

function difficultyLabel(value: number) {
  if (value === 1) return "入门";
  if (value === 2) return "进阶";
  return "提高";
}

function statusLabel(value: number) {
  if (value === 1) return "已发布";
  if (value === 0) return "下线";
  return `状态 ${value}`;
}

function judgeModeLabel(value: number) {
  if (value === 1) return "ACM";
  if (value === 2) return "核心代码";
  return `模式 ${value}`;
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
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-zinc-200/80 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-600">Problems</div>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">题目管理</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
              后台列表直接读取真实管理端 API，并为后续的题目发布、题面配置和用例维护提供入口。
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex h-11 items-center rounded-2xl bg-zinc-100 px-4 text-sm font-medium text-zinc-700">
              共 {page.total} 题
            </div>
            <Link
              href="/admin/problems/new"
              className="inline-flex h-11 items-center justify-center rounded-2xl bg-zinc-900 px-5 text-sm font-medium text-white no-underline transition hover:bg-zinc-800"
            >
              新建题目
            </Link>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-[2rem] border border-zinc-200/80 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1040px] text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
                <th className="px-5 py-4 font-medium">题号</th>
                <th className="px-5 py-4 font-medium">标题</th>
                <th className="px-5 py-4 font-medium">难度</th>
                <th className="px-5 py-4 font-medium">状态</th>
                <th className="px-5 py-4 font-medium">判题模式</th>
                <th className="px-5 py-4 font-medium">限制</th>
                <th className="px-5 py-4 font-medium">更新时间</th>
                <th className="px-5 py-4 font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {page.items.map((problem) => (
                <tr key={problem.id} className="border-b border-zinc-100 align-top hover:bg-zinc-50/70">
                  <td className="px-5 py-4 font-mono text-xs text-zinc-500">{problem.problemCode || problem.id}</td>
                  <td className="px-5 py-4">
                    <div className="font-medium text-zinc-900">{problem.title}</div>
                    <div className="mt-1 text-xs text-zinc-500">ID: {problem.id}</div>
                  </td>
                  <td className="px-5 py-4 text-zinc-700">{difficultyLabel(problem.difficulty)}</td>
                  <td className="px-5 py-4">
                    <span className="inline-flex rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700">
                      {statusLabel(problem.status)}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-zinc-700">{judgeModeLabel(problem.judgeMode)}</td>
                  <td className="px-5 py-4 text-zinc-600">
                    {problem.defaultTimeLimitMs} ms / {problem.defaultMemoryLimitMb} MB
                  </td>
                  <td className="px-5 py-4 text-zinc-500">{formatDateTime(problem.updatedAt)}</td>
                  <td className="px-5 py-4">
                    <Link
                      href={`/admin/problems/${problem.id}`}
                      className="inline-flex h-9 items-center justify-center rounded-full border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-700 no-underline transition hover:bg-zinc-100"
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
          <div className="px-6 py-16 text-center text-sm text-zinc-500">当前没有题目数据，或后台接口暂时不可用。</div>
        ) : null}
      </section>
    </div>
  );
}
