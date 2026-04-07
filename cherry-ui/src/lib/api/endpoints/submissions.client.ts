import { clientFetch } from "../client";

export function getSubmission(submissionId: string | number) {
  return clientFetch<null>(`/api/submissions/${submissionId}`, { method: "GET" });
}

export function submitCode(body: unknown) {
  return clientFetch<null>("/api/submissions", { method: "POST", json: body });
}
