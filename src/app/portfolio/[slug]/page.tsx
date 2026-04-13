import { notFound } from "next/navigation";
import { getAllProjects, getProjectBySlug } from "@/lib/mdx";
import PostContent from "@/components/blog/PostContent";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

export function generateStaticParams() {
  return getAllProjects().map((project) => ({ slug: project.slug }));
}

export default async function ProjectDetailPage(
  props: PageProps<"/portfolio/[slug]">
) {
  const { slug } = await props.params;
  const project = getProjectBySlug(slug);

  if (!project) notFound();

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/portfolio"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Portfolio
      </Link>

      <header className="flex flex-col gap-3">
        <h1 className="text-3xl font-bold tracking-tight">
          {project.meta.title}
        </h1>
        <p className="text-muted-foreground">{project.meta.description}</p>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <time>{project.meta.date}</time>
        </div>
        {project.meta.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {project.meta.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        {(project.meta.github || project.meta.link) && (
          <div className="flex flex-wrap gap-2">
            {project.meta.github && (
              <a
                href={project.meta.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-80 transition-opacity"
              >
                <GitHubIcon className="h-4 w-4" />
                GitHub
              </a>
            )}
            {project.meta.link && (
              <a
                href={project.meta.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                Demo
              </a>
            )}
          </div>
        )}
      </header>

      <PostContent content={project.content} />
    </div>
  );
}
