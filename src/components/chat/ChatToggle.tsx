"use client";

import { useChatContext } from "./ChatProvider";
import { Button } from "@/components/ui/button";
import { MessageCircle, X } from "lucide-react";

export default function ChatToggle() {
  const { isOpen, toggle } = useChatContext();

  return (
    <Button
      onClick={toggle}
      size="icon"
      className="fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full shadow-lg print:hidden"
    >
      {isOpen ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
    </Button>
  );
}
