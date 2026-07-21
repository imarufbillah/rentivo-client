"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChatMessage } from "./ChatMessage";
import { ChatToolCallIndicator } from "./ChatToolCallIndicator";
import { ChatFollowUpSuggestions } from "./ChatFollowUpSuggestions";
import { useSession } from "@/hooks/useAuth";
import { isLLMServiceError } from "@/lib/api/error";
import { authClient } from "@/lib/auth-client";
import { MessageCircle, X, Send } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  toolCalls?: string[];
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const stripToolCalls = (text: string) =>
  text.replace(/<tool_call>[\s\S]*?<\/tool_call>/g, "").trim();

export const ChatWidget = () => {
  const { data: session } = useSession();
  const prefersReducedMotion = useReducedMotion();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatPanelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      // Delay focus to after animation
      const timer = setTimeout(() => inputRef.current?.focus(), prefersReducedMotion ? 0 : 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen, prefersReducedMotion]);

  // Focus trap
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen || !chatPanelRef.current) return;
      if (e.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
        return;
      }
      if (e.key !== "Tab") return;
      const focusable = chatPanelRef.current.querySelectorAll<HTMLElement>(
        'input, button, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    },
    [isOpen]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const sendMessage = async (text: string) => {
    console.log("[CHAT-CLIENT] sendMessage called", { text, isStreaming });
    if (!text.trim() || isStreaming) return;

    const userMessage: Message = {
      role: "user",
      content: text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsStreaming(true);

    try {
      const { data: tokenData } = await authClient.token();
      const token = tokenData?.token;

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: "POST",
        headers,
        credentials: "include",
        body: JSON.stringify({
          message: text,
          conversationHistory: messages.slice(-10).map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) throw new Error("Chat request failed");

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader");

      const decoder = new TextDecoder();
      let assistantContent = "";
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6);
          if (data === "[DONE]") continue;

          try {
            const parsed = JSON.parse(data);

            if (parsed.type === "token") {
              assistantContent += parsed.content;
              const displayContent = stripToolCalls(assistantContent);
              setMessages((prev) => {
                const updated = [...prev];
                const last = updated[updated.length - 1];
                if (last?.role === "assistant") {
                  updated[updated.length - 1] = {
                    ...last,
                    content: displayContent,
                  };
                } else {
                  updated.push({
                    role: "assistant",
                    content: displayContent,
                    timestamp: new Date(),
                  });
                }
                return updated;
              });
            } else if (parsed.type === "tool_call") {
              setActiveTool(parsed.tool);
            } else if (parsed.type === "tool_result") {
              setActiveTool(null);
            } else if (parsed.type === "done") {
              setActiveTool(null);
            }
          } catch {
            // skip malformed chunks
          }
        }
      }

      fetchSuggestions();
    } catch (err) {
      const message = isLLMServiceError(err)
        ? "The AI assistant is temporarily unavailable. Please try again later."
        : "Sorry, something went wrong. Please try again.";
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: message, timestamp: new Date() },
      ]);
    } finally {
      setIsStreaming(false);
      setActiveTool(null);
    }
  };

  const fetchSuggestions = async () => {
    try {
      const { data: tokenData } = await authClient.token();
      const token = tokenData?.token;

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const response = await fetch(`${API_BASE_URL}/api/chat/suggestions`, {
        method: "POST",
        headers,
        credentials: "include",
        body: JSON.stringify({
          conversationHistory: messages.slice(-4).map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSuggestions(data.data?.suggestions || []);
      }
    } catch {
      // ignore suggestion errors
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  if (!session) return null;

  const animationProps = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, scale: 0.9, y: 20 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.9, y: 20 },
        transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] as const },
      };

  return (
    <>
      {/* Desktop: floating panel */}
      <div className="fixed bottom-4 right-4 z-chat hidden lg:block flex flex-col items-end">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={chatPanelRef}
              role="dialog"
              aria-label="Rentivo chat assistant"
              aria-modal="false"
              {...animationProps}
              className="mb-3 flex w-[360px] flex-col overflow-hidden rounded-2xl border bg-card shadow-xl"
            >
              <div className="flex items-center justify-between border-b px-4 py-3">
                <div>
                  <h3 className="font-display text-sm font-bold">
                    Rentivo Assistant
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Ask about properties
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    triggerRef.current?.focus();
                  }}
                  className="rounded-full p-1.5 text-muted-foreground hover:bg-muted"
                  aria-label="Close chat"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div
                className="flex-1 space-y-3 overflow-y-auto p-4"
                style={{ maxHeight: "400px" }}
                role="log"
                aria-label="Chat messages"
                aria-live="polite"
              >
                {messages.length === 0 && (
                  <div className="py-8 text-center text-sm text-muted-foreground">
                    <p>Hi! How can I help you find a property?</p>
                  </div>
                )}

                {messages.map((msg, i) => (
                  <ChatMessage
                    key={i}
                    role={msg.role}
                    content={msg.content}
                    timestamp={msg.timestamp}
                    isStreaming={
                      isStreaming &&
                      i === messages.length - 1 &&
                      msg.role === "assistant"
                    }
                  />
                ))}

                {isStreaming &&
                  !activeTool &&
                  (messages.length === 0 ||
                    messages[messages.length - 1]?.role === "user") && (
                    <div className="flex justify-start" aria-label="Assistant is typing">
                      <div className="max-w-[80%] rounded-2xl rounded-bl-md bg-muted px-4 py-2.5 text-sm">
                        <span className="inline-flex gap-1">
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:0ms]" />
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:150ms]" />
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:300ms]" />
                        </span>
                      </div>
                    </div>
                  )}

                {activeTool && <ChatToolCallIndicator toolName={activeTool} />}

                <div ref={messagesEndRef} />
              </div>

              {suggestions.length > 0 && !isStreaming && (
                <ChatFollowUpSuggestions
                  suggestions={suggestions}
                  onSelect={(s) => {
                    console.log("[CHAT-CLIENT] suggestion selected", { suggestion: s });
                    setSuggestions([]);
                    sendMessage(s);
                  }}
                />
              )}

              <form
                onSubmit={handleSubmit}
                className="flex gap-2 border-t mt-2 p-3"
              >
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                  aria-label="Type a message"
                  className="flex-1 rounded-full border bg-background px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isStreaming}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                  aria-label="Send message"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          ref={triggerRef}
          whileHover={prefersReducedMotion ? undefined : { scale: 1.05 }}
          whileTap={prefersReducedMotion ? undefined : { scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-colors hover:bg-primary/90"
          aria-label={isOpen ? "Close chat" : "Open chat"}
          aria-expanded={isOpen}
        >
          {isOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <MessageCircle className="h-5 w-5" />
          )}
        </motion.button>
      </div>

      {/* Mobile: bottom-sheet panel */}
      <div className="lg:hidden">
        {/* FAB */}
        {!isOpen && (
          <button
            ref={triggerRef}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-20 right-4 z-chat flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg"
            aria-label="Open chat"
          >
            <MessageCircle className="h-5 w-5" />
          </button>
        )}

        {/* Bottom-sheet chat panel */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={chatPanelRef}
              role="dialog"
              aria-label="Rentivo chat assistant"
              aria-modal="true"
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.2}
              onDragEnd={(_e, info) => {
                if (info.offset.y > 100) {
                  setIsOpen(false);
                  triggerRef.current?.focus();
                }
              }}
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: "100%" }}
              animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: "100%" }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="fixed bottom-14 left-0 right-0 z-chat flex max-h-[70dvh] flex-col rounded-t-2xl border bg-background shadow-xl"
              style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
            >
              {/* Drag handle */}
              <div className="flex justify-center pt-2">
                <div className="h-1 w-10 rounded-full bg-muted-foreground/30" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between border-b px-4 py-3">
                <div>
                  <h3 className="font-display text-sm font-bold">
                    Rentivo Assistant
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Ask about properties
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    triggerRef.current?.focus();
                  }}
                  className="rounded-full p-1.5 text-muted-foreground hover:bg-muted"
                  aria-label="Close chat"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Messages */}
              <div
                className="flex-1 space-y-3 overflow-y-auto p-4"
                role="log"
                aria-label="Chat messages"
                aria-live="polite"
              >
                {messages.length === 0 && (
                  <div className="py-8 text-center text-sm text-muted-foreground">
                    <p>Hi! How can I help you find a property?</p>
                  </div>
                )}

                {messages.map((msg, i) => (
                  <ChatMessage
                    key={i}
                    role={msg.role}
                    content={msg.content}
                    timestamp={msg.timestamp}
                    isStreaming={
                      isStreaming &&
                      i === messages.length - 1 &&
                      msg.role === "assistant"
                    }
                  />
                ))}

                {isStreaming &&
                  !activeTool &&
                  (messages.length === 0 ||
                    messages[messages.length - 1]?.role === "user") && (
                    <div className="flex justify-start" aria-label="Assistant is typing">
                      <div className="max-w-[80%] rounded-2xl rounded-bl-md bg-muted px-4 py-2.5 text-sm">
                        <span className="inline-flex gap-1">
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:0ms]" />
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:150ms]" />
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:300ms]" />
                        </span>
                      </div>
                    </div>
                  )}

                {activeTool && <ChatToolCallIndicator toolName={activeTool} />}

                <div ref={messagesEndRef} />
              </div>

              {suggestions.length > 0 && !isStreaming && (
                <ChatFollowUpSuggestions
                  suggestions={suggestions}
                  onSelect={(s) => {
                    console.log("[CHAT-CLIENT] suggestion selected", { suggestion: s });
                    setSuggestions([]);
                    sendMessage(s);
                  }}
                />
              )}

              {/* Input */}
              <form
                onSubmit={handleSubmit}
                className="flex gap-2 border-t p-3"
              >
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                  aria-label="Type a message"
                  className="flex-1 rounded-full border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isStreaming}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                  aria-label="Send message"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};
