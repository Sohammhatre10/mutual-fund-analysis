import { useEffect, useRef } from "react";
import { ChatMessage } from "./ChatMessage";
import type { Message } from "@/lib/api";

interface ChatWindowProps {
  messages: Message[];
  loading?: boolean;
}

export function ChatWindow({ messages, loading }: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
      {messages.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <span className="text-3xl">📊</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">Start a conversation</h3>
          <p className="text-muted-foreground max-w-md">
            Ask me anything about mutual funds, market trends, or investment strategies.
          </p>
        </div>
      )}
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
      {loading && (
        <div className="flex gap-4 animate-fade-in">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <div className="h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          </div>
          <div className="bg-card border border-border rounded-2xl px-4 py-3">
            <div className="flex gap-1">
              <span className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse-soft" />
              <span className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse-soft [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse-soft [animation-delay:0.4s]" />
            </div>
          </div>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
}
