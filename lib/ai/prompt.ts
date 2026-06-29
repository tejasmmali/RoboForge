import {
  formatMemoryContextBlock,
  formatProjectContextBlock,
  formatRouteContextBlock,
} from "@/lib/ai/context";
import {
  BASE_SYSTEM_PROMPT,
  getLengthInstruction,
  type ResponseLength,
} from "@/lib/ai/systemPrompt";
import type { ProjectChatContext } from "@/types/project";
import type { ChatMemoryContext } from "@/types/project";
import type { GlobalRouteContext } from "@/types/chat";

const INJECTION_PATTERNS = [
  /ignore (all )?(previous|prior|above) instructions/i,
  /you are now (a|an)/i,
  /system prompt/i,
  /reveal (your|the) (api|secret|key)/i,
  /jailbreak/i,
  /DAN mode/i,
];

export function sanitizeUserInput(input: string): string {
  let text = input.trim().slice(0, 4000);
  text = text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "");
  return text;
}

export function detectPromptInjection(input: string): boolean {
  return INJECTION_PATTERNS.some((pattern) => pattern.test(input));
}

export function buildSystemInstruction(options?: {
  projectContext?: ProjectChatContext;
  memoryContext?: ChatMemoryContext;
  routeContext?: GlobalRouteContext;
  responseLength?: ResponseLength;
  temperature?: number;
}): string {
  const parts = [BASE_SYSTEM_PROMPT, "", getLengthInstruction(options?.responseLength)];

  if (options?.temperature != null) {
    parts.push(
      "",
      `Creativity level (temperature reference): ${options.temperature.toFixed(1)} — stay accurate for wiring and code.`,
    );
  }

  if (options?.routeContext) {
    parts.push("", formatRouteContextBlock(options.routeContext));
  }

  if (options?.projectContext) {
    parts.push("", formatProjectContextBlock(options.projectContext));
  }

  if (options?.memoryContext) {
    const memoryBlock = formatMemoryContextBlock(options.memoryContext);
    if (memoryBlock) parts.push("", memoryBlock);
  }

  return parts.join("\n");
}

export function getContextualSuggestions(context?: ProjectChatContext): string[] {
  if (context?.currentStep) {
    return [
      `Explain step ${context.currentStep.number}: ${context.currentStep.title}`,
      "Debug this wiring",
      "Recommend another sensor",
      "Find common mistakes",
      "Explain the algorithm",
      "Optimize this project",
    ];
  }

  if (context?.projectName) {
    return [
      "Explain this code",
      "Debug this wiring",
      "Recommend components",
      "Power calculation help",
      "Find common mistakes",
      "Suggest improvements",
    ];
  }

  return [
    "Generate Arduino code",
    "Explain PWM",
    "Compare ESP32 vs Arduino",
    "Debug HC-SR04",
    "Motor driver help",
    "Suggest components",
    "Power calculation",
    "Bluetooth communication",
    "PID controller basics",
  ];
}

export function sanitizeMarkdown(content: string): string {
  return content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/javascript:/gi, "")
    .slice(0, 50000);
}
