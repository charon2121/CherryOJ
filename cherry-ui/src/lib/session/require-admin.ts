import "server-only";

import { redirect } from "next/navigation";

import { getCurrentUser } from "./get-current-user";

export async function requireAdmin(returnUrl = "/admin") {
  const user = await getCurrentUser();
  if (!user) {
    redirect(`/login?returnUrl=${encodeURIComponent(returnUrl)}`);
  }
  if (user.isAdmin !== 1) {
    redirect("/problems");
  }
  return user;
}
