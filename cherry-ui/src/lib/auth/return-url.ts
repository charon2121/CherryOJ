/**
 * 防止开放重定向：仅允许站内相对路径。
 */
export function sanitizeReturnUrl(raw: string | null | undefined): string | undefined {
  if (raw == null || raw === "") {
    return undefined;
  }
  let decoded: string;
  try {
    decoded = decodeURIComponent(raw.trim());
  } catch {
    return undefined;
  }
  if (!decoded.startsWith("/")) {
    return undefined;
  }
  if (decoded.startsWith("//")) {
    return undefined;
  }
  if (decoded.includes("://")) {
    return undefined;
  }
  return decoded;
}
