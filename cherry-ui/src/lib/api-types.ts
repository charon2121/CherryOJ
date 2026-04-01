/** 与后端 `com.cherry.common.api.ApiResponse` 对齐的统一响应体 */
export type ApiResponse<T> = {
  success: boolean;
  code: number;
  message: string;
  data: T | null;
  timestamp: number;
};

/** 与后端 `com.cherry.common.api.PageResult` 对齐的分页数据 */
export type PageResult<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};

/** 与后端 `ResultCode` 枚举数值对齐，便于分支判断 */
export const ResultCode = {
  OK: 0,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_ERROR: 500,
  BUSINESS_ERROR: 10000,
} as const;
