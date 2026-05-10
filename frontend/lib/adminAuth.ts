export function getAdminToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|; )admin_token=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export function setAdminToken(token: string): void {
  const maxAge = 60 * 60 * 24; // 24h
  document.cookie = `admin_token=${encodeURIComponent(token)}; path=/; max-age=${maxAge}; SameSite=Strict`;
}

export function clearAdminToken(): void {
  document.cookie = "admin_token=; path=/; max-age=0";
}

export function adminHeaders(): HeadersInit {
  const token = getAdminToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}
