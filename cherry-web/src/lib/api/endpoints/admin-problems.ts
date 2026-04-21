import { serverFetch } from "../server";
import type { AdminProblemDetail, AdminProblemPage } from "../admin-types";

export function listAdminProblems(query?: Record<string, string | number | boolean | undefined | null>) {
  return serverFetch<AdminProblemPage>("/api/admin/problems", { method: "GET", query });
}

export function getAdminProblem(problemId: string | number) {
  return serverFetch<AdminProblemDetail>(`/api/admin/problems/${problemId}`, { method: "GET" });
}
