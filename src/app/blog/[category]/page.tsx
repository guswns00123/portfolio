import { notFound } from "next/navigation";
import { BLOG_CATEGORIES, getPostsByCategory } from "@/lib/mdx";
import PostCard from "@/components/blog/PostCard";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AdminOnly from "@/components/auth/AdminOnly";

export function generateStaticParams() {
  return Object.keys(BLOG_CATEGORIES).map((category) => ({ category }));
}

export default async function CategoryPage(
  props: PageProps<"/blog/[category]">
) {
  const { category } = await props.params;
  const catInfo = BLOG_CATEGORIES[category];

  if (!catInfo) notFound();

  const posts = getPostsByCategory(category);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <Link
          href="/blog"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          전체 카테고리
        </Link>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">{catInfo.name}</h1>
          <AdminOnly>
            <Link
              href={`/blog/${category}/write`}
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              새 글 작성
            </Link>
          </AdminOnly>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          {catInfo.description}
        </p>
      </div>

      {posts.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">
          아직 작성된 글이 없습니다.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
