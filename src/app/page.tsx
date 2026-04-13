import Link from "next/link";
import { ArrowRight, Briefcase, BookOpen } from "lucide-react";
import HomeChat from "@/components/chat/HomeChat";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-0 -my-8 h-[calc(100vh-3.5rem)]">
      {/* 상단 바로가기 */}
      <div className="flex items-center justify-between border-b px-2 py-3 shrink-0">
        <div>
          <h1 className="text-lg font-bold tracking-tight">
            유현준 <span className="text-muted-foreground font-normal text-sm">Data Engineer</span>
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/portfolio"
            className="group inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium hover:bg-accent transition-colors"
          >
            <Briefcase className="h-3.5 w-3.5" />
            Portfolio
            <ArrowRight className="h-3 w-3 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/blog"
            className="group inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium hover:bg-accent transition-colors"
          >
            <BookOpen className="h-3.5 w-3.5" />
            Blog
            <ArrowRight className="h-3 w-3 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>

      {/* 메인 챗봇 */}
      <HomeChat />
    </div>
  );
}
