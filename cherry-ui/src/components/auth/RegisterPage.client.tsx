"use client";

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
  .refine((d) => d.password === d.confirm, { message: "两次密码不一致", path: ["confirm"] });

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setUser = useAuthStore((s) => s.setUser);
  const user = useAuthStore((s) => s.user);
  const initialized = useAuthStore((s) => s.initialized);
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

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
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
    <Card className="border border-zinc-200/80 bg-white/90 p-6 shadow-sm backdrop-blur-sm dark:border-white/[0.08] dark:bg-zinc-900/80">
      <div className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight">注册</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">创建 CherryOJ 账号，注册成功后将自动登录。</p>
      </div>
      <form className="flex flex-col gap-4" onSubmit={onSubmit}>
        {error ? (
          <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200">
            {error}
          </p>
        ) : null}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="reg-username" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            用户名
          </label>
          <Input
            id="reg-username"
            name="username"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
            className="w-full"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="reg-email" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            邮箱
          </label>
          <Input
            id="reg-email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className="w-full"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="reg-nickname" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            昵称（可选）
          </label>
          <Input
            id="reg-nickname"
            name="nickname"
            autoComplete="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            disabled={loading}
            className="w-full"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="reg-password" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            密码
          </label>
          <Input
            id="reg-password"
            name="password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            className="w-full"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="reg-confirm" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            确认密码
          </label>
          <Input
            id="reg-confirm"
            name="confirm"
            type="password"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            disabled={loading}
            className="w-full"
          />
        </div>
        <Button
          type="submit"
          className="bg-rose-600 text-white hover:bg-rose-500"
          isDisabled={loading}
        >
          {loading ? "提交中…" : "注册并登录"}
        </Button>
      </form>
      <div className="mt-6 text-center text-sm">
        <Link href={loginHref} className="text-rose-600 no-underline hover:underline dark:text-rose-400">
          已有账号？去登录
        </Link>
      </div>
    </Card>
  );
}
