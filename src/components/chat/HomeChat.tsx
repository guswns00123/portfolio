"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";
import { type Message } from "./ChatProvider";
import { Bot } from "lucide-react";

const SUGGESTIONS = [
  "유현준은 어떤 프로젝트를 했나요?",
  "기술 스택이 궁금해요",
  "데이터 엔지니어가 된 계기는?",
  "어떤 방식으로 일하나요?",
];

export default function HomeChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = useCallback(
    async (content: string) => {
      const userMsg: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content,
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);

      const assistantId = crypto.randomUUID();

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [...messages, userMsg].map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
        });

        if (!res.ok) throw new Error(`API error: ${res.status}`);

        const reader = res.body?.getReader();
        if (!reader) throw new Error("No response body");

        const decoder = new TextDecoder();
        let accumulated = "";

        setMessages((prev) => [
          ...prev,
          { id: assistantId, role: "assistant", content: "" },
        ]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") continue;
              try {
                const parsed = JSON.parse(data);
                if (parsed.content) {
                  accumulated += parsed.content;
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === assistantId
                        ? { ...m, content: accumulated }
                        : m
                    )
                  );
                }
              } catch {
                // skip
              }
            }
          }
        }
      } catch (err) {
        const errorContent =
          err instanceof Error ? err.message : "오류가 발생했습니다.";
        setMessages((prev) =>
          prev.some((m) => m.id === assistantId)
            ? prev.map((m) =>
                m.id === assistantId
                  ? { ...m, content: `오류: ${errorContent}` }
                  : m
              )
            : [
                ...prev,
                {
                  id: assistantId,
                  role: "assistant",
                  content: `오류: ${errorContent}`,
                },
              ]
        );
      } finally {
        setIsLoading(false);
      }
    },
    [messages]
  );

  return (
    <div className="flex flex-col h-full">
      {/* 채팅 영역 */}
      <div className="flex-1 overflow-y-auto px-2 py-4">
        <div className="flex flex-col gap-3 max-w-3xl mx-auto">
          {messages.length === 0 && (
            <div className="flex flex-col items-center gap-6 py-12">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                <Bot className="h-7 w-7 text-primary" />
              </div>
              <div className="text-center">
                <h2 className="text-lg font-semibold">
                  유현준에 대해 궁금한 점을 물어보세요
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  경력, 프로젝트, 기술 스택, 지향점 등 무엇이든 답변해드립니다
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2 max-w-lg">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSend(s)}
                    className="rounded-full border px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
            <div className="flex justify-start">
              <div className="rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
                생각 중...
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* 입력 영역 */}
      <div className="border-t bg-background px-4 py-3">
        <div className="max-w-3xl mx-auto">
          <ChatInput onSend={handleSend} disabled={isLoading} />
        </div>
      </div>
    </div>
  );
}
