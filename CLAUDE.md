@AGENTS.md

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — 개발 서버 실행
- `npm run build` — 프로덕션 빌드
- `npm run lint` — ESLint 실행

## Architecture

데이터 엔지니어 포트��리오 + 스터디 블로그 + AI 보조 챗봇 사이트.

- **Framework**: Next.js 16 (App Router, TypeScript, Tailwind CSS v4)
- **UI**: shadcn/ui (components/ui/)
- **콘텐츠**: MDX 파일 기반 (content/blog/, content/portfolio/)
- **챗봇**: Claude API (Haiku) — 작성자용 보조 어시스턴트, 우측 슬라이드 패널

### Key paths

- `src/lib/mdx.ts` — MDX 파싱 (gray-matter). getAllPosts(), getPostBySlug() 등
- `src/components/chat/` — 챗봇 UI (ChatProvider context, ChatPanel, ChatInput, ChatMessage)
- `src/app/api/chat/route.ts` — Claude API SSE 스트리밍 Route Handler
- `content/` — MDX 콘텐츠 디렉토리 (blog/, portfolio/)

### Next.js 16 notes

- `params`는 Promise — 반드시 `await` 필요
- `PageProps<'/path/[param]'>`, `LayoutProps` 글로벌 헬퍼 사용 (import 불필요)
- Tailwind v4: globals.css에서 `@plugin` 으로 플러그인 등록

## Code Style

- 커밋 메시지는 한글로 작성
- 기술 용어는 영어 원문 병기
