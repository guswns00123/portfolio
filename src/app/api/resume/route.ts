import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getResume, saveResume, Resume } from "@/lib/resume";
import { revalidatePath } from "next/cache";

export async function GET() {
  try {
    const resume = getResume();
    return NextResponse.json(resume);
  } catch {
    return NextResponse.json({ error: "Failed to read resume" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as Resume;

  if (!body || !body.personal || !Array.isArray(body.experiences)) {
    return NextResponse.json({ error: "Invalid resume payload" }, { status: 400 });
  }

  saveResume(body);
  revalidatePath("/resume");

  return NextResponse.json({ ok: true });
}
