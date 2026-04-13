"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import LoginButton from "@/components/auth/LoginButton";

const publicNavItems = [{ href: "/portfolio", label: "Portfolio" }];

const adminNavItems = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/portfolio", label: "Portfolio" },
];

export default function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const navItems = session?.user ? adminNavItems : publicNavItems;

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        <Link href={session?.user ? "/" : "/portfolio"} className="text-lg font-bold tracking-tight">
          DE Portfolio
        </Link>
        <nav className="flex items-center gap-6">
          {navItems.map((item) => (
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
          ))}
          <div className="h-4 w-px bg-border" />
          <LoginButton />
        </nav>
      </div>
    </header>
  );
}
