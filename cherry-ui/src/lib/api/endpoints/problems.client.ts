import { clientFetch } from "../client";
import type { ApiPageResult, ProblemDetailResponse, ProblemSummaryResponse } from "../oj-types";

export function listProblems(query?: Record<string, string | number | boolean | undefined | null>) {
  return clientFetch<ApiPageResult<ProblemSummaryResponse>>("/api/problems", { method: "GET", query });
}

export function getProblem(problemId: string | number) {
  return clientFetch<ProblemDetailResponse>(`/api/problems/${problemId}`, { method: "GET" });
}
