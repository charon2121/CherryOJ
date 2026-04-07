import { serverFetch } from "../server";

/** `GET /api/submissions/{id}` */
export function getSubmission(submissionId: string | number) {
  return serverFetch<null>(`/api/submissions/${submissionId}`, { method: "GET" });
}

/** `POST /api/submissions` */
export function submitCode(body: unknown) {
  return serverFetch<null>("/api/submissions", { method: "POST", json: body });
}
