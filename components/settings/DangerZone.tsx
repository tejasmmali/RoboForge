"use client";

import { useState } from "react";
import { SettingsCard } from "@/components/settings/SettingsCard";
import { ConfirmationModal } from "@/components/settings/ConfirmationModal";
import { useAuth } from "@/hooks/useAuth";
import { deleteUserAiHistory } from "@/lib/db/settings";
import { getBrowserDb } from "@/lib/db/client";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/db/query-keys";

type DangerZoneProps = {
  onSuccess: (message: string) => void;
};

type ConfirmAction =
  | "ai"
  | "projects"
  | "bookmarks"
  | "progress"
  | "account"
  | null;

export function DangerZone({ onSuccess }: DangerZoneProps) {
  const { user, signOut } = useAuth();
  const queryClient = useQueryClient();
  const [confirm, setConfirm] = useState<ConfirmAction>(null);
  const [loading, setLoading] = useState(false);

  const actions: {
    id: ConfirmAction;
    label: string;
    description: string;
  }[] = [
    { id: "ai", label: "Delete AI conversations", description: "Remove all chat history." },
    { id: "projects", label: "Delete saved projects", description: "Clear your project bookmarks." },
    { id: "bookmarks", label: "Delete bookmarks", description: "Remove saved components." },
    { id: "progress", label: "Reset progress", description: "Reset all project progress." },
    { id: "account", label: "Delete account", description: "Permanently delete your account." },
  ];

  const runAction = async (action: ConfirmAction) => {
    if (!user || !action) return;
    setLoading(true);
    const supabase = getBrowserDb();

    try {
      switch (action) {
        case "ai":
          await deleteUserAiHistory(user.id);
          break;
        case "projects":
          await supabase.from("saved_projects").delete().eq("user_id", user.id);
          break;
        case "bookmarks":
          await supabase.from("saved_components").delete().eq("user_id", user.id);
          break;
        case "progress":
          await supabase.from("project_progress").delete().eq("user_id", user.id);
          break;
        case "account":
          await signOut();
          onSuccess("Signed out. Contact support to fully delete your account.");
          setConfirm(null);
          return;
      }

      void queryClient.invalidateQueries({ queryKey: queryKeys.bookmarks.projects(user.id) });
      void queryClient.invalidateQueries({ queryKey: queryKeys.progress.all(user.id) });
      void queryClient.invalidateQueries({ queryKey: queryKeys.chat.conversations(user.id) });
      onSuccess("Action completed.");
      setConfirm(null);
    } finally {
      setLoading(false);
    }
  };

  const active = actions.find((a) => a.id === confirm);

  return (
    <>
      <SettingsCard
        title="Danger zone"
        description="Irreversible actions. Proceed with caution."
        className="border-red-200/80"
      >
        <div className="space-y-3">
          {actions.map((action) => (
            <div
              key={action.id}
              className="flex flex-col gap-3 rounded-[12px] border border-red-100 bg-red-50/40 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-[13px] font-medium text-red-900">{action.label}</p>
                <p className="mt-0.5 text-[12px] text-red-700/80">{action.description}</p>
              </div>
              <button
                type="button"
                onClick={() => setConfirm(action.id)}
                className="shrink-0 rounded-[10px] border border-red-600 px-3 py-1.5 text-[12px] font-medium text-red-700 hover:bg-red-600 hover:text-white"
              >
                {action.id === "account" ? "Delete account" : "Delete"}
              </button>
            </div>
          ))}
        </div>
      </SettingsCard>

      <ConfirmationModal
        open={Boolean(confirm && active)}
        title={active?.label ?? "Confirm"}
        description={active?.description ?? "This action cannot be undone."}
        confirmLabel={confirm === "account" ? "Delete account" : "Confirm delete"}
        destructive
        loading={loading}
        onCancel={() => setConfirm(null)}
        onConfirm={() => void runAction(confirm)}
      />
    </>
  );
}
