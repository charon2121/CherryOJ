import { serverFetch } from "../server";
import type {
  CreateSubmissionRequest,
  CreateSubmissionResponse,
  SubmissionDetailResponse,
} from "../oj-types";

/** `GET /api/submissions/{id}` */
export function getSubmission(submissionId: string | number) {
  return serverFetch<SubmissionDetailResponse>(`/api/submissions/${submissionId}`, { method: "GET" });
}

/** `POST /api/submissions` */
export function submitCode(body: CreateSubmissionRequest) {
  return serverFetch<CreateSubmissionResponse>("/api/submissions", { method: "POST", json: body });
}
