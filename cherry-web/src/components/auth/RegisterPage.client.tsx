"use client";

import { Tag } from "@/components/ui/Tag";
import { authInputClassName } from "@/components/auth/auth-field-styles";
import { ApiError } from "@/lib/api/core";
import { registerAccount } from "@/lib/api/endpoints/auth.client";
import { sanitizeReturnUrl } from "@/lib/auth/return-url";
import { useAuthStore } from "@/lib/auth/auth.store";
import { Button, Card, Input, Link } from "@heroui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { z } from "zod/v3";

const schema = z
  .object({
    username: z.string().trim().min(2, "用户名至少 2 个字符").max(32, "用户名过长"),
    email: z.string().trim().email("请输入有效邮箱"),
    nickname: z.string().trim().max(32, "昵称过长").optional(),
    password: z.string().min(8, "密码至少 8 位"),
    confirm: z.string().min(1, "请再次输入密码"),
  })
  .refine((data) => data.password === data.confirm, {
    message: "两次密码不一致",
    path: ["confirm"],
  });

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setUser = useAuthStore((state) => state.setUser);
  const user = useAuthStore((state) => state.user);
  const initialized = useAuthStore((state) => state.initialized);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const returnUrlParam = searchParams.get("returnUrl");
  const safeReturn = sanitizeReturnUrl(returnUrlParam);
  const loginHref =
    returnUrlParam != null && returnUrlParam !== ""
      ? `/login?returnUrl=${encodeURIComponent(returnUrlParam)}`
      : "/login";

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
    const parsed = schema.safeParse({
      username,
      email,
      nickname: nickname.trim() === "" ? undefined : nickname,
      password,
      confirm,
    });

    if (!parsed.success) {
      const first =
        Object.values(parsed.error.flatten().fieldErrors)[0]?.[0] ??
        parsed.error.flatten().formErrors[0] ??
        "请检查输入";
      setError(first);
      return;
    }

    setLoading(true);
    try {
      const profile = await registerAccount({
        username: parsed.data.username,
        email: parsed.data.email,
        password: parsed.data.password,
        nickname: parsed.data.nickname,
      });
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
          <Tag size="md">注册</Tag>
          <div className="space-y-2">
            <Card.Title className="text-2xl font-semibold tracking-tight text-[color:var(--foreground)]">
              创建账号
            </Card.Title>
            <Card.Description className="text-sm leading-6 text-[color:var(--muted)]">
              注册成功后会自动登录，并返回题库或你原本访问的页面。
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
            <span className="text-sm font-medium text-[color:var(--foreground)]">用户名</span>
            <Input
              id="reg-username"
              name="username"
              autoComplete="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              disabled={loading}
              className={authInputClassName}
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-[color:var(--foreground)]">邮箱</span>
            <Input
              id="reg-email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={loading}
              className={authInputClassName}
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-[color:var(--foreground)]">昵称</span>
            <Input
              id="reg-nickname"
              name="nickname"
              autoComplete="nickname"
              value={nickname}
              onChange={(event) => setNickname(event.target.value)}
              disabled={loading}
              className={authInputClassName}
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-[color:var(--foreground)]">密码</span>
            <Input
              id="reg-password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={loading}
              className={authInputClassName}
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-[color:var(--foreground)]">确认密码</span>
            <Input
              id="reg-confirm"
              name="confirm"
              type="password"
              autoComplete="new-password"
              value={confirm}
              onChange={(event) => setConfirm(event.target.value)}
              disabled={loading}
              className={authInputClassName}
            />
          </label>

          <Button
            type="submit"
            isDisabled={loading}
            className="h-11 w-full bg-[color:var(--accent)] text-[color:var(--accent-foreground)] hover:opacity-90"
          >
            {loading ? "提交中…" : "注册并登录"}
          </Button>
        </form>

        <div className="space-y-3 border-t border-[color:var(--border)] pt-4">
          <div className="flex flex-wrap items-center gap-2 text-sm text-[color:var(--muted)]">
            <span>已有账号？</span>
            <Link href={loginHref} className="font-medium no-underline hover:text-[color:var(--accent)]">
              去登录
            </Link>
          </div>

          <div className="flex flex-wrap gap-2">
            <Tag bordered={false}>自动登录</Tag>
            <Tag bordered={false}>支持 returnUrl</Tag>
          </div>
        </div>
      </Card.Content>
    </Card>
  );
}
