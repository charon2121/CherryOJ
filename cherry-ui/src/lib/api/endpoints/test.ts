import { serverFetch } from "../server";
import { ApiResponse } from "../types";

export function test() {
  return serverFetch<ApiResponse<string>>("/api/test", { method: "GET" });
}

