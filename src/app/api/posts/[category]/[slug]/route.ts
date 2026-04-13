import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import fs from "fs";
import path from "path";
import { revalidatePath } from "next/cache";

const contentDir = path.join(process.cwd(), "content", "blog");

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ category: string; slug: string }> }
) {
  const { category, slug } = await params;
  const filePath = path.join(contentDir, category, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  return NextResponse.json({ content: raw });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ category: string; slug: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { category, slug } = await params;
  const { frontmatter, content } = await req.json();
  const filePath = path.join(contentDir, category, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const fileContent = `---\n${frontmatter}\n---\n\n${content}`;
  fs.writeFileSync(filePath, fileContent, "utf-8");

  revalidatePath(`/blog/${category}`);
  revalidatePath(`/blog/${category}/${slug}`);
  revalidatePath("/blog");

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ category: string; slug: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { category, slug } = await params;
  const filePath = path.join(contentDir, category, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  fs.unlinkSync(filePath);

  revalidatePath(`/blog/${category}`);
  revalidatePath("/blog");

  return NextResponse.json({ ok: true });
}
