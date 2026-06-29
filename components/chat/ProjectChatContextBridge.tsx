"use client";

import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useGlobalChat } from "@/components/chat/GlobalChatProvider";
import {
  getUserMemoryContext,
  upsertUserMemoryContext,
} from "@/lib/db/chat";
import type { ProjectChatContext } from "@/types/project";

type ProjectChatContextBridgeProps = {
  context: ProjectChatContext;
};

export function ProjectChatContextBridge({
  context,
}: ProjectChatContextBridgeProps) {
  const { setProjectContext } = useGlobalChat();
  const { user } = useAuth();

  useEffect(() => {
    setProjectContext(context);
    return () => setProjectContext(null);
  }, [context, setProjectContext]);

  useEffect(() => {
    if (!user?.id || !context.projectName) return;

    void getUserMemoryContext(user.id)
      .then((memory) => {
        const recent = [
          context.projectName!,
          ...memory.recentProjects.filter((p) => p !== context.projectName),
        ].slice(0, 5);

        return upsertUserMemoryContext(user.id, { recentProjects: recent });
      })
      .catch(() => undefined);
  }, [user?.id, context.projectName]);

  return null;
}
