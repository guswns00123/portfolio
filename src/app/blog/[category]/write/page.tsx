import { notFound } from "next/navigation";
import { BLOG_CATEGORIES } from "@/lib/mdx";
import PostEditor from "@/components/blog/PostEditor";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function WritePage(
  props: PageProps<"/blog/[category]/write">
) {
  const { category } = await props.params;
  const catInfo = BLOG_CATEGORIES[category];

  if (!catInfo) notFound();

  return (
    <div className="flex flex-col gap-6">
      <Link
        href={`/blog/${category}`}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        {catInfo.name}
      </Link>

      <h1 className="text-2xl font-bold tracking-tight">새 글 작성</h1>

      <PostEditor category={category} mode="create" />
    </div>
  );
}
