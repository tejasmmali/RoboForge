"use client";

import { Download, Loader2 } from "lucide-react";
import { SettingsCard } from "@/components/settings/SettingsCard";
import { useAuth } from "@/hooks/useAuth";
import { useSavedProjects, useSavedComponents } from "@/hooks/useBookmarks";
import { useProgressList } from "@/hooks/useProgress";
import { listConversations, loadConversationMessages } from "@/lib/db/chat";
import {
  downloadTextFile,
  exportConversationAsMarkdown,
} from "@/services/chatService";
import { useState } from "react";

type DataExportProps = {
  onSuccess: (message: string) => void;
};

export function DataExport({ onSuccess }: DataExportProps) {
  const { user, profile } = useAuth();
  const savedProjects = useSavedProjects();
  const savedComponents = useSavedComponents();
  const progress = useProgressList();
  const [loading, setLoading] = useState<string | null>(null);

  const exportJson = (filename: string, data: unknown) => {
    downloadTextFile(filename, JSON.stringify(data, null, 2));
    onSuccess(`${filename} downloaded.`);
  };

  const actions = [
    {
      id: "profile",
      label: "Export profile",
      run: async () => {
        exportJson("roboforge-profile.json", profile);
      },
    },
    {
      id: "chats",
      label: "Export AI chats",
      run: async () => {
        if (!user) return;
        const convs = await listConversations(user.id, { pageSize: 50 });
        for (const conv of convs) {
          const messages = await loadConversationMessages(conv.id, user.id);
          const md = exportConversationAsMarkdown(conv.title, messages);
          downloadTextFile(`${conv.title.replace(/\s+/g, "-").toLowerCase()}.md`, md);
        }
        onSuccess("AI chats exported.");
      },
    },
    {
      id: "projects",
      label: "Export saved projects",
      run: async () => {
        exportJson("roboforge-saved-projects.json", savedProjects.data ?? []);
      },
    },
    {
      id: "progress",
      label: "Export progress",
      run: async () => {
        exportJson("roboforge-progress.json", progress.data ?? []);
      },
    },
    {
      id: "components",
      label: "Export components",
      run: async () => {
        exportJson("roboforge-components.json", savedComponents.data ?? []);
      },
    },
  ];

  return (
    <div className="space-y-6">
      <SettingsCard
        title="Data & export"
        description="Download a copy of your RoboForge data."
      >
        <div className="grid gap-2 sm:grid-cols-2">
          {actions.map((action) => (
            <button
              key={action.id}
              type="button"
              disabled={Boolean(loading)}
              onClick={async () => {
                setLoading(action.id);
                try {
                  await action.run();
                } finally {
                  setLoading(null);
                }
              }}
              className="flex items-center justify-between rounded-[12px] border border-border bg-background px-4 py-3 text-left text-[13px] font-medium text-muted transition-colors hover:border-border-strong hover:text-foreground"
            >
              {action.label}
              {loading === action.id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" strokeWidth={1.75} />
              )}
            </button>
          ))}
        </div>
      </SettingsCard>

      <SettingsCard title="Full archive">
        <p className="text-[13px] text-muted">
          Download a ZIP containing all your RoboForge data. This feature is being prepared.
        </p>
        <button
          type="button"
          disabled
          className="mt-4 rounded-[10px] border border-border px-4 py-2 text-[13px] font-medium text-muted opacity-60"
        >
          Download ZIP (coming soon)
        </button>
      </SettingsCard>
    </div>
  );
}
