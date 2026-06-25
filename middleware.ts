import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("jwt"); // your auth check
  const isLoggedIn = !!token;

  const { pathname } = request.nextUrl;

  // ✅ If logged in and trying to access /auth → redirect to home
  if (isLoggedIn && pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // ❌ If NOT logged in and trying to access protected routes → redirect to /auth
  if (!isLoggedIn && !pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  // ✅ Otherwise allow
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};