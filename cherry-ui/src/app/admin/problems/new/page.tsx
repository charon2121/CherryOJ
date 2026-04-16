import { Card } from "@heroui/react";

export default function AdminNewProblemPage() {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-[color:var(--muted)]">
          Problems
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[color:var(--foreground)]">
          新建题目
        </h1>
        <p className="mt-2 text-sm text-[color:var(--muted)]">
          题目表单会在题目列表完成后接入。
        </p>
      </div>
      <Card className="border border-[color:var(--border)] bg-[color:var(--surface)] shadow-none">
        <Card.Content className="p-6 text-sm text-[color:var(--muted)]">
          表单待实现。
        </Card.Content>
      </Card>
    </div>
  );
}
