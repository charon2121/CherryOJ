import type { ApiResponse } from "./types";

export class ApiError extends Error {
  readonly code: number;
  readonly body?: unknown;
  
  constructor(code: number, message: string, body?: unknown) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.body = body;
  }
}

export function isApiResponse(value: unknown): value is ApiResponse<unknown> {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.success === "boolean" &&
    typeof v.code === "number" &&
    typeof v.message === "string" &&
    "data" in v &&
    typeof v.timestamp === "number"
  );
}

/** 校验并解包成功响应的 `data`；`success === false` 时抛出 {@link ApiError} */
export function unwrapApiResponse<T>(json: unknown): T {
  if (!isApiResponse(json)) {
    throw new ApiError(-1, "响应不是有效的 ApiResponse 结构", json);
  }
  if (!json.success) {
    throw new ApiError(json.code, json.message || "请求失败", json);
  }
  return json.data as T;
}

/**
 * 读取 `fetch` 的 Response：解析 JSON，按 ApiResponse 约定解包。
 * HTTP 非 2xx 时优先解析 body 中的 ApiResponse 以拿到业务 code/message。
 */
export async function parseResponse<T>(response: Response): Promise<T> {
  const text = await response.text();
  let parsed: unknown;
  try {
    parsed = text.length > 0 ? JSON.parse(text) : null;
  } catch {
    throw new ApiError(-1, "响应不是合法 JSON", text);
  }

  if (!response.ok) {
    if (isApiResponse(parsed)) {
      throw new ApiError(parsed.code, parsed.message || response.statusText, parsed);
    }
    throw new ApiError(
      response.status,
      response.statusText || `HTTP ${response.status}`,
      parsed,
    );
  }

  return unwrapApiResponse<T>(parsed);
}

export type QueryParams = Record<
  string,
  string | number | boolean | undefined | null
>;

/** 拼接 base（可含 path 前缀）与 path，并附加 query */
export function buildUrl(baseUrl: string, path: string, query?: QueryParams): string {
  const base = baseUrl.replace(/\/+$/, "");
  const segment = path.replace(/^\/+/, "");
  const href = segment ? `${base}/${segment}` : base;
  const url = new URL(href);
  if (query) {
    for (const [key, val] of Object.entries(query)) {
      if (val === undefined || val === null) continue;
      url.searchParams.set(key, String(val));
    }
  }
  return url.toString();
}

export type JsonInit = RequestInit & {
  query?: QueryParams;
  /** 与 `body` 二选一优先：自动设置 Content-Type: application/json */
  json?: unknown;
};

export function toRequestInit(base: JsonInit): RequestInit {
  const { query: _q, json, headers, body, ...rest } = base;
  const h = new Headers(headers);
  let resolved: BodyInit | undefined = body ?? undefined;
  if (json !== undefined) {
    if (!h.has("Content-Type")) {
      h.set("Content-Type", "application/json");
    }
    resolved = JSON.stringify(json);
  }
  return { ...rest, headers: h, body: resolved };
}
