"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Check, Lightbulb } from "lucide-react";
import Image from "next/image";
import type { GuideStep } from "@/lib/project-details";
import { CodeBlock } from "@/components/project-detail/CodeBlock";
import { cn } from "@/lib/utils";

type StepCardProps = {
  step: GuideStep;
  code?: string;
  isLast?: boolean;
};

export function StepCard({ step, code, isLast }: StepCardProps) {
  return (
    <motion.article
      id={step.number === 5 ? "code" : undefined}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={cn("relative", !isLast && "pb-12")}
    >
      {!isLast && (
        <div className="absolute left-5 top-12 bottom-0 w-px bg-border" aria-hidden="true" />
      )}

      <div className="flex gap-5 md:gap-6">
        <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-surface font-heading text-[14px] font-medium shadow-soft">
          {step.number}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="font-heading text-xl font-medium tracking-tight md:text-2xl">
            {step.title}
          </h3>
          <p className="mt-3 text-[15px] leading-relaxed text-muted">
            {step.content}
          </p>

          {step.image && (
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="relative mt-6 aspect-video overflow-hidden rounded-default border border-border"
            >
              <Image
                src={step.image}
                alt={step.title}
                fill
                className="object-cover transition-transform duration-700 hover:scale-[1.03]"
                sizes="(max-width: 768px) 100vw, 700px"
              />
            </motion.div>
          )}

          {step.checklist && (
            <ul className="mt-5 space-y-2 rounded-default border border-border bg-surface/60 p-4" role="list">
              {step.checklist.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-[13px] text-muted">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-foreground" strokeWidth={2} />
                  {item}
                </li>
              ))}
            </ul>
          )}

          {step.pinTable && (
            <div className="mt-5 overflow-hidden rounded-default border border-border">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="border-b border-border bg-background/60">
                    <th className="px-4 py-2.5 text-left font-heading text-[10px] uppercase tracking-wider text-muted-foreground">Pin</th>
                    <th className="px-4 py-2.5 text-left font-heading text-[10px] uppercase tracking-wider text-muted-foreground">Connection</th>
                  </tr>
                </thead>
                <tbody>
                  {step.pinTable.map((row) => (
                    <tr key={row.pin} className="border-b border-border/60 last:border-0">
                      <td className="px-4 py-3 font-medium">{row.pin}</td>
                      <td className="px-4 py-3 text-muted">{row.connection}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {step.tips && step.tips.length > 0 && (
            <div className="mt-5 rounded-default border border-border bg-background/40 p-4">
              <p className="flex items-center gap-1.5 font-heading text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                <Lightbulb className="h-3.5 w-3.5" strokeWidth={1.75} />
                Tips
              </p>
              <ul className="mt-2 space-y-1.5" role="list">
                {step.tips.map((tip) => (
                  <li key={tip} className="text-[13px] text-muted">{tip}</li>
                ))}
              </ul>
            </div>
          )}

          {step.warnings && step.warnings.length > 0 && (
            <div className="mt-5 rounded-default border border-border bg-background/40 p-4">
              <p className="flex items-center gap-1.5 font-heading text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                <AlertTriangle className="h-3.5 w-3.5" strokeWidth={1.75} />
                Warnings
              </p>
              <ul className="mt-2 space-y-1.5" role="list">
                {step.warnings.map((w) => (
                  <li key={w} className="text-[13px] text-muted">{w}</li>
                ))}
              </ul>
            </div>
          )}

          {step.number === 5 && code && (
            <div className="mt-6">
              <CodeBlock code={code} />
              <motion.a
                href="/chatbot"
                whileHover={{ scale: 1.02 }}
                className="mt-3 inline-flex text-[13px] font-medium text-accent"
              >
                Explain this code with AI →
              </motion.a>
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
}
