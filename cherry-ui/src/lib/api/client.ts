import {buildUrl, parseResponse, toRequestInit, type JsonInit} from "./core";
import { ApiError } from "./core";

function publicBackendUrl(): string {
  const url = process.env.NEXT_PUBLIC_BACKEND_URL?.trim();
  if (!url) {
    throw new Error("缺少环境变量 NEXT_PUBLIC_BACKEND_URL（浏览器请求后端用）");
  }
  return url.replace(/\/+$/, "");
}

export type ClientFetchOptions = JsonInit;

/**
 * 浏览器端请求 Java：走公网基址，同域 Cookie 由 `credentials: 'include'` 自动携带。
 */
export async function clientFetch<T>(path: string, options: ClientFetchOptions = {}): Promise<T> {
  const base = publicBackendUrl();
  const {query, ...initBase} = options;
  const url = buildUrl(base, path, query);
  const init = toRequestInit(initBase);

  try {
    const response = await fetch(url, {
      ...init,
      credentials: "include",
    });
    return await parseResponse<T>(response);
  } catch (err) {
    if (typeof window !== "undefined" && err instanceof ApiError && err.code === 401) {
      window.dispatchEvent(new Event("auth:unauthorized"));
    }
    throw err;
  }
}
