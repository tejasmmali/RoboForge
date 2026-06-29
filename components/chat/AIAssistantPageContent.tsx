"use client";

import { Suspense, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ConversationSidebar } from "@/components/chat/ConversationSidebar";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { AIAssistantPageSkeleton } from "@/components/chat/LoadingSkeleton";
import { PromptLibrary } from "@/components/chat/PromptLibrary";
import { ToolPanel } from "@/components/chat/ToolPanel";
import { useGlobalChat } from "@/components/chat/GlobalChatProvider";
import { useAuth } from "@/hooks/useAuth";
import { quickCategories } from "@/lib/chat-data";
import type { QuickCategory } from "@/types/chat";
import type { MessageImage } from "@/types/message";

function AIAssistantPageInner() {
  const { loading: authLoading } = useAuth();
  const {
    conversations,
    filteredConversations,
    activeConversation,
    activeConversationId,
    isStreaming,
    isLoadingHistory,
    isLoadingConversation,
    error,
    settings,
    setSettings,
    suggestions,
    assistantMode,
    newChat,
    selectConversation,
    deleteChat,
    sendMessage,
    insertPrompt,
    stopGenerating,
    regenerateLastResponse,
    setMessageFeedback,
    toggleBookmark,
    exportChat,
    resetConversation,
    clearChats,
    quotaHint,
  } = useGlobalChat();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const hasMessages = (activeConversation?.messages.length ?? 0) > 0;
  const isEmpty = conversations.length === 0;
  const showWelcome = !isEmpty && !hasMessages && !isStreaming && !isLoadingConversation;
  const showPageSkeleton = authLoading || isLoadingHistory;

  const handleSend = (text: string, images?: MessageImage[]) => {
    void sendMessage(text, {
      category: activeConversation?.category as QuickCategory | undefined,
      images,
    });
    setSidebarOpen(false);
  };

  const handleCategorySelect = (category: QuickCategory) => {
    const cat = quickCategories.find((c) => c.id === category);
    if (cat) {
      handleSend(`Help me with ${cat.label} robotics topics.`);
    }
  };

  if (showPageSkeleton) {
    return (
      <AnimatePresence mode="wait">
        <AIAssistantPageSkeleton key="page-skeleton" />
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="page-content"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="flex h-full overflow-hidden"
      >
      <ConversationSidebar
        conversations={filteredConversations}
        activeConversationId={activeConversationId}
        settings={settings}
        onSettingsChange={setSettings}
        onNewChat={newChat}
        onSelectConversation={selectConversation}
        onDeleteConversation={deleteChat}
        onClearChats={clearChats}
        onExportChat={exportChat}
        onResetConversation={resetConversation}
        onCategorySelect={handleCategorySelect}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((c) => !c)}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <ChatWindow
        conversations={conversations}
        activeConversation={activeConversation}
        messages={activeConversation?.messages ?? []}
        isStreaming={isStreaming}
        isLoadingHistory={isLoadingHistory}
        isLoadingConversation={isLoadingConversation}
        error={error}
        settings={settings}
        suggestions={suggestions}
        onSend={handleSend}
        onStop={stopGenerating}
        onRegenerate={regenerateLastResponse}
        onFeedback={setMessageFeedback}
        onBookmark={toggleBookmark}
        onNewChat={newChat}
        onOpenSidebar={() => setSidebarOpen(true)}
        showWelcome={showWelcome}
        isEmpty={isEmpty}
        subtitle={assistantMode}
        quotaHint={quotaHint}
      />

      <PromptLibrary onInsert={insertPrompt} />
      <ToolPanel onRunTool={insertPrompt} />
      </motion.div>
    </AnimatePresence>
  );
}

export function AIAssistantPageContent() {
  return (
    <Suspense fallback={<AIAssistantPageSkeleton />}>
      <AIAssistantPageInner />
    </Suspense>
  );
}
