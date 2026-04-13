import { notFound } from "next/navigation";
import { BLOG_CATEGORIES, getPostBySlug } from "@/lib/mdx";
import PostEditor from "@/components/blog/PostEditor";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function EditPage(
  props: PageProps<"/blog/[category]/[slug]/edit">
) {
  const { category, slug } = await props.params;
  const catInfo = BLOG_CATEGORIES[category];

  if (!catInfo) notFound();

  const post = getPostBySlug(category, slug);
  if (!post) notFound();

  return (
    <div className="flex flex-col gap-6">
      <Link
        href={`/blog/${category}/${slug}`}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        돌아가기
      </Link>

      <h1 className="text-2xl font-bold tracking-tight">글 수정</h1>

      <PostEditor
        category={category}
        mode="edit"
        initialSlug={slug}
        initialTitle={post.meta.title}
        initialDescription={post.meta.description || ""}
        initialTags={post.meta.tags?.join(", ") || ""}
        initialDate={post.meta.date}
        initialContent={post.content}
      />
    </div>
  );
}
