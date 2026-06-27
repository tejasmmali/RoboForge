export type MessageRole = "user" | "assistant" | "system";
export type MessageFeedback = "like" | "dislike" | null;

export type MessageImage = {
  id: string;
  url: string;
  name: string;
  mimeType: string;
  previewDataUrl?: string;
};

export type ChatMessage = {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: string;
  images?: MessageImage[];
  isStreaming?: boolean;
  isError?: boolean;
  bookmarked?: boolean;
  feedback?: MessageFeedback;
};

export type Conversation = {
  id: string;
  title: string;
  preview: string;
  updatedAt: string;
  createdAt?: string;
  pinned?: boolean;
  archived?: boolean;
  category?: string;
  projectSlug?: string;
  messages: ChatMessage[];
  userId?: string;
};

export type ConversationUpdateInput = {
  title?: string;
  pinned?: boolean;
  archived?: boolean;
};

export type CreateMessageInput = {
  conversationId: string;
  role: MessageRole;
  content: string;
  images?: MessageImage[];
};

export type ConversationSearchParams = {
  query?: string;
  includeArchived?: boolean;
  page?: number;
  pageSize?: number;
};
