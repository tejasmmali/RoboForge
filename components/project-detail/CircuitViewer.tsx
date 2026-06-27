"use client";

import { motion } from "framer-motion";
import { Download, Maximize2 } from "lucide-react";
import Image from "next/image";
import type { ProjectDetail } from "@/lib/project-details";
import { BlueprintGrid, TechLabel } from "@/components/visuals/LabDecor";

type CircuitViewerProps = {
  circuit: ProjectDetail["circuit"];
};

export function CircuitViewer({ circuit }: CircuitViewerProps) {
  return (
    <div className="space-y-6">
      <div className="group relative overflow-hidden rounded-default border border-border bg-surface shadow-soft">
        <div className="relative aspect-[16/10] w-full">
          <Image
            src={circuit.image}
            alt="Circuit diagram preview"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 100vw, 800px"
          />
          <div className="absolute inset-0 bg-foreground/[0.04]" />
          <BlueprintGrid size={24} opacity={0.15} />
          <TechLabel
            coord="SCH-01"
            className="absolute left-4 top-4 rounded-[6px] bg-white/70 px-2 py-1 backdrop-blur-sm"
          >
            Circuit Preview
          </TechLabel>
        </div>
        <div className="flex flex-wrap gap-3 border-t border-border p-4">
          <motion.button
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="hover-glow inline-flex items-center gap-1.5 rounded-default border border-border bg-surface px-4 py-2 text-[13px] font-medium"
          >
            <Maximize2 className="h-3.5 w-3.5" strokeWidth={1.75} />
            View Full Diagram
          </motion.button>
          <motion.button
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="hover-glow inline-flex items-center gap-1.5 rounded-default border border-border bg-surface px-4 py-2 text-[13px] font-medium"
          >
            <Download className="h-3.5 w-3.5" strokeWidth={1.75} />
            Download Diagram
          </motion.button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {circuit.sections.map((section) => (
          <div
            key={section.title}
            className="rounded-default border border-border bg-surface/60 p-5 backdrop-blur-sm"
          >
            <h4 className="font-heading text-[13px] font-medium tracking-tight">
              {section.title}
            </h4>
            <p className="mt-2 text-[13px] leading-relaxed text-muted">
              {section.content}
            </p>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-default border border-border">
        <div className="border-b border-border bg-background/60 px-5 py-3">
          <h4 className="font-heading text-[12px] font-medium uppercase tracking-wider text-muted-foreground">
            Pin Mapping
          </h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] text-[13px]">
            <thead>
              <tr className="border-b border-border">
                <th className="px-5 py-3 text-left font-heading text-[10px] uppercase tracking-wider text-muted-foreground">Component</th>
                <th className="px-5 py-3 text-left font-heading text-[10px] uppercase tracking-wider text-muted-foreground">Arduino Pin</th>
                <th className="px-5 py-3 text-left font-heading text-[10px] uppercase tracking-wider text-muted-foreground">Notes</th>
              </tr>
            </thead>
            <tbody>
              {circuit.pinMapping.map((row) => (
                <tr key={row.component} className="border-b border-border/60 last:border-0">
                  <td className="px-5 py-3 font-medium">{row.component}</td>
                  <td className="px-5 py-3 font-heading text-[12px]">{row.arduinoPin}</td>
                  <td className="px-5 py-3 text-muted">{row.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
