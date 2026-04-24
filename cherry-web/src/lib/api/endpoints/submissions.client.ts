import { clientFetch } from "../client";
import type {
  CreateSubmissionRequest,
  CreateSubmissionResponse,
  SubmissionDetailResponse,
  SubmissionEventResponse,
} from "../oj-types";

export function getSubmission(submissionId: string | number) {
  return clientFetch<SubmissionDetailResponse>(`/api/submissions/${submissionId}`, { method: "GET" });
}

export function submitCode(body: CreateSubmissionRequest) {
  return clientFetch<CreateSubmissionResponse>("/api/submissions", { method: "POST", json: body });
}

function publicBackendUrl(): string {
  const url = process.env.NEXT_PUBLIC_BACKEND_URL?.trim();
  if (!url) {
    throw new Error("缺少环境变量 NEXT_PUBLIC_BACKEND_URL（浏览器请求后端用）");
  }
  return url.replace(/\/+$/, "");
}

export function subscribeSubmissionEvents(
  submissionId: string | number,
  handlers: {
    onEvent: (event: SubmissionEventResponse) => void;
    onError?: () => void;
  },
) {
  const source = new EventSource(`${publicBackendUrl()}/api/submissions/${submissionId}/events`, {
    withCredentials: true,
  });

  const handleMessage = (message: MessageEvent<string>) => {
    handlers.onEvent(JSON.parse(message.data) as SubmissionEventResponse);
  };

  source.addEventListener("submission.snapshot", handleMessage);
  source.addEventListener("submission.updated", handleMessage);
  source.addEventListener("submission.error", handleMessage);
  source.onerror = () => handlers.onError?.();

  return () => source.close();
}
