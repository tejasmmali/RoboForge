"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteConversation } from "@/lib/db/chat";
import { queryKeys } from "@/lib/db/query-keys";
import { useAuth } from "@/hooks/useAuth";

export function useDeleteChatConversation() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (conversationId: string) => {
      if (!user) throw new Error("Sign in required");
      return deleteConversation(conversationId, user.id);
    },
    onMutate: async (conversationId) => {
      if (!user) return;
      const key = queryKeys.chat.conversations(user.id);
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<Awaited<ReturnType<typeof import("@/lib/db/chat").listConversations>>>(key);
      queryClient.setQueryData(
        key,
        (old: typeof previous) => old?.filter((c) => c.id !== conversationId) ?? [],
      );
      return { previous, key };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(context.key, context.previous);
      }
    },
    onSettled: () => {
      if (user) {
        void queryClient.invalidateQueries({
          queryKey: queryKeys.chat.conversations(user.id),
        });
      }
    },
  });
}
