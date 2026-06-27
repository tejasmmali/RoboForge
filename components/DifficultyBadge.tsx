import { cn } from "@/lib/utils";
import type { Difficulty } from "@/lib/projects";

type DifficultyBadgeProps = {
  difficulty: Difficulty;
  className?: string;
};

const styles: Record<Difficulty, string> = {
  Beginner: "bg-background/90 text-foreground border-border",
  Intermediate: "bg-background/90 text-foreground border-border",
  Advanced: "bg-background/90 text-foreground border-border",
  Expert: "bg-foreground/90 text-background border-foreground",
};

export function DifficultyBadge({ difficulty, className }: DifficultyBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-[8px] border px-2.5 py-1 font-heading text-[10px] font-medium uppercase tracking-wider backdrop-blur-md",
        styles[difficulty],
        className,
      )}
    >
      {difficulty}
    </span>
  );
}
