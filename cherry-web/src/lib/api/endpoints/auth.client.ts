import { clientFetch } from "../client";

export type UserProfile = {
  id: number;
  username: string;
  email: string;
  nickname: string;
  status: number;
  isAdmin: number;
};

export function loginWithPassword(body: {
  username: string;
  password: string;
}) {
  return clientFetch<UserProfile>("/api/auth/login", {
    method: "POST",
    json: body,
  });
}

export function registerAccount(body: {
  username: string;
  email: string;
  password: string;
  nickname?: string;
}) {
  return clientFetch<UserProfile>("/api/auth/register", {
    method: "POST",
    json: body,
  });
}

export function fetchCurrentUser() {
  return clientFetch<UserProfile>("/api/auth/me", { method: "GET" });
}

export function logout() {
  return clientFetch<null>("/api/auth/logout", { method: "POST" });
}

export function requestPasswordReset(body: { email: string }) {
  return clientFetch<null>("/api/auth/forgot-password", {
    method: "POST",
    json: body,
  });
}
