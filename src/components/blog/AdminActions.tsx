"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";

export default function AdminActions({
  category,
  slug,
}: {
  category: string;
  slug: string;
}) {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session) return null;

  async function handleDelete() {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    const res = await fetch(`/api/posts/${category}/${slug}`, {
      method: "DELETE",
    });

    if (res.ok) {
      router.push(`/blog/${category}`);
      router.refresh();
    } else {
      alert("삭제에 실패했습니다.");
    }
  }

  return (
    <div className="flex items-center gap-2 shrink-0">
      <Link
        href={`/blog/${category}/${slug}/edit`}
        className="inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
      >
        <Pencil className="h-3.5 w-3.5" />
        수정
      </Link>
      <button
        onClick={handleDelete}
        className="inline-flex items-center gap-1 rounded-md border border-destructive/30 px-2.5 py-1 text-sm text-destructive hover:bg-destructive/10 transition-colors"
      >
        <Trash2 className="h-3.5 w-3.5" />
        삭제
      </button>
    </div>
  );
}
