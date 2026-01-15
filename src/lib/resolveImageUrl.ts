export function resolveImageUrl(url: string) {
  if (!url) return url;

  if (url.startsWith("http")) return url;

  const serverUrl =
    String(import.meta.env.VITE_SERVER_URL || "").replace(/\/$/, "") ||
    String(import.meta.env.VITE_API_URL || "")
      .replace(/\/$/, "")
      .replace(/\/api$/, "");

  return `${serverUrl}${url.startsWith("/") ? "" : "/"}${url}`;
}
