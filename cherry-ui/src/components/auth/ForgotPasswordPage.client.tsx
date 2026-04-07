"use client";

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

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
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
    <Card className="border border-zinc-200/80 bg-white/90 p-6 shadow-sm backdrop-blur-sm dark:border-white/[0.08] dark:bg-zinc-900/80">
      <div className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight">找回密码</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          提交注册邮箱。邮件发送能力将在后端接入后启用；当前请求仅作占位。
        </p>
      </div>
      {done ? (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-100">
          若该邮箱已注册，将收到重置说明（功能接入邮件服务后生效）。
        </p>
      ) : (
        <form className="flex flex-col gap-4" onSubmit={onSubmit}>
          {error ? (
            <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200">
              {error}
            </p>
          ) : null}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="forgot-email" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              邮箱
            </label>
            <Input
              id="forgot-email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="w-full"
            />
          </div>
          <Button
            type="submit"
            className="bg-rose-600 text-white hover:bg-rose-500"
            isDisabled={loading}
          >
            {loading ? "提交中…" : "提交"}
          </Button>
        </form>
      )}
      <div className="mt-6 text-center text-sm">
        <Link href="/login" className="text-rose-600 no-underline hover:underline dark:text-rose-400">
          返回登录
        </Link>
      </div>
    </Card>
  );
}
