"use client";

import { cn } from "@/lib/utils";

type LoadingSkeletonProps = {
  className?: string;
};

export function LoadingSkeleton({ className }: LoadingSkeletonProps) {
  return (
    <div className={cn("mx-auto w-full max-w-3xl space-y-6 px-4 py-8 md:px-6", className)}>
      <div className="flex justify-end">
        <div className="h-12 w-[55%] animate-pulse rounded-[20px] bg-border" />
      </div>
      <div className="space-y-3">
        <div className="h-4 w-3/4 animate-pulse rounded bg-border/80" />
        <div className="h-4 w-full animate-pulse rounded bg-border/60" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-border/60" />
        <div className="mt-4 h-32 w-full animate-pulse rounded-[12px] bg-border/70" />
      </div>
      <div className="flex justify-end">
        <div className="h-10 w-[40%] animate-pulse rounded-[20px] bg-border" />
      </div>
      <div className="space-y-2">
        <div className="h-4 w-2/3 animate-pulse rounded bg-border/80" />
        <div className="h-4 w-full animate-pulse rounded bg-border/60" />
      </div>
    </div>
  );
}

export function SidebarSkeleton() {
  return (
    <div className="flex h-full flex-col gap-3 p-4">
      <div className="h-10 animate-pulse rounded-[10px] bg-border/70" />
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-12 animate-pulse rounded-[10px] bg-border/50" />
      ))}
    </div>
  );
}
