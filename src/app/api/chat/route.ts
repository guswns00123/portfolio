import { Ollama } from "ollama";
import { getFullContext } from "@/lib/context";

const ollama = new Ollama({
  host: process.env.OLLAMA_BASE_URL ?? "http://localhost:11434",
});

const MODEL = process.env.OLLAMA_MODEL ?? "gemma3:4b";

function buildSystemPrompt(): string {
  const context = getFullContext();

  return `당신은 데이터 엔지니어 유현준(Yoo Hyun Jun)의 포트폴리오 사이트에 있는 AI 어시스턴트입니다.
방문자(채용 담당자, 동료 개발자 등)가 유현준에 대해 궁금한 점을 물어보면 아래 정보를 바탕으로 답변합니다.

역할:
- 유현준의 경력, 프로젝트, 기술 스택, 성격, 지향점 등에 대해 정확하게 답변합니다
- 아래 제공된 정보에 없는 내용은 추측하지 않고 "해당 정보는 아직 등록되지 않았습니다"라고 답합니다
- 블로그 글 관련 질문이 오면 블로그 컨텍스트를 참고하여 답변합니다
- 한국어로 응답하되, 기술 용어는 영어 원문을 병기합니다

스타일:
- 친근하지만 프로페셔널한 톤
- 간결하고 명확하게
- 마크다운 형식으로 응답

${context}`;
}

export async function POST(request: Request) {
  try {
    const { messages, pageContext } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return Response.json({ error: "messages is required" }, { status: 400 });
    }

    let systemPrompt = buildSystemPrompt();
    if (pageContext) {
      systemPrompt += `\n\n현재 사용자가 보고 있는 페이지 컨텍스트:\n${pageContext}`;
    }

    const ollamaMessages = [
      { role: "system", content: systemPrompt },
      ...messages.map((m: { role: string; content: string }) => ({
        role: m.role,
        content: m.content,
      })),
    ];

    const totalChars = ollamaMessages.reduce((sum, m) => sum + m.content.length, 0);
    console.log(
      `[/api/chat] messages=${ollamaMessages.length}, totalChars=${totalChars} (~${Math.ceil(totalChars / 3)} tokens est.)`
    );

    const stream = await ollama.chat({
      model: MODEL,
      messages: ollamaMessages,
      stream: true,
      options: {
        num_ctx: 12288,
        temperature: 0.3,
      },
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const part of stream) {
            const text = part.message?.content;
            if (text) {
              const data = `data: ${JSON.stringify({ content: text })}\n\n`;
              controller.enqueue(encoder.encode(data));
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (err) {
          const message =
            err instanceof Error ? err.message : "Stream error";
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ error: message })}\n\n`
            )
          );
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    console.error("[/api/chat] error:", err);
    const message = err instanceof Error ? err.message : "Internal error";
    return Response.json({ error: message }, { status: 500 });
  }
}
