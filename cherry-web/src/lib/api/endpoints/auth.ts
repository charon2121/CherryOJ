/**
 * 登录 / 注册 / `me` 在浏览器侧统一走 {@link import("./auth.client")} 的 `clientFetch`，
 * 由后端下发 httpOnly JWT Cookie。SSR 私有接口仍用 `serverFetch`（从 Cookie 带 Authorization）。
 */
export type { UserProfile } from "./auth.client";
