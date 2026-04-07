/**
 * 与后端 `app.jwt.expiration-ms` / 环境变量 `APP_JWT_EXPIRATION_MS` 对齐，用于前端展示等。
 * 浏览器无法读取 httpOnly Cookie，此处仅作说明性配置。
 */
export const AUTH_JWT_EXPIRATION_MS = Number(
  process.env.NEXT_PUBLIC_JWT_EXPIRATION_MS ?? 86_400_000,
);

export const AUTH_JWT_COOKIE_NAME =
  process.env.NEXT_PUBLIC_AUTH_JWT_COOKIE_NAME ?? "cherry_jwt";
