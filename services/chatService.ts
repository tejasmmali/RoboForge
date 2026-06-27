import type {
  ChatApiRequest,
  ChatError,
  ChatStreamEvent,
  GeminiResponse,
} from "@/types/chat";

function parseStreamLine(line: string): ChatStreamEvent | null {
  if (!line.startsWith("data: ")) return null;
  try {
    return JSON.parse(line.slice(6)) as ChatStreamEvent;
  } catch {
    return null;
  }
}

export async function streamChatMessage(
  request: ChatApiRequest,
  options?: {
    signal?: AbortSignal;
    onChunk?: (text: string) => void;
  },
): Promise<{ text: string; error?: ChatError }> {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...request, stream: true }),
    signal: options?.signal,
  });

  if (!response.ok) {
    const data = (await response.json().catch(() => ({}))) as {
      error?: ChatError;
    };
    return {
      text: "",
      error: data.error ?? {
        code: "server",
        message: "Failed to reach the AI service.",
      },
    };
  }

  const reader = response.body?.getReader();
  if (!reader) {
    return {
      text: "",
      error: { code: "empty", message: "No response stream received." },
    };
  }

  const decoder = new TextDecoder();
  let buffer = "";
  let fullText = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      const event = parseStreamLine(line.trim());
      if (!event) continue;

      if (event.type === "chunk") {
        fullText += event.text;
        options?.onChunk?.(event.text);
      }

      if (event.type === "error") {
        return { text: fullText, error: event.error };
      }
    }
  }

  if (!fullText.trim()) {
    return {
      text: "",
      error: { code: "empty", message: "The AI returned an empty response." },
    };
  }

  return { text: fullText };
}

export async function sendChatMessage(
  request: ChatApiRequest,
  options?: { signal?: AbortSignal },
): Promise<{ data?: GeminiResponse; error?: ChatError }> {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...request, stream: false }),
    signal: options?.signal,
  });

  const data = (await response.json()) as GeminiResponse & {
    error?: ChatError | string;
  };

  if (!response.ok) {
    if (typeof data.error === "object" && data.error !== null) {
      return { error: data.error };
    }
    return {
      error: {
        code: "server",
        message:
          typeof data.error === "string"
            ? data.error
            : "Failed to generate response.",
      },
    };
  }

  return { data };
}

export function exportConversationAsMarkdown(
  title: string,
  messages: { role: string; content: string; createdAt: string }[],
): string {
  const header = `# ${title}\n\nExported from RoboForge AI — ${new Date().toLocaleString()}\n\n---\n\n`;
  const body = messages
    .map((m) => {
      const label = m.role === "user" ? "You" : "RoboForge AI";
      return `### ${label}\n_${new Date(m.createdAt).toLocaleString()}_\n\n${m.content}\n`;
    })
    .join("\n---\n\n");

  return header + body;
}

export function downloadTextFile(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
