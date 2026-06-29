import type { ChatError, GeminiMessage } from "@/types/chat";
import type { ChatMessage } from "@/types/message";

export function generateId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isUuid(value: string) {
  return UUID_RE.test(value);
}

export function titleFromMessage(content: string) {
  const trimmed = content.trim();
  return trimmed.length > 40 ? `${trimmed.slice(0, 40)}…` : trimmed;
}

export function toGeminiMessages(messages: ChatMessage[]): GeminiMessage[] {
  return messages
    .filter((m) => m.role === "user" || m.role === "assistant")
    .filter((m) => !m.isError && m.content.trim())
    .map((message) => ({
      role: message.role === "assistant" ? "model" : "user",
      parts: [{ text: message.content }],
    }));
}

export function sanitizeInput(input: string) {
  return input.trim().slice(0, 4000);
}

export function formatErrorContent(error: ChatError) {
  const titles: Record<ChatError["code"], string> = {
    network: "Connection lost",
    rate_limit: "Rate limit reached",
    unauthorized: "Sign in required",
    invalid_key: "Configuration error",
    server: "Server error",
    empty: "Empty response",
    unknown: "Something went wrong",
  };

  return `**${titles[error.code]}**\n\n${error.message}\n\nTry again or check your connection.`;
}
