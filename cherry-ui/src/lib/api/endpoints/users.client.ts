import { clientFetch } from "../client";

export function listUsers(query?: Record<string, string | number | boolean | undefined | null>) {
  return clientFetch<unknown>("/api/users", { method: "GET", query });
}
