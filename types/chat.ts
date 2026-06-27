import type { ResponseLength } from "@/lib/ai/systemPrompt";
import type { ProjectChatContext } from "@/types/project";
import type { ChatMemoryContext } from "@/types/project";
import type { MessageImage } from "@/types/message";

export type QuickCategory =
  | "arduino"
  | "esp32"
  | "sensors"
  | "motors"
  | "programming"
  | "electronics"
  | "computer-vision"
  | "ai-robotics"
  | "iot";

export type SuggestedPrompt = {
  id: string;
  label: string;
  prompt: string;
  category?: QuickCategory;
};

export type AIFeature = {
  id: string;
  title: string;
  description: string;
};

export type Capability = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

export type PinnedResource = {
  id: string;
  label: string;
  href: string;
};

export type ChatSettings = {
  temperature: number;
  responseLength: ResponseLength;
};

export type ChatErrorCode =
  | "network"
  | "rate_limit"
  | "invalid_key"
  | "server"
  | "empty"
  | "unknown";

export type ChatError = {
  code: ChatErrorCode;
  message: string;
};

export type GeminiMessage = {
  role: "user" | "model";
  parts: { text: string }[];
};

export type GeminiRequest = {
  messages: GeminiMessage[];
  systemInstruction?: string;
  stream?: boolean;
};

export type GeminiResponse = {
  text: string;
  finishReason?: string;
};

export type ChatApiRequest = {
  messages: GeminiMessage[];
  projectContext?: ProjectChatContext;
  memoryContext?: ChatMemoryContext;
  settings?: Partial<ChatSettings>;
  stream?: boolean;
};

export type ChatStreamEvent =
  | { type: "chunk"; text: string }
  | { type: "done"; finishReason?: string }
  | { type: "error"; error: ChatError };

export type SendMessageOptions = {
  conversationId?: string;
  category?: QuickCategory;
  images?: MessageImage[];
  regenerate?: boolean;
};

export type { ChatMessage, Conversation, MessageFeedback, MessageImage, MessageRole } from "@/types/message";
export type {
  ConversationUpdateInput,
  CreateMessageInput,
  ConversationSearchParams,
} from "@/types/message";
