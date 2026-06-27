"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Check, Copy, Download, Sparkles } from "lucide-react";
import { highlightArduinoCode } from "@/lib/ai/arduinoHighlight";
import { cn } from "@/lib/utils";

type CodeBlockProps = {
  code: string;
  language?: string;
  filename?: string;
  className?: string;
  onExplain?: (code: string) => void;
};

export function CodeBlock({
  code,
  language = "cpp",
  filename,
  className,
  onExplain,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const displayLang =
    language === "cpp" || language === "arduino" ? "Arduino" : language;

  const highlighted = useMemo(() => {
    if (language === "cpp" || language === "arduino" || language === "c") {
      return highlightArduinoCode(code);
    }
    return code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }, [code, language]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const ext =
      language === "python" ? "py" : language === "javascript" ? "js" : "ino";
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename ?? `sketch.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className={cn(
        "my-3 overflow-hidden rounded-[12px] border border-border bg-[#0d0d0d] shadow-soft",
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
        <span className="rounded-[6px] border border-white/10 px-2 py-0.5 font-heading text-[10px] uppercase tracking-wider text-white/50">
          {filename ?? displayLang}
        </span>
        <div className="flex items-center gap-1.5">
          {onExplain ? (
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onExplain(code)}
              className="flex items-center gap-1 rounded-[6px] border border-white/10 px-2 py-0.5 text-[10px] text-white/60 hover:text-white/90"
            >
              <Sparkles className="h-2.5 w-2.5" strokeWidth={1.75} />
              Explain
            </motion.button>
          ) : null}
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => void handleCopy()}
            className="flex items-center gap-1 rounded-[6px] border border-white/10 px-2 py-0.5 text-[10px] text-white/60 hover:text-white/90"
          >
            {copied ? (
              <>
                <Check className="h-2.5 w-2.5" strokeWidth={2} />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-2.5 w-2.5" strokeWidth={1.75} />
                Copy
              </>
            )}
          </motion.button>
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDownload}
            className="flex items-center gap-1 rounded-[6px] border border-white/10 px-2 py-0.5 text-[10px] text-white/60 hover:text-white/90"
          >
            <Download className="h-2.5 w-2.5" strokeWidth={1.75} />
            Download
          </motion.button>
        </div>
      </div>
      <pre className="max-h-[360px] overflow-auto p-3 font-mono text-[11px] leading-relaxed text-white/75">
        <code dangerouslySetInnerHTML={{ __html: highlighted }} />
      </pre>
    </div>
  );
}
