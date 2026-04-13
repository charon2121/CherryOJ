import { serverFetch } from "../server";
import type { ApiPageResult, ProblemDetailResponse, ProblemSummaryResponse } from "../oj-types";

/** 题库列表（路径待与 Java OpenAPI 对齐） */
export function listProblems(query?: Record<string, string | number | boolean | undefined | null>) {
  return serverFetch<ApiPageResult<ProblemSummaryResponse>>("/api/problems", { method: "GET", query });
}

export function getProblem(problemId: string | number) {
  return serverFetch<ProblemDetailResponse>(`/api/problems/${problemId}`, { method: "GET" });
}
