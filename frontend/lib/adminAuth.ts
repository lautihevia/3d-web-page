export function getAdminToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|; )admin_token=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export function setAdminToken(token: string): void {
  const maxAge = 60 * 60 * 24; // 24h
  document.cookie = `admin_token=${encodeURIComponent(token)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function clearAdminToken(): void {
  document.cookie = "admin_token=; path=/; max-age=0";
}

export function adminHeaders(): HeadersInit {
  const token = getAdminToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export class AdminSessionExpiredError extends Error {
  constructor(public status: number) {
    super(`Sesión expirada (HTTP ${status})`);
    this.name = "AdminSessionExpiredError";
  }
}

export function redirectToLoginExpired(): void {
  if (typeof window === "undefined") return;
  clearAdminToken();
  window.location.href = "/admin/login?expired=1";
}

export async function adminFetch(input: string, init: RequestInit = {}): Promise<Response> {
  const token = getAdminToken();
  if (!token) {
    redirectToLoginExpired();
    throw new AdminSessionExpiredError(0);
  }
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${token}`);
  const res = await fetch(input, { ...init, headers });
  if (res.status === 401 || res.status === 403) {
    redirectToLoginExpired();
    throw new AdminSessionExpiredError(res.status);
  }
  return res;
}
