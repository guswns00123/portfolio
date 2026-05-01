"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Printer, Pencil, Save, X, Languages } from "lucide-react";
import type { Resume } from "@/lib/resume";

type Lang = "ko" | "en";

type Props = {
  initialKo: Resume;
  initialEn: Resume;
};

const i18n = {
  ko: {
    coreCompetencies: "[ 핵심 역량 ]",
    summary: "자기소개",
    experience: "경력 사항",
    projects: "개인 / 팀 프로젝트",
    skills: "기술 스택",
    education: "학력",
    certsAndLanguages: "자격증 및 어학",
    portfolioLinks: "포트폴리오 / 링크",
    keyResponsibilities: "주요 업무 및 역할",
    keyProjects: "주요 프로젝트",
    techStackLabel: "기술 스택:",
    portfolioLinkText: "[상세 아키텍처 및 트러블슈팅 과정 포트폴리오 링크 🔗]",
    edit: "수정",
    savePdf: "PDF 저장",
    editTitle: "이력서 편집 (JSON)",
    cancel: "취소",
    save: "저장",
    saving: "저장 중...",
    jsonError: "JSON 형식 오류 — 문법을 확인하세요.",
    saveFailed: "저장 실패",
    editHint: (
      <>
        저장하면 <code>content/resume/resume.json</code>이 갱신되고 페이지가 즉시 재검증됩니다.
      </>
    ),
    langToggle: "EN",
    contactBirthLabel: "🎂",
    contactMilitaryLabel: "🪖",
  },
  en: {
    coreCompetencies: "[ Core Competencies ]",
    summary: "Profile",
    experience: "Experience",
    projects: "Personal / Team Projects",
    skills: "Technical Skills",
    education: "Education",
    certsAndLanguages: "Certifications & Languages",
    portfolioLinks: "Portfolio / Links",
    keyResponsibilities: "Key Responsibilities",
    keyProjects: "Key Projects",
    techStackLabel: "Tech Stack:",
    portfolioLinkText: "[Detailed Architecture & Troubleshooting Portfolio 🔗]",
    edit: "Edit",
    savePdf: "Save as PDF",
    editTitle: "Edit Resume (JSON)",
    cancel: "Cancel",
    save: "Save",
    saving: "Saving...",
    jsonError: "Invalid JSON — please check the syntax.",
    saveFailed: "Save failed",
    editHint: (
      <>
        Saving updates <code>content/resume/resume.en.json</code> and the page is revalidated immediately.
      </>
    ),
    langToggle: "한",
    contactBirthLabel: "🎂",
    contactMilitaryLabel: "🪖",
  },
} as const;

export default function ResumeView({ initialKo, initialEn }: Props) {
  const { data: session } = useSession();
  const [lang, setLang] = useState<Lang>("ko");
  const [resumeKo, setResumeKo] = useState<Resume>(initialKo);
  const [resumeEn, setResumeEn] = useState<Resume>(initialEn);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAdmin = !!session?.user;
  const resume = lang === "en" ? resumeEn : resumeKo;
  const t = i18n[lang];

  const handlePrint = () => window.print();

  const toggleLang = () => setLang((l) => (l === "ko" ? "en" : "ko"));

  const handleEdit = () => {
    setDraft(JSON.stringify(resume, null, 2));
    setError(null);
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    setError(null);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    let parsed: Resume;
    try {
      parsed = JSON.parse(draft) as Resume;
    } catch {
      setError(t.jsonError);
      setSaving(false);
      return;
    }

    try {
      const res = await fetch(`/api/resume?lang=${lang}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || t.saveFailed);
      }
      if (lang === "en") setResumeEn(parsed);
      else setResumeKo(parsed);
      setEditing(false);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : t.saveFailed;
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  if (editing) {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-xl font-bold">
            {t.editTitle} <span className="text-muted-foreground text-sm font-normal">({lang.toUpperCase()})</span>
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCancel}
              className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm hover:bg-accent transition-colors"
            >
              <X className="h-3.5 w-3.5" /> {t.cancel}
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-1.5 rounded-md border bg-foreground text-background px-3 py-1.5 text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <Save className="h-3.5 w-3.5" /> {saving ? t.saving : t.save}
            </button>
          </div>
        </div>
        {error && (
          <p className="text-sm text-destructive border border-destructive/30 bg-destructive/5 rounded-md px-3 py-2">
            {error}
          </p>
        )}
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          spellCheck={false}
          className="font-mono text-xs leading-relaxed border rounded-md p-3 bg-muted/20 min-h-[70vh] resize-y"
        />
        <p className="text-xs text-muted-foreground">{t.editHint}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* 액션 바 — 언어 토글은 모두 노출, 수정/PDF는 관리자 전용. 인쇄 시 숨김 */}
      <div className="flex items-center justify-end gap-2 print:hidden">
        <button
          onClick={toggleLang}
          aria-label="Toggle language"
          className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm hover:bg-accent transition-colors"
        >
          <Languages className="h-3.5 w-3.5" />
          {t.langToggle}
        </button>
        {isAdmin && (
          <>
            <button
              onClick={handleEdit}
              className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm hover:bg-accent transition-colors"
            >
              <Pencil className="h-3.5 w-3.5" /> {t.edit}
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-md border bg-foreground text-background px-3 py-1.5 text-sm hover:opacity-90 transition-opacity"
            >
              <Printer className="h-3.5 w-3.5" /> {t.savePdf}
            </button>
          </>
        )}
      </div>

      {/* 이력서 본문 */}
      <article
        lang={lang}
        className="resume-doc bg-white text-slate-900 rounded-md border print:border-0 px-8 py-8 print:px-0 print:py-0 flex flex-col gap-7"
      >
        {/* ── Header ── */}
        <header className="flex gap-6 items-start">
          {resume.personal.photo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={resume.personal.photo}
              alt={resume.personal.nameKo}
              className="w-[110px] h-[140px] object-cover rounded-sm border border-slate-300 shrink-0"
            />
          )}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-6 items-start">
            <div className="flex flex-col gap-1.5">
              <h1
                className={
                  lang === "ko"
                    ? "text-4xl font-semibold tracking-[0.3em] text-slate-900"
                    : "text-4xl font-semibold tracking-wide text-slate-900"
                }
              >
                {lang === "ko"
                  ? resume.personal.nameKo.split("").join(" ")
                  : resume.personal.nameEn}
              </h1>
              <p className="text-base text-slate-600 mt-1">{resume.personal.title}</p>
              <dl className="flex flex-col gap-0.5 text-sm text-slate-700 mt-2">
                <ContactRow icon="✉" value={resume.personal.email} />
                <ContactRow icon="☎" value={resume.personal.phone} />
                <ContactRow icon={t.contactBirthLabel} value={resume.personal.birthdate} />
                <ContactRow icon={t.contactMilitaryLabel} value={resume.personal.military} />
              </dl>
            </div>
            <aside className="rounded-md border-2 border-sky-300 bg-sky-50/30 px-4 py-3 min-w-[240px]">
              <p className="text-sm font-bold text-slate-900 mb-2">{t.coreCompetencies}</p>
              <ul className="flex flex-col gap-1.5">
                {resume.coreCompetencies.map((c, i) => (
                  <li key={i} className="text-[13px] text-slate-800 flex items-start gap-1.5 leading-snug">
                    <span className="text-sky-600 shrink-0">✔</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </header>

        {/* ── 자기소개 ── */}
        <Section emoji="📝" title={t.summary}>
          <div className="flex flex-col gap-3">
            {resume.summary.map((s, i) => (
              <div key={i} className="flex flex-col gap-1">
                <p className="text-[14px] font-bold text-slate-900">[{s.headline}]</p>
                <p className="text-[14px] leading-relaxed text-slate-700">
                  <FormattedText text={s.body} />
                </p>
              </div>
            ))}
          </div>
        </Section>

        {/* ── 경력 사항 ── */}
        <Section emoji="💼" title={t.experience}>
          <div className="flex flex-col gap-6">
            {resume.experiences.map((exp, i) => (
              <TimelineRow
                key={i}
                period={
                  <>
                    {exp.period}
                    {exp.duration && (
                      <div className="mt-0.5">({exp.duration})</div>
                    )}
                  </>
                }
              >
                <h3 className="text-[15px] mb-3">
                  <span className="font-bold">{exp.company}</span>
                  <span className="text-slate-400 mx-2">|</span>
                  <span className="text-sky-700">{exp.role}</span>
                  {exp.employmentType && (
                    <span className="text-slate-600"> ({exp.employmentType})</span>
                  )}
                </h3>

                <BlockHeader>{t.keyResponsibilities}</BlockHeader>
                <NestedBullets blocks={exp.responsibilities} />

                <div className="mt-3" />
                <BlockHeader>{t.keyProjects}</BlockHeader>
                <NestedBullets blocks={exp.projects} />
              </TimelineRow>
            ))}
          </div>
        </Section>

        {/* ── 개인 프로젝트 ── */}
        <Section emoji="🚀" title={t.projects}>
          <div className="flex flex-col gap-5">
            {resume.projects.map((p, i) => (
              <TimelineRow key={i} period={p.period}>
                <h3 className="text-[15px] font-bold text-slate-900">
                  {p.name}
                  {p.team && (
                    <span className="text-slate-600 font-normal"> ({p.team})</span>
                  )}
                </h3>
                {p.techStack && (
                  <p className="text-[13px] italic text-slate-500 mt-0.5 mb-1.5">
                    {t.techStackLabel} {p.techStack}
                  </p>
                )}
                {p.portfolioLink && (
                  <a
                    href={p.portfolioLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[13px] text-sky-700 hover:opacity-70 mb-1.5 inline-block"
                  >
                    {t.portfolioLinkText}
                  </a>
                )}
                <ul className="flex flex-col gap-1.5">
                  {p.highlights.map((h, j) =>
                    typeof h === "string" ? (
                      <li
                        key={j}
                        className="text-[14px] text-slate-700 leading-relaxed flex items-start gap-2"
                      >
                        <span className="text-slate-400 shrink-0">•</span>
                        <span>
                          <FormattedText text={h} />
                        </span>
                      </li>
                    ) : (
                      <li key={j} className="flex flex-col gap-1">
                        <div className="text-[14px] text-slate-800 flex items-start gap-2">
                          <span className="text-slate-400 shrink-0">•</span>
                          <span className="font-medium">{h.title}</span>
                        </div>
                        {h.details.length > 0 && (
                          <ul className="ml-5 flex flex-col gap-0.5">
                            {h.details.map((d, k) => (
                              <li
                                key={k}
                                className="text-[13px] text-slate-600 leading-relaxed flex items-start gap-2"
                              >
                                <span className="text-slate-400 shrink-0">-</span>
                                <span>
                                  <FormattedText text={d} />
                                </span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    )
                  )}
                </ul>
                {p.link && (
                  <a
                    href={p.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[13px] text-sky-700 underline underline-offset-2 hover:opacity-70 break-all mt-1.5 inline-block"
                  >
                    {p.link}
                  </a>
                )}
              </TimelineRow>
            ))}
          </div>
        </Section>

        {/* ── 기술 스택 ── */}
        <Section emoji="🛠" title={t.skills}>
          <div className="flex flex-col">
            {resume.skills.map((g, i) => (
              <div
                key={g.category}
                className={`grid grid-cols-[140px_1fr] gap-4 py-2 ${
                  i !== resume.skills.length - 1 ? "border-b border-slate-100" : ""
                }`}
              >
                <span className="text-[13px] text-sky-700 font-medium">{g.category}</span>
                <span className="text-[14px] text-slate-700">{g.items.join(", ")}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* ── 학력 ── */}
        <Section emoji="🎓" title={t.education}>
          <div className="flex flex-col gap-2">
            {resume.education.map((e, i) => (
              <TimelineRow key={i} period={e.period}>
                <p className="text-[14px] text-slate-800">
                  <span className="font-bold">{e.school}</span>
                  <span className="text-slate-500"> / {e.degree}</span>
                </p>
                {e.details && (
                  <p className="text-[13px] text-slate-600 mt-0.5 leading-relaxed">{e.details}</p>
                )}
              </TimelineRow>
            ))}
          </div>
        </Section>

        {/* ── 자격증 및 어학 ── */}
        <Section emoji="📜" title={t.certsAndLanguages}>
          <div className="flex flex-col gap-1.5">
            {resume.certifications.map((c, i) => (
              <TimelineRow key={`c-${i}`} period={c.date}>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-[14px] font-bold text-slate-800">{c.name}</span>
                  <span className="text-[13px] text-sky-700">{c.issuer}</span>
                </div>
              </TimelineRow>
            ))}
            {resume.languages.map((l, i) => (
              <TimelineRow key={`l-${i}`} period="-">
                <p className="text-[14px] text-slate-800">
                  <span className="font-medium">{l.language}</span>
                  <span className="text-slate-500"> – {l.level}</span>
                </p>
              </TimelineRow>
            ))}
          </div>
        </Section>

        {/* ── 포트폴리오 / 링크 ── */}
        <Section emoji="📂" title={t.portfolioLinks}>
          <ul className="flex flex-col gap-1">
            {resume.links.map((l, i) => (
              <li key={i} className="text-[13px] flex items-baseline gap-2 flex-wrap">
                <span className="text-slate-600 min-w-[110px]">{l.label}</span>
                <a
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-700 underline underline-offset-2 hover:opacity-70 break-all"
                >
                  {l.url}
                </a>
              </li>
            ))}
          </ul>
        </Section>
      </article>
    </div>
  );
}

// ── Sub-components ──

function ContactRow({ icon, value }: { icon: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-slate-500 w-4 text-center">{icon}</span>
      <span>{value}</span>
    </div>
  );
}

function Section({
  emoji,
  title,
  children,
}: {
  emoji: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3 break-inside-avoid">
      <div className="flex items-center gap-2 border-b-2 border-slate-200 pb-1.5">
        <span className="text-lg leading-none">{emoji}</span>
        <h2 className="text-lg font-bold tracking-wide text-slate-900">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function TimelineRow({
  period,
  children,
}: {
  period: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[110px_1fr] gap-5 items-start">
      <div className="text-[12px] text-slate-500 leading-snug pt-0.5 tabular-nums">
        {period}
      </div>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

function BlockHeader({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[13px] font-bold text-sky-700 mb-1.5">[{children}]</p>
  );
}

function NestedBullets({ blocks }: { blocks: { title: string; details: string[] }[] }) {
  return (
    <ul className="flex flex-col gap-2">
      {blocks.map((b, i) => (
        <li key={i} className="flex flex-col gap-1">
          <div className="text-[14px] text-slate-800 flex items-start gap-2">
            <span className="text-slate-400 shrink-0">•</span>
            <span className="font-medium">{b.title}</span>
          </div>
          {b.details.length > 0 && (
            <ul className="ml-5 flex flex-col gap-0.5">
              {b.details.map((d, j) => (
                <li
                  key={j}
                  className="text-[13px] text-slate-600 leading-relaxed flex items-start gap-2"
                >
                  <span className="text-slate-400 shrink-0">-</span>
                  <span>
                    <FormattedText text={d} />
                  </span>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
}

/**
 * 텍스트 안의 `**굵게**` 마크업을 <strong>으로 렌더 (이력서 핵심 수치 강조용).
 */
function FormattedText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+?\*\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={i} className="font-semibold text-slate-900">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}
