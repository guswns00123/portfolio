import fs from "fs";
import path from "path";

export type Personal = {
  nameKo: string;
  nameEn: string;
  title: string;
  photo: string;
  email: string;
  phone: string;
  birthdate: string;
  military: string;
};

export type SummarySection = {
  headline: string;
  body: string;
};

export type ExperienceBlock = {
  title: string;
  details: string[];
};

export type Experience = {
  company: string;
  role: string;
  employmentType?: string;
  period: string;
  duration?: string;
  responsibilities: ExperienceBlock[];
  projects: ExperienceBlock[];
};

export type ProjectHighlight =
  | string
  | { title: string; details: string[] };

export type Project = {
  name: string;
  team?: string;
  period: string;
  techStack?: string;
  highlights: ProjectHighlight[];
  link?: string;
  portfolioLink?: string;
};

export type SkillGroup = {
  category: string;
  items: string[];
};

export type Education = {
  school: string;
  degree: string;
  period: string;
  details?: string;
};

export type Certification = {
  date: string;
  name: string;
  issuer: string;
};

export type Language = {
  language: string;
  level: string;
};

export type ResumeLink = {
  label: string;
  url: string;
};

export type Resume = {
  personal: Personal;
  coreCompetencies: string[];
  summary: SummarySection[];
  experiences: Experience[];
  projects: Project[];
  skills: SkillGroup[];
  education: Education[];
  certifications: Certification[];
  languages: Language[];
  links: ResumeLink[];
};

const resumeFilePath = path.join(process.cwd(), "content", "resume", "resume.json");

export function getResume(): Resume {
  const raw = fs.readFileSync(resumeFilePath, "utf-8");
  return JSON.parse(raw) as Resume;
}

export function saveResume(resume: Resume): void {
  const json = JSON.stringify(resume, null, 2);
  fs.writeFileSync(resumeFilePath, json + "\n", "utf-8");
}
