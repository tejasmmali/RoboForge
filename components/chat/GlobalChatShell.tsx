"use client";

import type { ReactNode } from "react";
import { GlobalChatProvider } from "@/components/chat/GlobalChatProvider";
import { ChatLauncher } from "@/components/chat/ChatLauncher";
import { FloatingChat } from "@/components/chat/FloatingChat";

export function GlobalChatShell({ children }: { children: ReactNode }) {
  return (
    <GlobalChatProvider>
      {children}
      <ChatLauncher />
      <FloatingChat />
    </GlobalChatProvider>
  );
}
