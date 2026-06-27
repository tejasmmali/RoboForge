"use client";

import { useState } from "react";
import { ConversationSidebar } from "@/components/chat/ConversationSidebar";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { FeatureModal } from "@/components/chat/FeatureModal";
import { useChat } from "@/hooks/useChat";
import { quickCategories } from "@/lib/chat-data";
import type { AIFeature, QuickCategory } from "@/types/chat";
import type { MessageImage } from "@/types/message";

export function AIAssistantPageContent() {
  const {
    conversations,
    activeConversation,
    activeConversationId,
    isStreaming,
    isLoadingHistory,
    error,
    settings,
    setSettings,
    suggestions,
    newChat,
    selectConversation,
    sendMessage,
    stopGenerating,
    regenerateLastResponse,
    setMessageFeedback,
    toggleBookmark,
    exportChat,
    resetConversation,
    clearChats,
  } = useChat();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeFeature, setActiveFeature] = useState<AIFeature | null>(null);

  const hasMessages = (activeConversation?.messages.length ?? 0) > 0;
  const isEmpty = conversations.length === 0;
  const showWelcome = !isEmpty && !hasMessages && !isStreaming;

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

  return (
    <div className="flex h-full overflow-hidden">
      <ConversationSidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        settings={settings}
        onSettingsChange={setSettings}
        onNewChat={newChat}
        onSelectConversation={selectConversation}
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
      />

      <FeatureModal
        feature={activeFeature}
        onClose={() => setActiveFeature(null)}
      />
    </div>
  );
}
