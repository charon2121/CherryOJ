import type { ApiResponse } from "@/lib/api-types";

/** 与 Spring Boot 默认端口一致；可在 `.env.local` 中设置 `NEXT_PUBLIC_API_BASE_URL` */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "http://localhost:8080";

export class ApiError extends Error {
  readonly code: number;

  constructor(code: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.code = code;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isApiResponseShape(value: unknown): value is ApiResponse<unknown> {
  if (!isRecord(value)) return false;
  return (
    typeof value.success === "boolean" &&
    typeof value.code === "number" &&
    typeof value.message === "string" &&
    "data" in value &&
    typeof value.timestamp === "number"
  );
}

/**
 * 解析已为 JSON 的 Response，业务失败时抛出 {@link ApiError}。
 */
export async function parseApiResponse<T>(res: Response): Promise<T> {
  const json: unknown = await res.json();
  if (!isApiResponseShape(json)) {
    throw new ApiError(res.status || 500, "响应格式不是 ApiResponse");
  }
  if (!json.success) {
    throw new ApiError(json.code, json.message);
  }
  return json.data as T;
}

export type ApiFetchOptions = RequestInit & {
  /** 为 false 时不自动加 Content-Type（例如 FormData） */
  jsonBody?: boolean;
};

/**
 * 请求 `${API_BASE}${path}`，解析统一响应体并返回 `data`。
 */
export async function apiFetch<T>(path: string, init?: ApiFetchOptions): Promise<T> {
  const { jsonBody = true, headers: initHeaders, ...rest } = init ?? {};
  const headers = new Headers(initHeaders);
  if (jsonBody && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`${API_BASE_URL}${path}`, { ...rest, headers });
  const contentType = res.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    if (!res.ok) {
      throw new ApiError(res.status, res.statusText || "请求失败");
    }
    throw new ApiError(res.status, "响应不是 JSON");
  }

  const json: unknown = await res.json();
  if (!isApiResponseShape(json)) {
    throw new ApiError(res.status || 500, "响应格式不是 ApiResponse");
  }
  if (!json.success) {
    throw new ApiError(json.code, json.message);
  }
  if (!res.ok) {
    throw new ApiError(res.status, json.message || res.statusText);
  }
  return json.data as T;
}
