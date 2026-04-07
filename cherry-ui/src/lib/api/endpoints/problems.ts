import { serverFetch } from "../server";

/** 题库列表（路径待与 Java OpenAPI 对齐） */
export function listProblems(query?: Record<string, string | number | boolean | undefined | null>) {
  return serverFetch<unknown>("/api/problems", { method: "GET", query });
}

export function getProblem(problemId: string | number) {
  return serverFetch<unknown>(`/api/problems/${problemId}`, { method: "GET" });
}
