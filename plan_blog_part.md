# Blog 파트 실행 계획

## 1. 카테고리 구조 제안

데이터 엔지니어 기술 스택 + 성장 방향을 고려한 카테고리 (5개):

| 카테고리 | slug | 설명 | 예시 글 |
|----------|------|------|---------|
| **Data Engineering** | `data-engineering` | Airflow, ETL/ELT, Spark, Kafka, Hadoop, 배치/스트리밍 | "Airflow DAG 설계 패턴", "Kafka 기본 개념 정리" |
| **SQL & Database** | `sql-database` | 쿼리 최적화, 윈도우 함수, 데이터 모델링, PostgreSQL, 인덱싱 | "LEAD/LAG 활용 실전 예제", "PostgreSQL 인덱스 전략" |
| **Python** | `python` | 데이터 처리, 라이브러리, 크롤링, 스크립팅 | "Pandas vs Polars 성능 비교", "크롤링 안정화 패턴" |
| **Infra & Cloud** | `infra-cloud` | AWS, Docker, Linux, 네트워크, 모니터링, CI/CD | "AWS Lambda로 서버리스 ETL", "Prometheus+Grafana 세팅" |
| **AI** | `ai` | LLM, ML 파이프라인, RAG, 벡터 DB, 프롬프트 엔지니어링 | "RAG 파이프라인 구축기", "LLM 활용 데이터 전처리" |

---

## 2. 페이지 구조

```
/blog                    → 카테고리 overview (카테고리별 최근 글 미리보기)
/blog/[category]         → 해당 카테고리 글 목록
/blog/[category]/[slug]  → 글 상세 페이지 (읽기)
/blog/write              → 글쓰기 페이지 (admin only)
/blog/[category]/[slug]/edit  → 글 수정 페이지 (admin only)
```

### /blog (메인)
- 상단: 카테고리 탭/카드 그리드 (각 카테고리명 + 글 개수 + 최근 글 1-2개 미리보기)
- 카테고리 클릭 → /blog/[category]로 이동
- 우측 상단: "글쓰기" 버튼 (admin에게만 보임)

### /blog/[category]
- 해당 카테고리 글 목록 (제목, 날짜, 태그, 설명)
- 각 글에 수정/삭제 버튼 (admin에게만 보임)

### /blog/[category]/[slug]
- 기존 MDX 렌더링 + 수정/삭제 버튼 (admin에게만 보임)

### /blog/write
- 마크다운 에디터 + 우측 AI 보조 패널
- 카테고리 선택, 제목, 태그 입력
- 저장 시 MDX 파일 생성 → content/blog/[category]/ 디렉토리에 저장

---

## 3. 글쓰기 + AI 보조

### 에디터 구성
```
┌─────────────────────────────┬──────────────────┐
│                             │   AI 보조 패널    │
│    마크다운 에디터            │                  │
│    (제목, 카테고리, 태그)     │  · 주제 리서치    │
│                             │  · 구조 제안      │
│    본문 작성 영역            │  · 문장 다듬기    │
│                             │  · 관련 자료 정리  │
│                             │                  │
└─────────────────────────────┴──────────────────┘
```

### AI 보조 기능
- 기존 ChatPanel을 활용하되, 글쓰기 모드에서는 현재 작성 중인 글 내용을 context로 전달
- "이 주제에 대해 구조를 잡아줘", "이 문단을 다듬어줘" 등 요청 가능
- 기존 우측 슬라이드 패널 구조 그대로 활용 (추가 개발 최소화)

---

## 4. Admin 인증 (글쓰기/수정/삭제 권한)

### 방식 비교

| 방식 | 장점 | 단점 | 추천 |
|------|------|------|------|
| **A) 환경변수 비밀번호** | 구현 5분, DB 불필요 | 보안 약함, 세션 관리 수동 | 개발 단계용 |
| **B) NextAuth + GitHub OAuth** | 본인 GitHub 계정만 허용, 보안 강함 | 설정 약간 필요 | **추천** |
| **C) Middleware 기반 간단 토큰** | 심플, cookie 기반 | 직접 구현 부담 | 중간 |

### 추천: B) NextAuth + GitHub OAuth

```
로그인 안 됨 → 글쓰기/수정/삭제 버튼 안 보임 (방문자 모드)
로그인 됨 + 본인 GitHub ID → 글쓰기/수정/삭제 버튼 보임 (admin 모드)
```

- 허용할 GitHub ID를 환경변수에 지정 (예: ADMIN_GITHUB_ID=guswns00123)
- NextAuth의 `session` callback에서 admin 여부를 판단
- 서버 컴포넌트에서 session 확인 → admin이면 버튼 렌더, 아니면 숨김
- API Route에서도 session 확인 → 비인가 요청 차단

### ✅ 결정: B) NextAuth + GitHub OAuth 로 구현

- `next-auth` 패키지 설치
- GitHub OAuth App 등록 필요 (GitHub Settings → Developer settings → OAuth Apps)
- 환경변수: `GITHUB_ID`, `GITHUB_SECRET`, `NEXTAUTH_SECRET`, `ADMIN_GITHUB_ID`
- 허용된 GitHub ID만 admin 권한 부여

---

## 5. 글 저장/수정/삭제 메커니즘

### 현재 구조: 정적 MDX 파일 기반

문제: Next.js는 빌드 타임에 MDX를 읽는 구조라, 런타임에 파일을 생성/수정하면 재빌드가 필요함.

### 해결 방안

| 방식 | 설명 | 추천 |
|------|------|------|
| **A) API Route로 파일 CRUD + ISR** | API에서 fs.writeFile로 MDX 저장, revalidatePath로 갱신 | **추천** |
| **B) GitHub API 연동** | 글 저장 시 GitHub repo에 커밋 → Vercel 자동 재배포 | 깔끔하지만 느림 |
| **C) DB 저장 (Supabase 등)** | MDX 대신 DB에 저장 | 현재 구조 변경 큼 |

### 추천: A) API Route + ISR

```
POST   /api/posts     → MDX 파일 생성 + revalidatePath
PUT    /api/posts/:slug → MDX 파일 수정 + revalidatePath
DELETE /api/posts/:slug → MDX 파일 삭제 + revalidatePath
```

- 서버에서 `fs.writeFileSync`로 content/blog/ 디렉토리에 직접 저장
- `revalidatePath('/blog')` 호출로 페이지 즉시 갱신
- 로컬 개발 환경에서 바로 동작, Vercel에서는 제한 있음 (읽기 전용 파일시스템)

### Vercel 배포 시 대응

Vercel은 파일시스템이 읽기 전용이므로, 배포 후에는 **B) GitHub API 방식**으로 전환 필요:

```
글 저장 → GitHub API로 content/blog/에 커밋 → Vercel 자동 재배포 (약 30초~1분)
```

이건 나중에 배포 단계에서 전환하면 되고, 로컬 개발에서는 A 방식으로 충분.

---

## 6. 구현 순서

```
Phase 1: 카테고리 구조 + UI
  ├── MDX frontmatter에 category 필드 활용 (이미 있음)
  ├── /blog 페이지 리디자인 (카테고리 overview)
  ├── /blog/[category] 페이지 생성
  └── /blog/[category]/[slug] 라우트 변경

Phase 2: Admin 인증 (NextAuth + GitHub OAuth)
  ├── next-auth 설치 및 GitHub OAuth 설정
  ├── admin 여부에 따른 조건부 UI 렌더링
  └── API Route에 인증 미들웨어 추가

Phase 3: 글쓰기/수정/삭제
  ├── /blog/write 페이지 (마크다운 에디터)
  ├── CRUD API Routes (/api/posts)
  ├── 수정/삭제 기능
  └── AI 보조 패널 연동 (기존 ChatPanel 활용)

Phase 4: (나중에) Vercel 배포 대응
  └── GitHub API 연동으로 글 저장 방식 전환
```

---

## 7. 디렉토리 구조 변경

```
content/blog/
├── data-engineering/
│   └── kafka-streams-intro.mdx   ← 기존 글 이동
├── sql-database/
├── python/
├── infra-cloud/
└── ai/
```

> 기존 content/blog/ 루트에 있던 파일들은 적절한 카테고리 폴더로 이동.
> mdx.ts의 readMdxFiles 함수가 하위 디렉토리를 재귀 탐색하도록 수정 필요.
