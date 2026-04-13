import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/portfolio", "/images", "/icons", "/profile.jpg"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 정적 파일, Next.js 내부 경로는 통과
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico")
  ) {
    return NextResponse.next();
  }

  // /portfolio 및 관련 경로는 허용
  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // 루트는 /portfolio로 리다이렉트
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/portfolio", request.url));
  }

  // 나머지 (blog, api/chat 등)는 /portfolio로 리다이렉트
  return NextResponse.redirect(new URL("/portfolio", request.url));
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
