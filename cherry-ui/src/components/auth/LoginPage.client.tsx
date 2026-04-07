"use client";

import { AUTH_JWT_EXPIRATION_MS } from "@/config/auth.public";
import { ApiError } from "@/lib/api/core";
import { loginWithPassword } from "@/lib/api/endpoints/auth.client";
import { Button, Card, Input, Link } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod/v3";

const schema = z.object({
  username: z.string().trim().min(1, "请输入用户名或邮箱"),
  password: z.string().min(1, "请输入密码"),
});

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const sessionDays = Math.max(1, Math.round(AUTH_JWT_EXPIRATION_MS / 86_400_000));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const parsed = schema.safeParse({ username, password });
    if (!parsed.success) {
      setError(parsed.error.flatten().formErrors[0] ?? "请检查输入");
      return;
    }
    setLoading(true);
    try {
      await loginWithPassword(parsed.data);
      router.replace("/problems");
      router.refresh();
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
        <h1 className="text-xl font-semibold tracking-tight">登录</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          使用用户名或邮箱登录。登录状态约 {sessionDays} 天（由服务端 JWT 有效期决定）。
        </p>
      </div>
      <form className="flex flex-col gap-4" onSubmit={onSubmit}>
        {error ? (
          <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200">
            {error}
          </p>
        ) : null}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="login-username" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            用户名或邮箱
          </label>
          <Input
            id="login-username"
            name="username"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
            className="w-full"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="login-password" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            密码
          </label>
          <Input
            id="login-password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            className="w-full"
          />
        </div>
        <Button
          type="submit"
          className="bg-rose-600 text-white hover:bg-rose-500"
          isDisabled={loading}
        >
          {loading ? "登录中…" : "登录"}
        </Button>
      </form>
      <div className="mt-6 flex flex-col gap-2 text-center text-sm">
        <Link href="/register" className="text-rose-600 no-underline hover:underline dark:text-rose-400">
          没有账号？去注册
        </Link>
        <Link
          href="/forgot-password"
          className="text-zinc-600 no-underline hover:underline dark:text-zinc-400"
        >
          忘记密码
        </Link>
      </div>
    </Card>
  );
}
