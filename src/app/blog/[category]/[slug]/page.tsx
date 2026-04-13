import { notFound } from "next/navigation";
import {
  BLOG_CATEGORIES,
  getAllPosts,
  getPostBySlug,
} from "@/lib/mdx";
import PostContent from "@/components/blog/PostContent";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AdminActions from "@/components/blog/AdminActions";

export function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    category: post.category,
    slug: post.slug,
  }));
}

export default async function BlogPostPage(
  props: PageProps<"/blog/[category]/[slug]">
) {
  const { category, slug } = await props.params;
  const catInfo = BLOG_CATEGORIES[category];

  if (!catInfo) notFound();

  const post = getPostBySlug(category, slug);

  if (!post) notFound();

  return (
    <div className="flex flex-col gap-6">
      <Link
        href={`/blog/${category}`}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        {catInfo.name}
      </Link>

      <header className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">
            {post.meta.title}
          </h1>
          <AdminActions category={category} slug={slug} />
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <time>{post.meta.date}</time>
          <span>&middot;</span>
          <span>{catInfo.name}</span>
        </div>
        {post.meta.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {post.meta.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </header>

      <PostContent content={post.content} />
    </div>
  );
}
