import { BLOG_CATEGORIES, getPostCountByCategory, getAllPosts } from "@/lib/mdx";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowRight, FolderOpen } from "lucide-react";

export default function BlogPage() {
  const counts = getPostCountByCategory();
  const allPosts = getAllPosts();

  // 카테고리별 최근 글 2개씩
  const recentByCategory: Record<string, typeof allPosts> = {};
  for (const cat of Object.keys(BLOG_CATEGORIES)) {
    recentByCategory[cat] = allPosts
      .filter((p) => p.category === cat)
      .slice(0, 2);
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Blog</h1>
        <p className="mt-2 text-muted-foreground">
          공부한 내용을 정리하고 기록합니다.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {Object.entries(BLOG_CATEGORIES).map(([slug, cat]) => (
          <Link key={slug} href={`/blog/${slug}`} className="group">
            <Card className="flex flex-col h-full transition-all group-hover:border-foreground/20 group-hover:shadow-md">
              <CardHeader>
                <CardTitle className="text-base flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2">
                    <FolderOpen className="h-4 w-4 text-muted-foreground" />
                    {cat.name}
                  </span>
                  <span className="flex items-center gap-1">
                    <Badge variant="secondary" className="text-[11px]">
                      {counts[slug] || 0}
                    </Badge>
                    <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                  </span>
                </CardTitle>
                <CardDescription className="text-xs">
                  {cat.description}
                </CardDescription>
              </CardHeader>

              {recentByCategory[slug]?.length > 0 && (
                <CardContent className="flex flex-col gap-2 -mt-1">
                  {recentByCategory[slug].map((post) => (
                    <div
                      key={post.slug}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="truncate text-muted-foreground group-hover:text-foreground transition-colors">
                        {post.title}
                      </span>
                      <span className="shrink-0 text-xs text-muted-foreground/60 ml-2">
                        {post.date}
                      </span>
                    </div>
                  ))}
                </CardContent>
              )}
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
