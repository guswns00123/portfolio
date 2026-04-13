"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Eye, EyeOff, Save } from "lucide-react";

interface PostEditorProps {
  category: string;
  mode: "create" | "edit";
  initialSlug?: string;
  initialTitle?: string;
  initialDescription?: string;
  initialTags?: string;
  initialDate?: string;
  initialContent?: string;
}

export default function PostEditor({
  category,
  mode,
  initialSlug = "",
  initialTitle = "",
  initialDescription = "",
  initialTags = "",
  initialDate = new Date().toISOString().split("T")[0],
  initialContent = "",
}: PostEditorProps) {
  const { data: session } = useSession();
  const router = useRouter();

  const [slug, setSlug] = useState(initialSlug);
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [tags, setTags] = useState(initialTags);
  const [date, setDate] = useState(initialDate);
  const [content, setContent] = useState(initialContent);
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);

  if (!session) {
    return (
      <p className="text-center text-muted-foreground py-12">
        로그인이 필요합니다.
      </p>
    );
  }

  function generateSlug(title: string) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9가-힣\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 60);
  }

  async function handleSave() {
    if (!title || !content) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    const finalSlug = slug || generateSlug(title);
    setSaving(true);

    const frontmatter = [
      `title: "${title}"`,
      `date: "${date}"`,
      `category: "${category}"`,
      description && `description: "${description}"`,
      tags && `tags: [${tags.split(",").map((t) => `"${t.trim()}"`).join(", ")}]`,
    ]
      .filter(Boolean)
      .join("\n");

    try {
      const url =
        mode === "create"
          ? `/api/posts/${category}`
          : `/api/posts/${category}/${initialSlug}`;

      const res = await fetch(url, {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: finalSlug,
          frontmatter,
          content,
        }),
      });

      if (res.ok) {
        router.push(`/blog/${category}/${finalSlug}`);
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "저장에 실패했습니다.");
      }
    } catch {
      alert("저장 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* 메타 정보 */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">제목 *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="글 제목"
            className="rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">슬러그 (URL)</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder={title ? generateSlug(title) : "auto-generated"}
            disabled={mode === "edit"}
            className="rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">설명</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="간단한 설명"
            className="rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">태그 (쉼표 구분)</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="kafka, streaming, ETL"
            className="rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">날짜</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {/* 툴바 */}
      <div className="flex items-center justify-between border-b pb-2">
        <button
          onClick={() => setPreview(!preview)}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          {preview ? (
            <>
              <EyeOff className="h-4 w-4" /> 에디터
            </>
          ) : (
            <>
              <Eye className="h-4 w-4" /> 미리보기
            </>
          )}
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving ? "저장 중..." : mode === "create" ? "발행" : "수정 저장"}
        </button>
      </div>

      {/* 에디터 / 미리보기 */}
      {preview ? (
        <div className="prose prose-neutral dark:prose-invert max-w-none rounded-md border p-6 min-h-[400px]">
          <pre className="whitespace-pre-wrap text-sm">{content}</pre>
        </div>
      ) : (
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="마크다운으로 내용을 작성하세요..."
          className="min-h-[400px] w-full rounded-md border bg-background px-4 py-3 text-sm font-mono outline-none focus:ring-2 focus:ring-ring resize-y"
        />
      )}
    </div>
  );
}
