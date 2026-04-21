"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { createAdminQueryClient } from "@/lib/admin/query-client";

export default function AdminQueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => createAdminQueryClient());

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
