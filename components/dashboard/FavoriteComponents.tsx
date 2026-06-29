"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ExternalLink, HeartOff } from "lucide-react";
import type { SavedComponent } from "@/types/dashboard";
import { DashboardEmptyState } from "@/components/dashboard/DashboardEmptyState";
import { useRemoveComponentBookmark } from "@/hooks/useBookmarks";

type FavoriteComponentsProps = {
  components: SavedComponent[];
  embedded?: boolean;
};

export function FavoriteComponents({ components, embedded }: FavoriteComponentsProps) {
  const removeBookmark = useRemoveComponentBookmark();

  const content =
    components.length === 0 ? (
      <DashboardEmptyState
        title="No favorite components"
        description="Browse the component library and save parts for your builds."
        actionLabel="Browse Components"
        actionHref="/components"
      />
    ) : (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {components.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -2 }}
              className="hover-glow group rounded-default border border-border bg-surface/80 backdrop-blur-sm"
            >
              <div className="relative h-28 overflow-hidden rounded-t-default">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
              </div>
              <div className="p-4">
                <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  {item.category}
                </p>
                <h3 className="mt-1 font-heading text-[14px] font-medium">
                  {item.name}
                </h3>
                <p className="mt-1 text-[11px] text-muted">{item.specifications}</p>
                <div className="mt-3 flex items-center gap-2">
                  <a
                    href={item.buy_url}
                    className="inline-flex items-center gap-1 text-[12px] font-medium transition-colors hover:text-accent"
                  >
                    Buy Now
                    <ExternalLink className="h-3 w-3" strokeWidth={1.75} />
                  </a>
                  <button
                    type="button"
                    onClick={() => removeBookmark.mutate(item.component_slug)}
                    disabled={removeBookmark.isPending}
                    className="ml-auto flex items-center gap-1 text-[11px] text-muted transition-colors hover:text-foreground disabled:opacity-50"
                    aria-label="Remove from favorites"
                  >
                    <HeartOff className="h-3.5 w-3.5" strokeWidth={1.75} />
                    Remove
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      );

  if (embedded) return content;

  return (
    <section id="components" className="scroll-mt-24">
      <div className="mb-5">
        <h2 className="font-heading text-lg font-medium tracking-tight">
          Favorite Components
        </h2>
        <p className="mt-0.5 text-[13px] text-muted">Parts you&apos;ve bookmarked</p>
      </div>
      {content}
    </section>
  );
}
