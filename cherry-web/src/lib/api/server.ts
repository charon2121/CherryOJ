import "server-only";

import { cookies } from "next/headers";

import { buildUrl, parseResponse, toRequestInit, type JsonInit } from "./core";

function requireBackendUrl(): string {
  const url = process.env.BACKEND_URL?.trim();
  if (!url) {
    throw new Error("缺少环境变量 BACKEND_URL（SSR 请求 Java 后端用）");
  }
  return url.replace(/\/+$/, "");
}

const JWT_COOKIE_NAME = process.env.AUTH_JWT_COOKIE_NAME ?? "cherry_jwt";

export type ServerFetchOptions = JsonInit;

/**
 * 服务端请求 Java 后端：走内网 `BACKEND_URL`，从 Cookie 读取 JWT 并设置 Authorization。
 * 若配置了 `INTERNAL_TOKEN`，会附带 `X-Internal-Token`（BFF 与后端互信时使用）。
 */
export async function serverFetch<T>(
  path: string,
  options: ServerFetchOptions = {},
): Promise<T> {
  const base = requireBackendUrl();
  const { query, ...initBase } = options;
  const url = buildUrl(base, path, query);
  const init = toRequestInit(initBase);

  const headers = new Headers(init.headers);
  const token = (await cookies()).get(JWT_COOKIE_NAME)?.value;
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  const internal = process.env.INTERNAL_TOKEN?.trim();
  if (internal && !headers.has("X-Internal-Token")) {
    headers.set("X-Internal-Token", internal);
  }

  const response = await fetch(url, { ...init, headers });
  return parseResponse<T>(response);
}
