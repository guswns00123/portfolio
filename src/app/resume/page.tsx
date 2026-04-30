import { getResume } from "@/lib/resume";
import ResumeView from "@/components/resume/ResumeView";

export const metadata = {
  title: "이력서 — 유현준 | Data Engineer",
  description: "유현준 데이터 엔지니어 이력서",
};

export default function ResumePage() {
  const resume = getResume();
  return <ResumeView initial={resume} />;
}
