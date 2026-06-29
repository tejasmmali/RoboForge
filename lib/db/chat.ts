import { getBrowserDb } from "@/lib/db/client";
import { executeQuery, executeVoidQuery } from "@/lib/db/errors";
import {
  conversationCreateSchema,
  conversationUpdateSchema,
  messageCreateSchema,
} from "@/lib/validations/db";
import type {
  DbChatConversation,
  DbChatMessage,
} from "@/types/database";
import type {
  ChatMessage,
  Conversation,
  ConversationSearchParams,
  ConversationUpdateInput,
} from "@/types/message";

function mapConversation(
  row: DbChatConversation,
  messages: ChatMessage[] = [],
): Conversation {
  return {
    id: row.id,
    title: row.title,
    preview: row.preview ?? "",
    updatedAt: row.updated_at,
    createdAt: row.created_at,
    pinned: row.pinned,
    archived: "archived" in row ? Boolean(row.archived) : false,
    category: row.category ?? undefined,
    projectSlug: row.project_slug ?? undefined,
    userId: row.user_id,
    messages,
  };
}

function mapMessage(row: DbChatMessage): ChatMessage {
  return {
    id: row.id,
    role: row.role,
    content: row.content,
    createdAt: row.created_at,
    bookmarked: row.bookmarked,
    feedback: row.feedback,
    images: (row.images as ChatMessage["images"]) ?? undefined,
  };
}

export async function listConversations(
  userId: string,
  params: ConversationSearchParams = {},
): Promise<Conversation[]> {
  const supabase = getBrowserDb();
  const pageSize = params.pageSize ?? 30;
  const page = params.page ?? 1;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const query = supabase
    .from("chat_conversations")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })
    .range(from, to);

  const { data, error } = await query;
  if (error) throw error;

  let rows = (data ?? []) as DbChatConversation[];

  if (params.query?.trim()) {
    const q = params.query.toLowerCase();
    rows = rows.filter(
      (row) =>
        row.title.toLowerCase().includes(q) ||
        (row.preview ?? "").toLowerCase().includes(q),
    );
  }

  return rows.map((row) => mapConversation(row));
}

export async function loadConversationMessages(
  conversationId: string,
  userId: string,
): Promise<ChatMessage[]> {
  const supabase = getBrowserDb();
  const { data, error } = await supabase
    .from("chat_messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return ((data ?? []) as DbChatMessage[]).map(mapMessage);
}

export async function createConversation(
  userId: string,
  input: {
    title: string;
    preview?: string;
    projectSlug?: string;
    category?: string;
  },
): Promise<Conversation> {
  const parsed = conversationCreateSchema.parse(input);
  const supabase = getBrowserDb();

  const row = await executeQuery<DbChatConversation>(() =>
    supabase
      .from("chat_conversations")
      .insert({
        user_id: userId,
        title: parsed.title,
        preview: parsed.preview ?? null,
        project_slug: parsed.projectSlug ?? null,
        category: parsed.category ?? null,
        pinned: false,
      })
      .select("*")
      .single(),
  );

  return mapConversation(row);
}

export async function updateConversation(
  conversationId: string,
  userId: string,
  updates: ConversationUpdateInput,
): Promise<void> {
  const parsed = conversationUpdateSchema.parse(updates);
  const supabase = getBrowserDb();
  await executeVoidQuery(() =>
    supabase
      .from("chat_conversations")
      .update({ ...parsed, updated_at: new Date().toISOString() })
      .eq("id", conversationId)
      .eq("user_id", userId),
  );
}

export async function renameConversation(
  conversationId: string,
  userId: string,
  title: string,
): Promise<void> {
  return updateConversation(conversationId, userId, { title });
}

export async function deleteConversation(
  conversationId: string,
  userId: string,
): Promise<void> {
  const supabase = getBrowserDb();
  await executeVoidQuery(() =>
    supabase
      .from("chat_messages")
      .delete()
      .eq("conversation_id", conversationId)
      .eq("user_id", userId),
  );
  await executeVoidQuery(() =>
    supabase
      .from("chat_conversations")
      .delete()
      .eq("id", conversationId)
      .eq("user_id", userId),
  );
}

export async function sendMessage(
  userId: string,
  input: {
    conversationId: string;
    role: ChatMessage["role"];
    content: string;
    images?: ChatMessage["images"];
  },
): Promise<ChatMessage> {
  const parsed = messageCreateSchema.parse(input);
  const supabase = getBrowserDb();

  const row = await executeQuery<DbChatMessage>(() =>
    supabase
      .from("chat_messages")
      .insert({
        user_id: userId,
        conversation_id: parsed.conversationId,
        role: parsed.role,
        content: parsed.content,
        images: parsed.images ?? null,
        bookmarked: false,
        feedback: null,
      })
      .select("*")
      .single(),
  );

  await executeVoidQuery(() =>
    supabase
      .from("chat_conversations")
      .update({
        preview: parsed.content.slice(0, 120),
        updated_at: new Date().toISOString(),
      })
      .eq("id", parsed.conversationId)
      .eq("user_id", userId),
  );

  return mapMessage(row);
}

export const saveMessage = sendMessage;

export async function updateMessageFeedback(
  messageId: string,
  userId: string,
  feedback: "like" | "dislike" | null,
): Promise<void> {
  const supabase = getBrowserDb();
  await executeVoidQuery(() =>
    supabase
      .from("chat_messages")
      .update({ feedback })
      .eq("id", messageId)
      .eq("user_id", userId),
  );
}

export async function toggleMessageBookmark(
  messageId: string,
  userId: string,
  bookmarked: boolean,
): Promise<void> {
  const supabase = getBrowserDb();
  await executeVoidQuery(() =>
    supabase
      .from("chat_messages")
      .update({ bookmarked })
      .eq("id", messageId)
      .eq("user_id", userId),
  );
}

export async function searchConversations(
  userId: string,
  query: string,
): Promise<Conversation[]> {
  return listConversations(userId, { query, pageSize: 50 });
}

export async function getUserMemoryContext(userId: string) {
  const supabase = getBrowserDb();
  const { data, error } = await supabase
    .from("user_ai_memory")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;

  return {
    favoriteComponents: (data?.favorite_components as string[]) ?? [],
    recentProjects: (data?.recent_projects as string[]) ?? [],
    learningProgress:
      typeof data?.learning_progress === "string"
        ? data.learning_progress
        : undefined,
  };
}

export async function upsertUserMemoryContext(
  userId: string,
  memory: {
    favoriteComponents?: string[];
    recentProjects?: string[];
    learningProgress?: string;
  },
): Promise<void> {
  const supabase = getBrowserDb();
  await executeVoidQuery(() =>
    supabase.from("user_ai_memory").upsert(
      {
        user_id: userId,
        favorite_components: memory.favoriteComponents,
        recent_projects: memory.recentProjects,
        learning_progress: memory.learningProgress,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    ),
  );
}
