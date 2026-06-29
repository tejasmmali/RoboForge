"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const fadeEase = [0.16, 1, 0.3, 1] as const;

const skeletonStagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.04 },
  },
};

const skeletonItem = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: fadeEase },
  },
};

type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn("skeleton-shimmer rounded-md", className)}
      aria-hidden="true"
    />
  );
}

type LoadingSkeletonProps = {
  className?: string;
  variant?: "default" | "compact";
};

export function LoadingSkeleton({
  className,
  variant = "default",
}: LoadingSkeletonProps) {
  const isCompact = variant === "compact";

  return (
    <motion.div
      variants={skeletonStagger}
      initial="hidden"
      animate="visible"
      className={cn(
        "mx-auto w-full space-y-4",
        isCompact ? "px-3 py-3" : "max-w-3xl space-y-6 px-4 py-8 md:px-6",
        className,
      )}
    >
      <motion.div variants={skeletonItem} className="flex justify-end">
        <Skeleton
          className={cn(
            "rounded-2xl rounded-br-sm",
            isCompact ? "h-9 w-[45%]" : "h-12 w-[55%] rounded-[20px]",
          )}
        />
      </motion.div>
      <motion.div
        variants={skeletonItem}
        className={cn(
          "rounded-2xl rounded-bl-sm border border-border/40 bg-background/50",
          isCompact ? "space-y-2 p-3" : "space-y-3 p-4",
        )}
      >
        <Skeleton className="h-3.5 w-3/4" />
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-5/6" />
        {!isCompact && <Skeleton className="mt-2 h-28 w-full rounded-[12px]" />}
      </motion.div>
      <motion.div variants={skeletonItem} className="flex justify-end">
        <Skeleton
          className={cn(
            "rounded-2xl rounded-br-sm",
            isCompact ? "h-8 w-[35%]" : "h-10 w-[40%] rounded-[20px]",
          )}
        />
      </motion.div>
      <motion.div
        variants={skeletonItem}
        className={cn(
          "rounded-2xl rounded-bl-sm border border-border/40 bg-background/50",
          isCompact ? "space-y-2 p-3" : "space-y-2 p-4",
        )}
      >
        <Skeleton className="h-3.5 w-2/3" />
        <Skeleton className="h-3.5 w-full" />
      </motion.div>
    </motion.div>
  );
}

export function SidebarSkeleton({ collapsed = false }: { collapsed?: boolean }) {
  if (collapsed) {
    return (
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: fadeEase }}
        className="flex h-full w-16 flex-col items-center gap-3 border-r border-border bg-surface/95 p-3"
      >
        <Skeleton className="h-9 w-9 rounded-[10px]" />
        <Skeleton className="h-9 w-9 rounded-[12px]" />
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-8 rounded-[10px]" />
        ))}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45, ease: fadeEase }}
      className="flex h-full w-[280px] shrink-0 flex-col border-r border-border bg-surface/95"
    >
      <div className="flex items-center gap-2.5 border-b border-border p-3">
        <Skeleton className="h-8 w-8 rounded-[10px]" />
        <div className="flex-1 space-y-1.5">
          <Skeleton className="h-3.5 w-24" />
          <Skeleton className="h-2.5 w-16" />
        </div>
      </div>

      <div className="p-3">
        <Skeleton className="h-10 w-full rounded-[12px]" />
      </div>

      <div className="flex-1 space-y-2 px-3 pb-3">
        <Skeleton className="h-2.5 w-20" />
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton
            key={i}
            className={cn(
              "h-11 w-full rounded-[10px]",
              i > 2 && "opacity-70",
              i > 4 && "opacity-50",
            )}
          />
        ))}

        <Skeleton className="mt-4 h-2.5 w-16" />
        <div className="flex flex-wrap gap-1.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-6 w-14 rounded-full" />
          ))}
        </div>
      </div>

      <div className="space-y-1 border-t border-border p-2">
        <Skeleton className="h-8 w-full rounded-[10px]" />
        <Skeleton className="h-8 w-full rounded-[10px]" />
      </div>
    </motion.div>
  );
}

function ChatHeaderSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: fadeEase }}
      className="flex shrink-0 items-center justify-between border-b border-border/60 px-3 py-2.5 md:px-4"
    >
      <div className="flex items-center gap-2">
        <Skeleton className="h-9 w-9 rounded-[10px] lg:hidden" />
        <div className="space-y-1.5">
          <Skeleton className="h-3.5 w-28" />
          <Skeleton className="h-2.5 w-36" />
        </div>
      </div>
      <Skeleton className="h-9 w-24 rounded-[10px]" />
    </motion.div>
  );
}

function ChatInputSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: fadeEase, delay: 0.12 }}
      className="shrink-0 px-4 pb-4 pt-2 md:px-6 md:pb-6"
    >
      <div className="mx-auto max-w-3xl">
        <Skeleton className="h-[52px] w-full rounded-[22px]" />
        <Skeleton className="mx-auto mt-2 h-2.5 w-48" />
      </div>
    </motion.div>
  );
}

function RightPanelSkeleton({ width = 240, delay = 0 }: { width?: number; delay?: number }) {
  return (
    <motion.aside
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45, ease: fadeEase, delay }}
      className="hidden shrink-0 overflow-hidden border-l border-border bg-surface/40 p-4 xl:block"
      style={{ width }}
    >
      <Skeleton className="h-2.5 w-20" />
      <div className="mt-3 flex flex-wrap gap-1.5">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-6 w-16 rounded-full" />
        ))}
      </div>
      <div className="mt-4 space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-[12px]" />
        ))}
      </div>
    </motion.aside>
  );
}

export function AIAssistantPageSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: fadeEase }}
      className="flex h-full overflow-hidden"
      role="status"
      aria-label="Loading AI assistant"
    >
      <div className="hidden lg:block">
        <SidebarSkeleton />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: fadeEase, delay: 0.06 }}
        className="flex min-w-0 flex-1 flex-col bg-background"
      >
        <ChatHeaderSkeleton />
        <div className="min-h-0 flex-1 overflow-hidden">
          <LoadingSkeleton />
        </div>
        <ChatInputSkeleton />
      </motion.div>

      <RightPanelSkeleton width={240} delay={0.1} />
      <RightPanelSkeleton width={220} delay={0.16} />
    </motion.div>
  );
}

export function ChatWindowSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: fadeEase }}
      className="flex h-full flex-col"
      role="status"
      aria-label="Loading conversation"
    >
      <div className="min-h-0 flex-1 overflow-hidden">
        <LoadingSkeleton />
      </div>
    </motion.div>
  );
}
