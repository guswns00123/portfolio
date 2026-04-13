"use client";

import { useSession } from "next-auth/react";

export default function AdminOnly({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();

  if (!session) return null;

  return <>{children}</>;
}
