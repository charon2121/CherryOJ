import { clientFetch } from "../client";

export function listContests(query?: Record<string, string | number | boolean | undefined | null>) {
  return clientFetch<unknown>("/api/contests", { method: "GET", query });
}

export function getContest(contestId: string | number) {
  return clientFetch<unknown>(`/api/contests/${contestId}`, { method: "GET" });
}
