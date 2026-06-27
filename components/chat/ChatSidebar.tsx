"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Bot,
  BookOpen,
  Cpu,
  FileText,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Settings,
  Trash2,
  X,
} from "lucide-react";
import { ConversationItem } from "@/components/chat/ConversationItem";
import { pinnedResources, quickCategories } from "@/lib/chat-data";
import type { Conversation, QuickCategory } from "@/types/chat";
import { cn } from "@/lib/utils";

type ChatSidebarProps = {
  conversations: Conversation[];
  activeConversationId: string | null;
  onNewChat: () => void;
  onSelectConversation: (id: string) => void;
  onClearChats: () => void;
  onCategorySelect: (category: QuickCategory) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  isOpen?: boolean;
  onClose?: () => void;
};

function SidebarContent({
  conversations,
  activeConversationId,
  onNewChat,
  onSelectConversation,
  onClearChats,
  onCategorySelect,
  onClose,
  collapsed,
  onToggleCollapse,
}: Omit<ChatSidebarProps, "isOpen">) {
  return (
    <aside className="flex h-full flex-col bg-surface/95 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-2 border-b border-border p-3">
        {!collapsed && (
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] border border-border bg-background">
              <Bot className="h-4 w-4" strokeWidth={1.75} />
            </span>
            <div className="min-w-0">
              <p className="truncate font-heading text-[13px] font-medium">
                RoboForge AI
              </p>
              <p className="truncate text-[10px] text-muted-foreground">
                Robotics Expert
              </p>
            </div>
          </div>
        )}
        <div className="flex items-center gap-1">
          {onToggleCollapse && (
            <button
              type="button"
              onClick={onToggleCollapse}
              className="hidden h-8 w-8 items-center justify-center rounded-[10px] text-muted transition-colors hover:bg-background hover:text-foreground lg:flex"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <PanelLeftOpen className="h-4 w-4" strokeWidth={1.75} />
              ) : (
                <PanelLeftClose className="h-4 w-4" strokeWidth={1.75} />
              )}
            </button>
          )}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-[10px] text-muted transition-colors hover:bg-background lg:hidden"
              aria-label="Close sidebar"
            >
              <X className="h-4 w-4" strokeWidth={1.75} />
            </button>
          )}
        </div>
      </div>

      <div className="p-3">
        <motion.button
          type="button"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={onNewChat}
          className={cn(
            "flex w-full items-center justify-center gap-2 rounded-[12px] border border-border bg-background py-2.5 text-[13px] font-medium transition-colors hover:bg-surface",
            collapsed && "px-0",
          )}
          title="New Chat"
        >
          <Plus className="h-4 w-4 shrink-0" strokeWidth={1.75} />
          {!collapsed && "New Chat"}
        </motion.button>
      </div>

      {!collapsed && (
        <>
          <div className="flex-1 overflow-y-auto px-2 pb-2">
            <p className="px-2 py-2 font-heading text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Recent Chats
            </p>
            <div className="space-y-0.5">
              {conversations.length > 0 ? (
                conversations.map((conv) => (
                  <ConversationItem
                    key={conv.id}
                    conversation={conv}
                    isActive={conv.id === activeConversationId}
                    onClick={() => {
                      onSelectConversation(conv.id);
                      onClose?.();
                    }}
                  />
                ))
              ) : (
                <p className="px-3 py-4 text-[12px] text-muted-foreground">
                  No conversations yet
                </p>
              )}
            </div>

            <p className="mt-4 px-2 py-2 font-heading text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Categories
            </p>
            <div className="flex flex-wrap gap-1.5 px-1">
              {quickCategories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    onCategorySelect(cat.id);
                    onClose?.();
                  }}
                  className="rounded-full border border-border bg-background/80 px-2.5 py-1 text-[10px] font-medium text-muted transition-colors hover:border-border-strong hover:text-foreground"
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <p className="mt-4 px-2 py-2 font-heading text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Resources
            </p>
            <ul className="space-y-0.5 px-1" role="list">
              {pinnedResources.map((resource) => (
                <li key={resource.id}>
                  <a
                    href={resource.href}
                    className="flex items-center gap-2 rounded-[10px] px-2 py-2 text-[12px] text-muted transition-colors hover:bg-background hover:text-foreground"
                  >
                    {resource.id === "circuits" ? (
                      <Cpu className="h-3.5 w-3.5" strokeWidth={1.75} />
                    ) : resource.id === "guides" ? (
                      <BookOpen className="h-3.5 w-3.5" strokeWidth={1.75} />
                    ) : (
                      <FileText className="h-3.5 w-3.5" strokeWidth={1.75} />
                    )}
                    {resource.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-border p-2">
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-[10px] px-2 py-2 text-[12px] text-muted transition-colors hover:bg-background hover:text-foreground"
            >
              <Settings className="h-3.5 w-3.5" strokeWidth={1.75} />
              Settings
            </button>
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-[10px] px-2 py-2 text-[12px] text-muted transition-colors hover:bg-background hover:text-foreground"
            >
              <Moon className="h-3.5 w-3.5" strokeWidth={1.75} />
              Theme
            </button>
            <button
              type="button"
              onClick={onClearChats}
              className="flex w-full items-center gap-2 rounded-[10px] px-2 py-2 text-[12px] text-muted transition-colors hover:bg-background hover:text-foreground"
            >
              <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
              Clear Chats
            </button>
          </div>
        </>
      )}
    </aside>
  );
}

export function ChatSidebar(props: ChatSidebarProps) {
  const { isOpen, onClose, collapsed = false } = props;

  return (
    <>
      {/* Desktop */}
      <motion.div
        initial={false}
        animate={{ width: collapsed ? 64 : 280 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="hidden h-full shrink-0 overflow-hidden border-r border-border lg:block"
      >
        <SidebarContent {...props} />
      </motion.div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-40 bg-foreground/25 backdrop-blur-[2px] lg:hidden"
              onClick={onClose}
              aria-hidden="true"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-y-0 left-0 z-50 w-[min(300px,88vw)] border-r border-border shadow-elevated lg:hidden"
              style={{ top: "var(--nav-height)" }}
            >
              <SidebarContent {...props} onClose={onClose} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
