/**
 * 与后端对齐的通用响应壳。
 */
export interface ApiResponse<T> {
  success: boolean;
  code: number;
  message: string;
  data: T | null;
  timestamp: number;
}

/** 与后端错误码响应对齐 */
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

export type ResultCodeValue = (typeof ResultCode)[keyof typeof ResultCode];
