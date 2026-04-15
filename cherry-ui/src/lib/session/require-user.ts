import "server-only";

import { redirect } from "next/navigation";

import { getCurrentUser } from "./get-current-user";

export async function requireUser(returnUrl: string) {
  const user = await getCurrentUser();
  if (!user) {
    redirect(`/login?returnUrl=${encodeURIComponent(returnUrl)}`);
  }
  return user;
}
