import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentDir = path.join(process.cwd(), "content");

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  category: string;
  description?: string;
}

export interface ProjectMeta {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  date: string;
  type?: "experience" | "personal";
  period?: string;
  highlight?: string;
  github?: string;
  link?: string;
}

export const BLOG_CATEGORIES: Record<
  string,
  { name: string; description: string }
> = {
  "data-engineering": {
    name: "Data Engineering",
    description: "Airflow, ETL/ELT, Spark, Kafka, Hadoop, 배치/스트리밍",
  },
  "sql-database": {
    name: "SQL & Database",
    description: "쿼리 최적화, 윈도우 함수, 데이터 모델링, PostgreSQL",
  },
  python: {
    name: "Python",
    description: "데이터 처리, 라이브러리, 크롤링, 스크립팅",
  },
  "infra-cloud": {
    name: "Infra & Cloud",
    description: "AWS, Docker, Linux, 모니터링, CI/CD",
  },
  ai: {
    name: "AI",
    description: "LLM, ML 파이프라인, RAG, 벡터 DB, 프롬프트 엔지니어링",
  },
};

function readMdxFilesRecursive<T extends { slug: string; date: string }>(
  baseDir: string
): T[] {
  if (!fs.existsSync(baseDir)) return [];

  const results: T[] = [];

  function walk(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.name.endsWith(".mdx")) {
        const raw = fs.readFileSync(fullPath, "utf-8");
        const { data } = matter(raw);
        results.push({
          slug: entry.name.replace(/\.mdx$/, ""),
          ...data,
        } as T);
      }
    }
  }

  walk(baseDir);
  return results.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

function readMdxFiles<T extends { slug: string; date: string }>(
  subdir: string
): T[] {
  const dir = path.join(contentDir, subdir);
  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));

  return files
    .map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), "utf-8");
      const { data } = matter(raw);
      return {
        slug: file.replace(/\.mdx$/, ""),
        ...data,
      } as T;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getAllPosts(): PostMeta[] {
  return readMdxFilesRecursive<PostMeta>(path.join(contentDir, "blog"));
}

export function getPostsByCategory(category: string): PostMeta[] {
  return readMdxFiles<PostMeta>(`blog/${category}`);
}

export function getPostCountByCategory(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const cat of Object.keys(BLOG_CATEGORIES)) {
    const dir = path.join(contentDir, "blog", cat);
    if (fs.existsSync(dir)) {
      counts[cat] = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx")).length;
    } else {
      counts[cat] = 0;
    }
  }
  return counts;
}

export function getAllProjects(): ProjectMeta[] {
  return readMdxFiles<ProjectMeta>("portfolio");
}

export function getPostBySlug(category: string, slug: string) {
  const filePath = path.join(contentDir, "blog", category, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    meta: { slug, ...data } as PostMeta,
    content,
  };
}

export function getProjectBySlug(slug: string) {
  const filePath = path.join(contentDir, "portfolio", `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    meta: { slug, ...data } as ProjectMeta,
    content,
  };
}
