import { clientFetch } from "../client";

export function listProblems(query?: Record<string, string | number | boolean | undefined | null>) {
  return clientFetch<unknown>("/api/problems", { method: "GET", query });
}

export function getProblem(problemId: string | number) {
  return clientFetch<unknown>(`/api/problems/${problemId}`, { method: "GET" });
}
