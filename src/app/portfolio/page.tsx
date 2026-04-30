import { getAllProjects } from "@/lib/mdx";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  Briefcase,
  Code,
  Layers,
} from "lucide-react";
import ArchitectureFlow, {
  FlowNode,
  FlowEdge,
} from "@/components/portfolio/ArchitectureFlow";

const PROFILE_TAGS = [
  "Data Engineer",
  "Data Pipeline",
  "BigData",
  "Python",
  "Java",
  "Hadoop Ecosystem",
  "Linux",
  "SQL",
  "AWS",
  "Airflow",
];

const TECH_STACK = [
  {
    category: "Languages",
    items: ["Python", "Java", "SQL"],
  },
  {
    category: "Pipeline & Orchestration",
    items: ["Airflow", "Kafka", "Spark"],
  },
  {
    category: "Database",
    items: ["PostgreSQL", "Oracle", "MySQL"],
  },
  {
    category: "Big Data & Distributed",
    items: ["Hadoop", "HDFS", "MapReduce"],
  },
  {
    category: "Infra & Tools",
    items: ["AWS", "Docker", "Linux", "Git", "QGIS"],
  },
];

const EXPERIENCES: {
  title: string;
  company: string;
  period: string;
  summary: string;
  flow: { nodes: FlowNode[]; edges: FlowEdge[] };
  achievements: string[];
  tags: string[];
}[] = [
  {
    title: "검역본부 가축 질병 예측 데이터 파이프라인",
    company: "빅밸류",
    period: "2025.06 ~ 2025.12",
    summary:
      "폐쇄망 환경에서 ASF/HPAI/FMD 예측 모델용 데이터 전처리·적재 파이프라인 구축 및 운영",
    flow: {
      nodes: [
        { icon: "/icons/oracle.svg", label: "Oracle" },
        { icon: "/icons/postgresql.svg", label: "PostgreSQL" },
        { icon: "/icons/airflow.svg", label: "Airflow" },
        { icon: "/icons/llm.svg", label: "LLM/모델" },
        { icon: "/icons/postgresql.svg", label: "PostgreSQL" },
        { icon: "/icons/ui.svg", label: "UI" },
      ],
      edges: [
        { label: "DB 이관", sub: "원천 데이터" },
        { label: "ETL 전처리", sub: "정제·변환·적재" },
        { label: "스케줄링/실행", sub: "일별 배치 자동화" },
        { label: "예측 수행", sub: "ASF/HPAI/FMD" },
        { label: "결과 적재", sub: "예측 결과 저장" },
      ],
    },
    achievements: [
      "전국 농장 단위 사육두수·질병 데이터를 일 단위로 수집·적재",
      "9개 DAG 운영: 원천 DB 수집 1개 + 질병별 위험도 산출 4개 + 개발팀 View 제공 4개",
      "레거시 산출 프로세스 처리 속도 12x 개선 (1일 → 2시간)",
      "원격 운영을 위한 테이블별 task 분리 및 장애 대응 로그 체계 설계",
    ],
    tags: ["Python", "Airflow", "PostgreSQL", "Oracle", "SQL"],
  },
  {
    title: "부동산 시세 데이터 파이프라인",
    company: "빅밸류",
    period: "2025.04 ~ 2026.02",
    summary:
      "금융권 고객사 대상 월별 시세 데이터 생성·검수·납품 파이프라인 운영",
    flow: {
      nodes: [
        { icon: "/icons/public-data.svg", label: "공공+자체+고객사" },
        { icon: "/icons/airflow.svg", label: "Airflow" },
        { icon: "/icons/python.svg", label: "Python 검수" },
        { icon: "/icons/csv.svg", label: "CSV 납품" },
      ],
      edges: [
        { label: "데이터 수집/병합" },
        { label: "배치 스케줄링" },
        { label: "변동률·이상치 탐지", sub: "전월 대비 QA" },
      ],
    },
    achievements: [
      "PNU 기반 아파트·오피스텔·단독다가구 시세 산출, 100m 격자 데이터 약 1,300만 건 처리",
      "6개 DAG 운영: 고객사 납품용 2개 + 원천 수집·전처리·중간 데이터 생성 4개",
      "레거시 프로세스 리팩토링으로 월간 시세 산출 시간 6시간 → 2시간 단축 (3x 개선)",
      "기존에 없던 자동 검수 체계를 도입하여 격자-시세 미매핑, 격자-PNU 미매핑 등 데이터 결함 탐지·수정",
    ],
    tags: ["Python", "Airflow", "PostgreSQL", "SQL"],
  },
  {
    title: "경매 데이터 수집 파이프라인",
    company: "빅밸류",
    period: "2025.04 ~ 2026.02",
    summary: "외부 판매용 경매 데이터의 자동 수집·가공 파이프라인 구축",
    flow: {
      nodes: [
        { icon: "/icons/web-crawling.svg", label: "웹 (경매 사이트)" },
        { icon: "/icons/python.svg", label: "Python 크롤러" },
        { icon: "/icons/python.svg", label: "Python 정제" },
        { icon: "/icons/postgresql.svg", label: "PostgreSQL" },
      ],
      edges: [
        { label: "웹 크롤링", sub: "재시도 로직" },
        { label: "데이터 수집", sub: "파싱·정규화" },
        { label: "비정규화 적재", sub: "조인 없이 활용" },
      ],
    },
    achievements: [
      "3개 수집 서버 운영, 일 평균 2,000~3,000건 경매 데이터 자동 수집",
      "IP 차단 대응: 클라우드 서버 이전 + 수집 대상 최적화 (일 12,000건 → 4,000건 타겟 수집)로 수집 속도 2x 향상",
      "Request 기반(사건 정보) + Selenium 기반(감정평가서 PDF) 속도 차이를 3일 분할 수집으로 해소",
      "취하·기일변경 사건 누락 탐지 쿼리 및 일일 수집 현황 모니터링 체계 구축",
      "분석가가 조인 없이 바로 활용 가능한 비정규화 테이블 설계 (복합 PK: 사건번호+법원+매각기일)",
    ],
    tags: ["Python", "Airflow", "PostgreSQL", "Selenium", "Web Crawling"],
  },
  {
    title: "도로 교차로 네트워크 구축",
    company: "빅밸류",
    period: "2025.03 ~ 2025.04",
    summary: "사내 분석팀용 전국 도로 교차로 공간 데이터 확장 및 속성 설계",
    flow: {
      nodes: [
        { icon: "/icons/gov-data.svg", label: "정부 도로 데이터" },
        { icon: "/icons/qgis.svg", label: "QGIS" },
        { icon: "/icons/python.svg", label: "Python 후처리" },
        { icon: "/icons/postgresql.svg", label: "PostgreSQL" },
      ],
      edges: [
        { label: "원천 로드" },
        { label: "교차점 추출", sub: "공간 분석" },
        { label: "속성 연산", sub: "방향 수, 군집 ID" },
      ],
    },
    achievements: [
      "교차점 데이터 약 4.6배 확장: 1.8만 → 8.4만 개 (골목길 수준 커버리지 확보)",
      "이동 방향 수, 군집 ID 등 분석용 공간 속성 추가로 분석팀 데이터 활용도 제고",
    ],
    tags: ["Python", "QGIS", "PostgreSQL", "GIS"],
  },
];

export default function PortfolioPage() {
  const projects = getAllProjects().filter((p) => p.type === "personal");

  return (
    <div className="flex flex-col gap-20">
      {/* ── Hero Section ── */}
      <section className="relative flex flex-col gap-6">
        <div className="absolute -top-8 -left-6 -right-6 h-64 rounded-3xl bg-gradient-to-br from-primary/5 via-transparent to-accent/5 -z-10" />

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground tracking-wider uppercase mb-2">
              Data Engineer
            </p>
            <h1 className="text-4xl font-bold tracking-tight">유현준</h1>
            <p className="text-lg text-muted-foreground mt-1">Yoo Hyun Jun</p>
          </div>
          <img
            src="/profile.jpg"
            alt="유현준 프로필"
            className="shrink-0 w-28 h-28 rounded-2xl object-cover border shadow-sm"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {PROFILE_TAGS.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs font-normal">
              {tag}
            </Badge>
          ))}
        </div>
      </section>

      {/* ── About Section ── */}
      <section className="flex flex-col gap-6">
        <h2 className="text-2xl font-bold tracking-tight">
          Development with Data
        </h2>
        <p className="text-sm text-muted-foreground -mt-4">
          데이터 엔지니어로서의 시작과 방향
        </p>

        <div className="flex flex-col gap-6 text-[15px] leading-relaxed text-muted-foreground">
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-1.5">
              Why Data Engineering
            </h3>
            <p>
              홍콩중문대학교 클라우드 수업에서 넷플릭스가 다루는 페타바이트급
              데이터를 접하며{" "}
              <span className="text-foreground font-medium">
                &quot;이 많은 데이터를 어떻게 원활하게 처리하는가&quot;
              </span>
              라는 의문을 품었습니다. Hadoop, Spark 등 분산 시스템을 공부하며
              데이터가 쪼개지고 다시 합쳐지는 프로세스에 매료되었고, 실무에서
              직접 구축한 파이프라인을 통해 검역본부 공무원들이 예측 시스템을
              안정적으로 활용하고, 데이터 사이언티스트·개발팀이 제가 설계한
              파이프라인 구조를 이해하고 신뢰하는 모습을 보며 이 일의 가치를
              확신하게 되었습니다.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-1.5">
              How I Work
            </h3>
            <p>
              처음에는 &quot;일단 동작하게 만들자&quot;는 방식으로 개발했습니다.
              하지만 경매 데이터 파이프라인을 구축하면서 전환점을 맞았습니다.
              도메인 특성을 충분히 파악하지 않고 크롤링 구조를 설계해 수집
              오류가 반복되었고, 테이블 설계를 문서화 없이 진행한 탓에 팀원들에게
              설명하는 데 큰 어려움을 겪었습니다. 이 경험을 계기로{" "}
              <span className="text-foreground font-medium">
                도메인 이해 → 설계 → 소통 → 구현
              </span>
              의 순서로 일하는 습관을 갖게 되었고, 명확한 문서화와 체계적인
              코드 설계가 소통 효율과 업무 생산성을 모두 높인다는 것을 체감하고
              있습니다.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-1.5">
              What I Pursue
            </h3>
            <p>
              일 배치 중심의 파이프라인 경험을 넘어{" "}
              <span className="text-foreground font-medium">
                대용량·실시간 데이터 처리 영역
              </span>
              으로 확장하고 싶습니다. 대학에서 익힌 Kafka의 기초를
              실무에 적용해 보는 것이 가까운 목표입니다. 더 나아가, 실무에서
              부서 간{" "}
              <span className="text-foreground font-medium">
                데이터 사일로(Data Silo)
              </span>
              로 인해 같은 데이터를 서로 다르게 해석하거나 접근조차 못하는
              문제를 직접 목격했습니다. 비개발 직군도 셀프서비스로 필요한
              데이터에 접근할 수 있는{" "}
              <span className="text-foreground font-medium">
                데이터 민주화(Data Democratization)
              </span>
              플랫폼을 만드는 것이 제가 지향하는 방향입니다.
            </p>
          </div>
        </div>
      </section>

      {/* ── Tech Stack Section ── */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-2xl font-bold tracking-tight">Tech Stack</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TECH_STACK.map((group) => (
            <Card key={group.category}>
              <CardContent className="pt-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  {group.category}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {group.items.map((item) => (
                    <Badge key={item} variant="secondary" className="text-xs">
                      {item}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ── Experience Section ── */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-2xl font-bold tracking-tight">Experience</h2>
        </div>
        <p className="text-sm text-muted-foreground -mt-4 ml-7">
          실무에서 구축·운영한 데이터 파이프라인
        </p>

        <div className="flex flex-col gap-4">
          {EXPERIENCES.map((exp) => (
            <Card key={exp.title} className="border-l-4 border-l-primary/30">
              <CardHeader>
                <CardTitle className="text-base">{exp.title}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <span>{exp.company}</span>
                  <span className="text-muted-foreground/40">·</span>
                  <span>{exp.period}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 -mt-1">
                <p className="text-sm text-muted-foreground">{exp.summary}</p>

                {/* Architecture flow */}
                <div className="rounded-lg bg-muted/30 border px-3 py-3">
                  <ArchitectureFlow
                    nodes={exp.flow.nodes}
                    edges={exp.flow.edges}
                  />
                </div>

                {/* Achievements */}
                <ul className="flex flex-col gap-1.5">
                  {exp.achievements.map((a, i) => (
                    <li
                      key={i}
                      className="text-sm flex items-start gap-2"
                    >
                      <span className="text-primary mt-1.5 shrink-0 h-1.5 w-1.5 rounded-full bg-primary" />
                      {a}
                    </li>
                  ))}
                </ul>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {exp.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="text-[11px]"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ── Projects Section ── */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Code className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-2xl font-bold tracking-tight">Projects</h2>
        </div>
        <p className="text-sm text-muted-foreground -mt-4 ml-7">
          개인 학습 및 사이드 프로젝트
        </p>

        {projects.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">
            아직 등록된 프로젝트가 없습니다.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {projects.map((project) => (
              <Link
                key={project.slug}
                href={`/portfolio/${project.slug}`}
                className="group"
              >
                <Card className="flex flex-col h-full transition-all group-hover:border-foreground/20 group-hover:shadow-md">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center justify-between gap-2">
                      <span className="line-clamp-1">{project.title}</span>
                      <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {project.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="mt-auto flex flex-col gap-3">
                    {project.highlight && (
                      <p className="text-xs font-medium text-primary bg-primary/5 rounded-md px-2.5 py-1.5">
                        {project.highlight}
                      </p>
                    )}
                    {project.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {project.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-[11px]"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    {project.period && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {project.period}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
