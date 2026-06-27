import { GoogleGenerativeAI } from "@google/generative-ai";
import type { GeminiMessage, GeminiRequest } from "@/types/chat";

const DEFAULT_MODELS = [
  process.env.GEMINI_MODEL,
  "gemini-2.5-flash",
  "gemini-flash-latest",
  "gemini-2.5-flash-lite",
  "gemini-3.1-flash-lite",
].filter(Boolean) as string[];

export function getGeminiApiKey(): string {
  const apiKey =
    process.env.GOOGLE_GENERATIVE_AI_API_KEY ?? process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "Gemini API key not configured. Set GOOGLE_GENERATIVE_AI_API_KEY in .env.local",
    );
  }

  return apiKey;
}

function isQuotaError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return message.includes("429") || message.includes("quota");
}

function isInvalidKeyError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return (
    message.includes("API key") ||
    message.includes("401") ||
    message.includes("403") ||
    message.includes("invalid")
  );
}

function getModel(apiKey: string, modelName: string, systemInstruction: string) {
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({
    model: modelName,
    systemInstruction,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 8192,
    },
  });
}

function prepareChatMessages(messages: GeminiMessage[]) {
  const last = messages[messages.length - 1];

  if (!last || last.role !== "user") {
    throw new Error("Last message must be from the user.");
  }

  const userText = last.parts.map((p) => p.text ?? "").join("\n");
  const history = messages.slice(0, -1).map((message) => ({
    role: message.role,
    parts: message.parts,
  }));

  return { userText, history };
}

async function generateWithModel(
  apiKey: string,
  modelName: string,
  request: GeminiRequest,
): Promise<{ text: string; finishReason: string }> {
  const systemInstruction = request.systemInstruction ?? "";
  const model = getModel(apiKey, modelName, systemInstruction);
  const { userText, history } = prepareChatMessages(request.messages);

  if (history.length === 0) {
    const result = await model.generateContent(userText);
    return {
      text: result.response.text(),
      finishReason: "STOP",
    };
  }

  const chat = model.startChat({ history });
  const result = await chat.sendMessage(userText);

  return {
    text: result.response.text(),
    finishReason: "STOP",
  };
}

async function* streamWithModel(
  apiKey: string,
  modelName: string,
  request: GeminiRequest,
): AsyncGenerator<string> {
  const systemInstruction = request.systemInstruction ?? "";
  const model = getModel(apiKey, modelName, systemInstruction);
  const { userText, history } = prepareChatMessages(request.messages);

  let result;

  if (history.length === 0) {
    result = await model.generateContentStream(userText);
  } else {
    const chat = model.startChat({ history });
    result = await chat.sendMessageStream(userText);
  }

  for await (const chunk of result.stream) {
    const text = chunk.text();
    if (text) yield text;
  }
}

async function withModelFallback<T>(
  fn: (apiKey: string, modelName: string) => Promise<T>,
): Promise<T> {
  const apiKey = getGeminiApiKey();
  let lastError: unknown;

  for (const modelName of DEFAULT_MODELS) {
    try {
      return await fn(apiKey, modelName);
    } catch (error) {
      lastError = error;
      if (isInvalidKeyError(error)) {
        throw new Error(
          "Invalid Gemini API key. Check GOOGLE_GENERATIVE_AI_API_KEY in .env.local",
        );
      }
      if (!isQuotaError(error)) {
        throw error;
      }
    }
  }

  const message =
    lastError instanceof Error
      ? lastError.message
      : "All Gemini models exceeded quota.";

  throw new Error(message);
}

export async function sendToGemini(request: GeminiRequest) {
  return withModelFallback((apiKey, modelName) =>
    generateWithModel(apiKey, modelName, request),
  );
}

export async function* streamFromGemini(
  request: GeminiRequest,
): AsyncGenerator<string> {
  const apiKey = getGeminiApiKey();
  let lastError: unknown;

  for (const modelName of DEFAULT_MODELS) {
    try {
      for await (const chunk of streamWithModel(apiKey, modelName, request)) {
        yield chunk;
      }
      return;
    } catch (error) {
      lastError = error;
      if (isInvalidKeyError(error)) {
        throw new Error(
          "Invalid Gemini API key. Check GOOGLE_GENERATIVE_AI_API_KEY in .env.local",
        );
      }
      if (!isQuotaError(error)) {
        throw error;
      }
    }
  }

  const message =
    lastError instanceof Error
      ? lastError.message
      : "All Gemini models exceeded quota.";

  throw new Error(message);
}

export function classifyGeminiError(error: unknown): {
  code: "network" | "rate_limit" | "invalid_key" | "server" | "empty" | "unknown";
  message: string;
} {
  const message = error instanceof Error ? error.message : String(error);
  const lower = message.toLowerCase();

  if (lower.includes("fetch") || lower.includes("network")) {
    return { code: "network", message: "No internet connection. Check your network and try again." };
  }
  if (lower.includes("429") || lower.includes("quota") || lower.includes("rate")) {
    return { code: "rate_limit", message: "Rate limit reached. Please wait a moment and try again." };
  }
  if (lower.includes("api key") || lower.includes("401") || lower.includes("invalid")) {
    return { code: "invalid_key", message: "Invalid API key. Contact your administrator." };
  }
  if (lower.includes("empty") || lower.includes("no response")) {
    return { code: "empty", message: "The AI returned an empty response. Try regenerating." };
  }
  if (lower.includes("500") || lower.includes("server")) {
    return { code: "server", message: "Server error. Please try again shortly." };
  }

  return { code: "unknown", message: message || "Something went wrong." };
}
