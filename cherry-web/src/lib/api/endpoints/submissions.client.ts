import { clientFetch } from "../client";
import type {
  CreateSubmissionRequest,
  CreateSubmissionResponse,
  SubmissionDetailResponse,
} from "../oj-types";

export function getSubmission(submissionId: string | number) {
  return clientFetch<SubmissionDetailResponse>(`/api/submissions/${submissionId}`, { method: "GET" });
}

export function submitCode(body: CreateSubmissionRequest) {
  return clientFetch<CreateSubmissionResponse>("/api/submissions", { method: "POST", json: body });
}
