import { serverFetch } from "../server";

/** 占位：后端 `UserController` 尚未暴露接口时勿调用。 */
export function listUsers(query?: Record<string, string | number | boolean | undefined | null>) {
  return serverFetch<unknown>("/api/users", { method: "GET", query });
}
