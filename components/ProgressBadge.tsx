import { cn } from "@/lib/utils";

type ProgressBadgeProps = {
  value: number;
  label?: string;
  className?: string;
};

export function ProgressBadge({
  value,
  label = "Build complexity",
  className,
}: ProgressBadgeProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-heading text-muted">{value}%</span>
      </div>
      <div className="h-1 overflow-hidden rounded-full bg-border">
        <div
          className="h-full rounded-full bg-foreground/70 transition-all duration-500"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
