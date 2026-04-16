import type { AdminProblemListParams } from "./problems.types";

export const adminQueryKeys = {
  problems: {
    all: ["admin", "problems"] as const,
    list: (params: AdminProblemListParams) => ["admin", "problems", "list", params] as const,
    detail: (id: string | number) => ["admin", "problems", "detail", String(id)] as const,
  },
};
