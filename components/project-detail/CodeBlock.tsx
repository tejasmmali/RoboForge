"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Copy, Download } from "lucide-react";
import { cn } from "@/lib/utils";

type CodeBlockProps = {
  code: string;
  filename?: string;
  className?: string;
};

export function CodeBlock({
  code,
  filename = "obstacle_robot.ino",
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className={cn(
        "overflow-hidden rounded-default border border-border bg-[#0d0d0d] shadow-soft",
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
        <span className="font-heading text-[11px] text-white/40">{filename}</span>
        <div className="flex items-center gap-2">
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-[8px] border border-white/10 px-2.5 py-1 text-[11px] text-white/60 transition-colors hover:border-white/20 hover:text-white/90"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3" strokeWidth={2} />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" strokeWidth={1.75} />
                Copy
              </>
            )}
          </motion.button>
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDownload}
            className="flex items-center gap-1.5 rounded-[8px] border border-white/10 px-2.5 py-1 text-[11px] text-white/60 transition-colors hover:border-white/20 hover:text-white/90"
          >
            <Download className="h-3 w-3" strokeWidth={1.75} />
            Download
          </motion.button>
        </div>
      </div>
      <pre className="max-h-[480px] overflow-auto p-4 font-mono text-[12px] leading-relaxed text-white/75">
        <code>{code}</code>
      </pre>
    </div>
  );
}
