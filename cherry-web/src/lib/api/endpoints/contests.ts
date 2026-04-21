import { serverFetch } from "../server";

export function listContests(query?: Record<string, string | number | boolean | undefined | null>) {
  return serverFetch<unknown>("/api/contests", { method: "GET", query });
}

export function getContest(contestId: string | number) {
  return serverFetch<unknown>(`/api/contests/${contestId}`, { method: "GET" });
}
