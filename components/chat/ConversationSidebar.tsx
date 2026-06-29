"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, RotateCcw, Trash2 } from "lucide-react";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { ConversationSearch } from "@/components/chat/ConversationSearch";
import type { ChatSettings, QuickCategory } from "@/types/chat";
import type { Conversation } from "@/types/message";

type ConversationSidebarProps = {
  conversations: Conversation[];
  activeConversationId: string | null;
  settings: ChatSettings;
  onSettingsChange: (settings: ChatSettings) => void;
  onNewChat: () => void;
  onSelectConversation: (id: string) => void;
  onClearChats: () => void;
  onDeleteConversation?: (id: string) => void;
  onExportChat?: () => void;
  onResetConversation?: () => void;
  onCategorySelect: (category: QuickCategory) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  isOpen?: boolean;
  onClose?: () => void;
};

function SettingsPanel({
  settings,
  onChange,
  onExport,
  onReset,
  onClear,
}: {
  settings: ChatSettings;
  onChange: (settings: ChatSettings) => void;
  onExport?: () => void;
  onReset?: () => void;
  onClear?: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-t border-border p-2">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-[10px] px-2 py-2 text-[12px] text-muted transition-colors hover:bg-background hover:text-foreground"
      >
        Chat settings
        <span className="text-[10px] text-muted-foreground">{open ? "−" : "+"}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden px-2 pb-2"
          >
            <label className="mt-2 block text-[11px] text-muted-foreground">
              Temperature — {settings.temperature.toFixed(1)}
              <input
                type="range"
                min={0}
                max={1}
                step={0.1}
                value={settings.temperature}
                onChange={(e) =>
                  onChange({
                    ...settings,
                    temperature: Number(e.target.value),
                  })
                }
                className="mt-1 w-full accent-accent"
              />
            </label>

            <p className="mt-3 text-[11px] text-muted-foreground">Response length</p>
            <div className="mt-1 flex gap-1">
              {(["concise", "balanced", "detailed"] as const).map((length) => (
                <button
                  key={length}
                  type="button"
                  onClick={() => onChange({ ...settings, responseLength: length })}
                  className={`flex-1 rounded-[8px] border px-1 py-1.5 text-[10px] capitalize transition-colors ${
                    settings.responseLength === length
                      ? "border-foreground bg-foreground text-background"
                      : "border-border text-muted hover:text-foreground"
                  }`}
                >
                  {length}
                </button>
              ))}
            </div>

            <div className="mt-3 space-y-1">
              {onExport ? (
                <button
                  type="button"
                  onClick={onExport}
                  className="flex w-full items-center gap-2 rounded-[8px] px-2 py-1.5 text-[11px] text-muted hover:bg-background hover:text-foreground"
                >
                  <Download className="h-3 w-3" strokeWidth={1.75} />
                  Export chat
                </button>
              ) : null}
              {onReset ? (
                <button
                  type="button"
                  onClick={onReset}
                  className="flex w-full items-center gap-2 rounded-[8px] px-2 py-1.5 text-[11px] text-muted hover:bg-background hover:text-foreground"
                >
                  <RotateCcw className="h-3 w-3" strokeWidth={1.75} />
                  Reset conversation
                </button>
              ) : null}
              {onClear ? (
                <button
                  type="button"
                  onClick={onClear}
                  className="flex w-full items-center gap-2 rounded-[8px] px-2 py-1.5 text-[11px] text-muted hover:bg-background hover:text-foreground"
                >
                  <Trash2 className="h-3 w-3" strokeWidth={1.75} />
                  Clear all chats
                </button>
              ) : null}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ConversationSidebar({
  settings,
  onSettingsChange,
  onExportChat,
  onResetConversation,
  onClearChats,
  onDeleteConversation,
  ...sidebarProps
}: ConversationSidebarProps) {
  return (
    <div className="relative flex h-full flex-col">
      {!sidebarProps.collapsed && (
        <div className="hidden border-b border-border p-3 lg:block">
          <ConversationSearch />
        </div>
      )}
      <div className="min-h-0 flex-1">
        <ChatSidebar
          {...sidebarProps}
          onClearChats={onClearChats}
          onDeleteConversation={onDeleteConversation}
        />
      </div>
      {!sidebarProps.collapsed && (
        <SettingsPanel
          settings={settings}
          onChange={onSettingsChange}
          onExport={onExportChat}
          onReset={onResetConversation}
          onClear={onClearChats}
        />
      )}
    </div>
  );
}
