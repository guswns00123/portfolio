"use client";

import { createContext, useContext, useState, useCallback } from "react";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatContextValue {
  isOpen: boolean;
  toggle: () => void;
  messages: Message[];
  addMessage: (msg: Message) => void;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  isLoading: boolean;
  setIsLoading: (v: boolean) => void;
  pageContext: string;
  setPageContext: (ctx: string) => void;
}

const ChatContext = createContext<ChatContextValue | null>(null);

export function useChatContext() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChatContext must be used within ChatProvider");
  return ctx;
}

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pageContext, setPageContext] = useState("");

  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);
  const addMessage = useCallback(
    (msg: Message) => setMessages((prev) => [...prev, msg]),
    []
  );

  return (
    <ChatContext.Provider
      value={{
        isOpen,
        toggle,
        messages,
        addMessage,
        setMessages,
        isLoading,
        setIsLoading,
        pageContext,
        setPageContext,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}
