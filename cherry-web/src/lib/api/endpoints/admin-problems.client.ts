import { clientFetch } from "../client";
import type {
  AdminProblemDetail,
  AdminProblemPage,
  AdminProblemUpsertRequest,
} from "../admin-types";

export function listAdminProblemsClient(query?: Record<string, string | number | boolean | undefined | null>) {
  return clientFetch<AdminProblemPage>("/api/admin/problems", { method: "GET", query });
}

export function getAdminProblemClient(problemId: string | number) {
  return clientFetch<AdminProblemDetail>(`/api/admin/problems/${problemId}`, { method: "GET" });
}

export function createAdminProblem(body: AdminProblemUpsertRequest) {
  return clientFetch<AdminProblemDetail>("/api/admin/problems", { method: "POST", json: body });
}

export function updateAdminProblem(problemId: string | number, body: AdminProblemUpsertRequest) {
  return clientFetch<AdminProblemDetail>(`/api/admin/problems/${problemId}`, {
    method: "PUT",
    json: body,
  });
}

export function deleteAdminProblem(problemId: string | number) {
  return clientFetch<null>(`/api/admin/problems/${problemId}`, { method: "DELETE" });
}
