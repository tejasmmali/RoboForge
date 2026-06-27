"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import type { PartItem } from "@/lib/project-details";

type PartsTableProps = {
  parts: PartItem[];
};

export function PartsTable({ parts }: PartsTableProps) {
  return (
    <div className="overflow-hidden rounded-default border border-border bg-surface/80 backdrop-blur-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-[13px]">
          <thead>
            <tr className="border-b border-border bg-background/60">
              <th className="px-5 py-3.5 font-heading text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Component
              </th>
              <th className="px-5 py-3.5 font-heading text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Qty
              </th>
              <th className="px-5 py-3.5 font-heading text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Purpose
              </th>
              <th className="px-5 py-3.5 font-heading text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Buy
              </th>
            </tr>
          </thead>
          <tbody>
            {parts.map((part, index) => (
              <motion.tr
                key={part.name}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.04 }}
                className="border-b border-border/60 last:border-0 transition-colors hover:bg-background/40"
              >
                <td className="px-5 py-4 font-medium">{part.name}</td>
                <td className="px-5 py-4 text-muted">{part.quantity}</td>
                <td className="px-5 py-4 text-muted">{part.purpose}</td>
                <td className="px-5 py-4">
                  <a
                    href={part.buyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover-glow inline-flex items-center gap-1 rounded-[8px] border border-border px-3 py-1.5 text-[12px] font-medium transition-colors hover:text-accent"
                  >
                    Buy
                    <ExternalLink className="h-3 w-3" strokeWidth={1.75} />
                  </a>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
