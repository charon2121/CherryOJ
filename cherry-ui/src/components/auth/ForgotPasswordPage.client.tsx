"use client";

import { Tag } from "@/components/ui/Tag";
import { authInputClassName } from "@/components/auth/auth-field-styles";
import { ApiError } from "@/lib/api/core";
import { requestPasswordReset } from "@/lib/api/endpoints/auth.client";
import { Button, Card, Input, Link } from "@heroui/react";
import { useState } from "react";
import { z } from "zod/v3";

const schema = z.object({
  email: z.string().trim().email("请输入有效邮箱"),
});

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    const parsed = schema.safeParse({ email });
    if (!parsed.success) {
      setError(parsed.error.flatten().formErrors[0] ?? "请检查邮箱");
      return;
    }

    setLoading(true);
    try {
      await requestPasswordReset(parsed.data);
      setDone(true);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("网络异常，请稍后重试");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="border border-[color:var(--border)] bg-[color:var(--surface)] shadow-none">
      <Card.Header className="space-y-4 border-b border-[color:var(--border)] px-6 py-6">
        <div className="space-y-3">
          <Tag size="md">找回密码</Tag>
          <div className="space-y-2">
            <Card.Title className="text-2xl font-semibold tracking-tight text-[color:var(--foreground)]">
              重置密码
            </Card.Title>
            <Card.Description className="text-sm leading-6 text-[color:var(--muted)]">
              提交注册邮箱。邮件能力接入后，这里会发送重置说明。
            </Card.Description>
          </div>
        </div>
      </Card.Header>

      <Card.Content className="space-y-5 px-6 py-6">
        {done ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-200">
              若该邮箱已注册，将收到重置说明。
            </div>
            <div className="flex flex-wrap gap-2">
              <Tag bordered={false}>邮件服务待接入</Tag>
            </div>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={onSubmit}>
            {error ? (
              <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-200">
                {error}
              </div>
            ) : null}

            <label className="block space-y-2">
              <span className="text-sm font-medium text-[color:var(--foreground)]">邮箱</span>
              <Input
                id="forgot-email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                disabled={loading}
                className={authInputClassName}
              />
            </label>

            <Button
              type="submit"
              isDisabled={loading}
              className="h-11 w-full bg-[color:var(--accent)] text-[color:var(--accent-foreground)] hover:opacity-90"
            >
              {loading ? "提交中…" : "提交"}
            </Button>
          </form>
        )}

        <div className="border-t border-[color:var(--border)] pt-4">
          <Link href="/login" className="text-sm font-medium no-underline hover:text-[color:var(--accent)]">
            返回登录
          </Link>
        </div>
      </Card.Content>
    </Card>
  );
}
