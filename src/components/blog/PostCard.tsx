import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { PostMeta } from "@/lib/mdx";

export default function PostCard({ post }: { post: PostMeta }) {
  return (
    <Link
      href={`/blog/${post.category}/${post.slug}`}
      className="group flex flex-col gap-2 rounded-lg border p-5 transition-colors hover:bg-accent"
    >
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <time>{post.date}</time>
        {post.category && (
          <>
            <span>&middot;</span>
            <span>{post.category}</span>
          </>
        )}
      </div>
      <h3 className="text-lg font-semibold group-hover:underline">
        {post.title}
      </h3>
      {post.description && (
        <p className="text-sm text-muted-foreground line-clamp-2">
          {post.description}
        </p>
      )}
      {post.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1 pt-1">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </Link>
  );
}
