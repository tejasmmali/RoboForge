"use client";

import { SuggestionCard } from "@/components/chat/SuggestionCard";
import { examplePrompts } from "@/lib/chat-data";

type ExamplePromptsSectionProps = {
  onSelect: (prompt: string) => void;
};

export function ExamplePromptsSection({ onSelect }: ExamplePromptsSectionProps) {
  return (
    <div>
      <h3 className="font-heading text-lg font-medium tracking-tight">
        Example Prompts
      </h3>
      <p className="mt-1 text-[13px] text-muted">
        Click any prompt to start a conversation.
      </p>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {examplePrompts.map((prompt) => (
          <SuggestionCard
            key={prompt.id}
            label={prompt.label}
            onClick={() => onSelect(prompt.prompt)}
          />
        ))}
      </div>
    </div>
  );
}
