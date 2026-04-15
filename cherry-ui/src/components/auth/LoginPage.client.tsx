"use client";

import { Tag } from "@/components/ui/Tag";
import { authInputClassName } from "@/components/auth/auth-field-styles";
import { ApiError } from "@/lib/api/core";
import { loginWithPassword } from "@/lib/api/endpoints/auth.client";
import { sanitizeReturnUrl } from "@/lib/auth/return-url";
import { useAuthStore } from "@/lib/auth/auth.store";
import { Button, Card, Input, Link } from "@heroui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { z } from "zod/v3";

const schema = z.object({
  username: z.string().trim().min(1, "请输入用户名或邮箱"),
  password: z.string().min(1, "请输入密码"),
});

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setUser = useAuthStore((state) => state.setUser);
  const user = useAuthStore((state) => state.user);
  const initialized = useAuthStore((state) => state.initialized);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const returnUrlParam = searchParams.get("returnUrl");
  const safeReturn = sanitizeReturnUrl(returnUrlParam);
  const registerHref =
    returnUrlParam != null && returnUrlParam !== ""
      ? `/register?returnUrl=${encodeURIComponent(returnUrlParam)}`
      : "/register";

  useEffect(() => {
    if (!initialized || !user) {
      return;
    }
    router.replace(safeReturn ?? "/problems");
    router.refresh();
  }, [initialized, user, router, safeReturn]);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    const parsed = schema.safeParse({ username, password });
    if (!parsed.success) {
      setError(parsed.error.flatten().formErrors[0] ?? "请检查输入");
      return;
    }

    setLoading(true);
    try {
      const profile = await loginWithPassword(parsed.data);
      setUser(profile);
      router.replace(safeReturn ?? "/problems");
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
    <Card className="border border-[color:var(--border)] bg-[color:var(--surface)] shadow-none">
      <Card.Header className="space-y-4 border-b border-[color:var(--border)] px-6 py-6">
        <div className="space-y-3">
          <Tag size="md">登录</Tag>
          <div className="space-y-2">
            <Card.Title className="text-2xl font-semibold tracking-tight text-[color:var(--foreground)]">
              登录 CherryOJ
            </Card.Title>
            <Card.Description className="text-sm leading-6 text-[color:var(--muted)]">
              登录后将直接返回题库或你刚才访问的目标页面。认证页不做多余装饰，只确保信息清晰、状态稳定。
            </Card.Description>
          </div>
        </div>
      </Card.Header>

      <Card.Content className="space-y-5 px-6 py-6">
        <form className="space-y-4" onSubmit={onSubmit}>
          {error ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-200">
              {error}
            </div>
          ) : null}

          <label className="block space-y-2">
            <span className="text-sm font-medium text-[color:var(--foreground)]">用户名或邮箱</span>
            <Input
              id="login-username"
              name="username"
              autoComplete="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              disabled={loading}
              className={authInputClassName}
            />
          </label>

          <label className="block space-y-2">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-medium text-[color:var(--foreground)]">密码</span>
              <Link href="/forgot-password" className="text-xs no-underline hover:text-[color:var(--accent)]">
                忘记密码
              </Link>
            </div>
            <Input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={loading}
              className={authInputClassName}
            />
          </label>

          <Button
            type="submit"
            isDisabled={loading}
            className="h-11 w-full bg-[color:var(--accent)] text-[color:var(--accent-foreground)] hover:opacity-90"
          >
            {loading ? "登录中…" : "登录"}
          </Button>
        </form>

        <div className="space-y-3 border-t border-[color:var(--border)] pt-4">
          <div className="flex flex-wrap items-center gap-2 text-sm text-[color:var(--muted)]">
            <span>还没有账号？</span>
            <Link href={registerHref} className="font-medium no-underline hover:text-[color:var(--accent)]">
              去注册
            </Link>
          </div>

          <div className="flex flex-wrap gap-2">
            <Tag bordered={false}>登录成功后自动跳转</Tag>
            <Tag bordered={false}>支持 returnUrl</Tag>
          </div>
        </div>
      </Card.Content>
    </Card>
  );
}
