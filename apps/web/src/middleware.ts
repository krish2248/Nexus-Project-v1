import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

const protectedRoutes = ["/dashboard", "/settings", "/workspace"];
const authRoutes = ["/login", "/register", "/auth/error"];

export default auth((req) => {
  const url = req.nextUrl.clone();
  const pathname = url.pathname;
  const isAuthenticated = !!req.auth;

  if (protectedRoutes.some((route) => pathname.startsWith(route)) && !isAuthenticated) {
    url.pathname = "/login";
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  if (authRoutes.includes(pathname) && isAuthenticated) {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
