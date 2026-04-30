"use client";

import { useCallback, useEffect, useRef } from "react";
import { useChatContext, type Message } from "./ChatProvider";
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export default function ChatPanel() {
  const {
    isOpen,
    messages,
    addMessage,
    setMessages,
    isLoading,
    setIsLoading,
    pageContext,
  } = useChatContext();
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
      addMessage(userMsg);
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
            pageContext,
          }),
        });

        if (!res.ok) {
          throw new Error(`API error: ${res.status}`);
        }

        const reader = res.body?.getReader();
        if (!reader) throw new Error("No response body");

        const decoder = new TextDecoder();
        let accumulated = "";

        // Add empty assistant message first
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
                // skip non-JSON lines
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
                  role: "assistant" as const,
                  content: `오류: ${errorContent}`,
                },
              ]
        );
      } finally {
        setIsLoading(false);
      }
    },
    [messages, addMessage, setMessages, setIsLoading, pageContext]
  );

  return (
    <div
      className={cn(
        "fixed top-0 right-0 z-40 flex h-full w-full flex-col border-l bg-background shadow-xl transition-transform duration-300 sm:w-[400px] print:hidden",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}
    >
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h2 className="text-sm font-semibold">AI 어시스턴트</h2>
        <span className="text-xs text-muted-foreground">작성 보조</span>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="flex flex-col gap-3">
          {messages.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-8">
              글 작성, 공부 정리, 기술 질문 등<br />
              무엇이든 물어보세요.
            </p>
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
      </ScrollArea>

      <div className="border-t p-4">
        <ChatInput onSend={handleSend} disabled={isLoading} />
      </div>
    </div>
  );
}
