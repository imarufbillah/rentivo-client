"use client";

import { cn } from "@/lib/utils";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
  isStreaming?: boolean;
}

export const ChatMessage = ({
  role,
  content,
  timestamp,
  isStreaming,
}: ChatMessageProps) => (
  <div
    className={cn(
      "flex w-full",
      role === "user" ? "justify-end" : "justify-start"
    )}
  >
    <div
      className={cn(
        "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm",
        role === "user"
          ? "bg-primary text-primary-foreground rounded-br-md"
          : "bg-muted text-foreground rounded-bl-md"
      )}
    >
      <p className="whitespace-pre-wrap break-words">{content}</p>
      {isStreaming && (
        <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-current align-middle" />
      )}
      {timestamp && (
        <p
          className={cn(
            "mt-1 text-[10px]",
            role === "user"
              ? "text-primary-foreground/70"
              : "text-muted-foreground"
          )}
        >
          {timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      )}
    </div>
  </div>
);
