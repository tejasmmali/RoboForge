"use client";

import { FeaturesPanel } from "@/components/chat/FeaturesPanel";
import { toolActionPrompts } from "@/lib/chat-data";
import type { AIFeature } from "@/types/chat";
import { cn } from "@/lib/utils";

type ToolPanelProps = {
  onRunTool: (prompt: string) => void;
  className?: string;
};

export function ToolPanel({ onRunTool, className }: ToolPanelProps) {
  const handleFeatureClick = (feature: AIFeature) => {
    const prompt =
      toolActionPrompts[feature.id] ??
      `Help me with: ${feature.title}. ${feature.description}`;
    onRunTool(prompt);
  };

  return (
    <FeaturesPanel
      onFeatureClick={handleFeatureClick}
      className={cn(className)}
    />
  );
}
