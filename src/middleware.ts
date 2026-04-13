import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

const PUBLIC_PATHS = ["/portfolio", "/images", "/icons", "/profile.jpg"];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  // 정적 파일, Next.js 내부 경로는 통과
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico")
  ) {
    return NextResponse.next();
  }

  // 인증 관련 경로는 항상 허용 (로그인/콜백)
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // /portfolio 및 관련 경로는 항상 허용
  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // 로그인된 admin은 모든 경로 접근 가능
  if (session?.user) {
    return NextResponse.next();
  }

  // 비로그인 사용자: /portfolio로 리다이렉트
  return NextResponse.redirect(new URL("/portfolio", req.url));
});

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
