"use client";

import { cn } from "@/lib/utils";

type PreferenceSelectProps<T extends string> = {
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
  className?: string;
};

export function PreferenceSelect<T extends string>({
  value,
  options,
  onChange,
  className,
}: PreferenceSelectProps<T>) {
  return (
    <div
      className={cn(
        "inline-flex flex-wrap gap-1 rounded-[12px] border border-border bg-background p-1",
        className,
      )}
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            "rounded-[8px] px-3 py-1.5 text-[12px] font-medium transition-colors",
            value === option.value
              ? "bg-foreground text-background"
              : "text-muted hover:text-foreground",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export function PreferenceGrid<T extends string>({
  value,
  options,
  onChange,
}: PreferenceSelectProps<T>) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            "rounded-[12px] border px-3 py-2.5 text-[12px] font-medium transition-all",
            value === option.value
              ? "border-foreground bg-foreground text-background shadow-soft"
              : "border-border bg-background text-muted hover:border-border-strong hover:text-foreground",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
