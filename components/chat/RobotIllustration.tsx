"use client";

import { cn } from "@/lib/utils";

type RobotIllustrationProps = {
  className?: string;
};

export function RobotIllustration({ className }: RobotIllustrationProps) {
  return (
    <div
      className={cn("relative mx-auto h-32 w-32", className)}
      aria-hidden="true"
    >
      {/* Head */}
      <div className="absolute left-1/2 top-0 h-14 w-16 -translate-x-1/2 rounded-[16px] border border-border bg-surface shadow-soft" />
      {/* Eyes */}
      <div className="absolute left-[calc(50%-14px)] top-4 h-2 w-2 rounded-full bg-foreground/70" />
      <div className="absolute left-[calc(50%+6px)] top-4 h-2 w-2 rounded-full bg-foreground/70" />
      {/* Antenna */}
      <div className="absolute left-1/2 top-[-8px] h-3 w-px -translate-x-1/2 bg-border-strong" />
      <div className="absolute left-1/2 top-[-10px] h-2 w-2 -translate-x-1/2 rounded-full border border-border bg-surface" />
      {/* Body */}
      <div className="absolute left-1/2 top-[3.75rem] h-16 w-20 -translate-x-1/2 rounded-[14px] border border-border bg-surface/80 shadow-soft" />
      {/* Arms */}
      <div className="absolute left-[calc(50%-3.5rem)] top-[4.25rem] h-10 w-3 rounded-full border border-border bg-surface" />
      <div className="absolute left-[calc(50%+3rem)] top-[4.25rem] h-10 w-3 rounded-full border border-border bg-surface" />
      {/* Blueprint grid accent */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(10,10,10,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(10,10,10,0.08) 1px, transparent 1px)
          `,
          backgroundSize: "12px 12px",
        }}
      />
    </div>
  );
}
