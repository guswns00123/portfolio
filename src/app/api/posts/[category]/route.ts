import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import fs from "fs";
import path from "path";
import { revalidatePath } from "next/cache";

const contentDir = path.join(process.cwd(), "content", "blog");

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ category: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { category } = await params;
  const { slug, frontmatter, content } = await req.json();

  if (!slug || !content) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const categoryDir = path.join(contentDir, category);
  if (!fs.existsSync(categoryDir)) {
    fs.mkdirSync(categoryDir, { recursive: true });
  }

  const filePath = path.join(categoryDir, `${slug}.mdx`);
  if (fs.existsSync(filePath)) {
    return NextResponse.json({ error: "Already exists" }, { status: 409 });
  }

  const fileContent = `---\n${frontmatter}\n---\n\n${content}`;
  fs.writeFileSync(filePath, fileContent, "utf-8");

  revalidatePath(`/blog/${category}`);
  revalidatePath(`/blog/${category}/${slug}`);
  revalidatePath("/blog");

  return NextResponse.json({ ok: true, slug });
}
