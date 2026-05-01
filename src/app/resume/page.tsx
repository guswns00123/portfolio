import { getResume, getResumeEn } from "@/lib/resume";
import ResumeView from "@/components/resume/ResumeView";

export const metadata = {
  title: "이력서 — 유현준 | Data Engineer",
  description: "유현준 데이터 엔지니어 이력서",
};

export default function ResumePage() {
  const resumeKo = getResume();
  const resumeEn = getResumeEn();
  return <ResumeView initialKo={resumeKo} initialEn={resumeEn} />;
}
