"use client";

export { useGlobalChat } from "@/components/chat/GlobalChatProvider";
import { useGlobalChat } from "@/components/chat/GlobalChatProvider";

/** Shared global assistant — same state as floating chat and /ai-assistant */
export function useChat() {
  return useGlobalChat();
}
