import fs from "fs";
import path from "path";

const aboutDir = path.join(process.cwd(), "content", "about");
const blogDir = path.join(process.cwd(), "content", "blog");
const portfolioDir = path.join(process.cwd(), "content", "portfolio");

function readMdFiles(dir: string): string {
  if (!fs.existsSync(dir)) return "";

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let result = "";

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      result += readMdFiles(fullPath);
    } else if (entry.name.endsWith(".md") || entry.name.endsWith(".mdx")) {
      result += fs.readFileSync(fullPath, "utf-8") + "\n\n";
    }
  }

  return result;
}

export function getAboutContext(): string {
  return readMdFiles(aboutDir);
}

export function getBlogContext(): string {
  return readMdFiles(blogDir);
}

export function getPortfolioContext(): string {
  return readMdFiles(portfolioDir);
}

export function getFullContext(options?: { includeBlog?: boolean }): string {
  const about = getAboutContext();
  const portfolio = getPortfolioContext();

  let context = "=== 유현준에 대한 정보 ===\n\n" + about;

  if (portfolio.trim()) {
    context += "\n=== 포트폴리오 프로젝트 상세 ===\n\n" + portfolio;
  }

  if (options?.includeBlog) {
    const blog = getBlogContext();
    if (blog.trim()) {
      context += "\n=== 블로그 글 (기술 공부 기록) ===\n\n" + blog;
    }
  }

  return context;
}
