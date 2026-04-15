import type { AdminProblemDetail } from "@/lib/api/admin-types";
import { Tag } from "@/components/ui/Tag";

import AdminProblemForm from "./AdminProblemForm.client";

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
  if (!value) return null;
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

export default function AdminProblemEditorShell({
  mode,
  problem,
}: {
  mode: "create" | "edit";
  problem?: AdminProblemDetail | null;
}) {
  const updatedAt = formatDateTime(problem?.updatedAt);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 border-b border-zinc-200/80 pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
            {mode === "create" ? "新建题目" : `${problem?.problemCode} · ${problem?.title}`}
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            {mode === "create"
              ? "先建立题目骨架，再补充题面、约束和测试用例。"
              : "编辑题目配置、题面与测试用例。保存后将立即刷新服务端快照。"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {mode === "edit" && problem ? (
            <>
              <Tag>{statusLabel(problem.status)}</Tag>
              <Tag>{judgeModeLabel(problem.judgeMode)}</Tag>
              {updatedAt ? <Tag>更新于 {updatedAt}</Tag> : null}
            </>
          ) : (
            <>
              <Tag>未持久化</Tag>
              <Tag>创建模式</Tag>
            </>
          )}
        </div>
      </div>

      <AdminProblemForm mode={mode} problem={problem} />
    </div>
  );
}
