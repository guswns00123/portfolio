"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import LoginButton from "@/components/auth/LoginButton";

const TISTORY_URL = "https://guswns00123.tistory.com/";

const publicNavItems = [
  { href: "/portfolio", label: "Portfolio", external: false as const },
  { href: "/resume", label: "Resume", external: false as const },
  { href: TISTORY_URL, label: "Blog", external: true as const },
];

const adminNavItems = [
  { href: "/", label: "Home", external: false as const },
  { href: "/portfolio", label: "Portfolio", external: false as const },
  { href: "/resume", label: "Resume", external: false as const },
  { href: TISTORY_URL, label: "Blog", external: true as const },
];

export default function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const navItems = session?.user ? adminNavItems : publicNavItems;

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-sm print:hidden">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        <Link href={session?.user ? "/" : "/portfolio"} className="text-lg font-bold tracking-tight">
          DE Portfolio
        </Link>
        <nav className="flex items-center gap-6">
          {navItems.map((item) =>
            item.external ? (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm transition-colors hover:text-foreground",
                  pathname === item.href ||
                    (item.href !== "/" && pathname.startsWith(item.href))
                    ? "text-foreground font-medium"
                    : "text-muted-foreground"
                )}
              >
                {item.label}
              </Link>
            )
          )}
          <div className="h-4 w-px bg-border" />
          <LoginButton />
        </nav>
      </div>
    </header>
  );
}
