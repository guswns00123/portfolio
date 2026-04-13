"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { LogIn, LogOut } from "lucide-react";

export default function LoginButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <button
        onClick={() => signOut()}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        title="로그아웃"
      >
        <LogOut className="h-4 w-4" />
        <span className="hidden sm:inline">{session.user?.name}</span>
      </button>
    );
  }

  return (
    <button
      onClick={() => signIn("github")}
      className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      title="관리자 로그인"
    >
      <LogIn className="h-4 w-4" />
      <span className="hidden sm:inline">Login</span>
    </button>
  );
}
