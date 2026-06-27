"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type BlueprintGridProps = {
  className?: string;
  size?: number;
  opacity?: number;
};

export function BlueprintGrid({
  className,
  size = 24,
  opacity = 0.4,
}: BlueprintGridProps) {
  return (
    <div
      className={cn("pointer-events-none absolute inset-0", className)}
      style={{
        opacity,
        backgroundImage: `
          linear-gradient(rgba(10,10,10,0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(10,10,10,0.05) 1px, transparent 1px)
        `,
        backgroundSize: `${size}px ${size}px`,
      }}
      aria-hidden="true"
    />
  );
}

type TechLabelProps = {
  children: ReactNode;
  className?: string;
  coord?: string;
};

export function TechLabel({ children, className, coord }: TechLabelProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-heading text-[9px] font-medium uppercase tracking-[0.12em] text-muted-foreground",
        className,
      )}
    >
      {coord && (
        <span className="text-[8px] text-muted-foreground/60">{coord}</span>
      )}
      {children}
    </span>
  );
}

type GlassPanelProps = {
  children: ReactNode;
  className?: string;
  label?: string;
  coord?: string;
};

export function GlassPanel({
  children,
  className,
  label,
  coord,
}: GlassPanelProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[16px] border border-white/60 bg-white/50 shadow-elevated backdrop-blur-xl",
        className,
      )}
    >
      {(label || coord) && (
        <div className="flex items-center justify-between border-b border-border/60 px-3 py-1.5">
          {label && <TechLabel>{label}</TechLabel>}
          {coord && (
            <span className="font-heading text-[8px] tracking-wider text-muted-foreground/50">
              {coord}
            </span>
          )}
        </div>
      )}
      {children}
    </div>
  );
}

type MeasurementLineProps = {
  orientation?: "horizontal" | "vertical";
  className?: string;
  label?: string;
};

export function MeasurementLine({
  orientation = "horizontal",
  className,
  label,
}: MeasurementLineProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute flex items-center text-muted-foreground/40",
        orientation === "horizontal" ? "flex-row" : "flex-col",
        className,
      )}
      aria-hidden="true"
    >
      <div
        className={cn(
          "bg-border",
          orientation === "horizontal" ? "h-px flex-1" : "w-px flex-1",
        )}
      />
      {label && (
        <span className="font-heading px-1.5 text-[8px] tracking-wider">
          {label}
        </span>
      )}
      <div
        className={cn(
          "bg-border",
          orientation === "horizontal" ? "h-px flex-1" : "w-px flex-1",
        )}
      />
    </div>
  );
}

export function FloatingParticles({ className }: { className?: string }) {
  const particles = [
    { top: "12%", left: "8%", delay: 0 },
    { top: "28%", left: "92%", delay: 1.2 },
    { top: "68%", left: "5%", delay: 0.6 },
    { top: "82%", left: "88%", delay: 1.8 },
    { top: "45%", left: "48%", delay: 0.3 },
  ];

  return (
    <div
      className={cn("pointer-events-none absolute inset-0", className)}
      aria-hidden="true"
    >
      {particles.map((p, i) => (
        <motion.span
          key={i}
          className="absolute h-1 w-1 rounded-full bg-accent/40"
          style={{ top: p.top, left: p.left }}
          animate={{ opacity: [0.2, 0.8, 0.2], scale: [1, 1.4, 1] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

export function WireframeCircle({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute rounded-full border border-dashed border-border/80",
        className,
      )}
      aria-hidden="true"
    />
  );
}

export function PcbTrace({ className }: { className?: string }) {
  return (
    <div
      className={cn("pointer-events-none absolute opacity-20", className)}
      aria-hidden="true"
    >
      <div className="h-px w-16 bg-foreground" />
      <div className="ml-16 h-8 w-px bg-foreground" />
      <div className="ml-16 h-px w-10 bg-foreground" />
    </div>
  );
}
