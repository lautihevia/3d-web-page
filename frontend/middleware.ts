import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("admin_token")?.value;
  const isLogin = request.nextUrl.pathname === "/admin/login";

  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (!token && !isLogin) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    if (token && isLogin) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
