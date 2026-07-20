"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
  isStreaming?: boolean;
}

const parseContent = (text: string) => {
  // Split on markdown links: [label](url)
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, i) => {
    const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (match) {
      const [, label, href] = match;
      const isPropertyLink = href.startsWith("/properties/");
      if (isPropertyLink) {
        return (
          <Link
            key={i}
            href={href}
            className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/5 px-2.5 py-0.5 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
          >
            {label}
            <ExternalLink className="h-3 w-3" />
          </Link>
        );
      }
      return (
        <a
          key={i}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-primary underline underline-offset-2 hover:text-primary/80"
        >
          {label}
          <ExternalLink className="h-3 w-3" />
        </a>
      );
    }
    return <span key={i}>{part}</span>;
  });
};

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
      <div className="whitespace-pre-wrap break-words">
        {parseContent(content)}
      </div>
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
