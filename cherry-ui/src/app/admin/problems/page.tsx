import { Button, Card } from "@heroui/react";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function AdminProblemsPage() {
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-[color:var(--muted)]">
            Content
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[color:var(--foreground)]">
            题目管理
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[color:var(--muted)]">
            管理题目基础信息、判题限制和测试用例。列表数据层会在下一阶段接入 TanStack Query。
          </p>
        </div>
        <Link href="/admin/problems/new" className="no-underline">
          <Button variant="primary" className="gap-2">
            <Plus className="h-4 w-4" strokeWidth={1.85} />
            新建题目
          </Button>
        </Link>
      </div>

      <Card className="border border-[color:var(--border)] bg-[color:var(--surface)] shadow-none">
        <Card.Content className="p-6">
          <div className="rounded-xl border border-dashed border-[color:var(--border)] bg-[color:var(--surface-secondary)] p-8 text-center">
            <p className="text-sm font-medium text-[color:var(--foreground)]">题目列表待接入</p>
            <p className="mt-2 text-sm text-[color:var(--muted)]">
              下一步会实现 `useAdminProblemsQuery`、筛选区和表格。
            </p>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
}
