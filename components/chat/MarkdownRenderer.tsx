"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { CodeBlock } from "@/components/chat/CodeBlock";
import { cn } from "@/lib/utils";

type MarkdownRendererProps = {
  content: string;
  className?: string;
  compact?: boolean;
};

function renderInline(text: string) {
  const parts = text.split(
    /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|_[^_]+_|\[[^\]]+\]\([^)]+\))/g,
  );
  return parts.map((part, i) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={i}
          className="rounded-[4px] border border-border bg-background/80 px-1 py-0.5 font-mono text-[0.85em]"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-medium text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (
      (part.startsWith("*") && part.endsWith("*")) ||
      (part.startsWith("_") && part.endsWith("_"))
    ) {
      return (
        <em key={i} className="italic text-muted">
          {part.slice(1, -1)}
        </em>
      );
    }
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      const [, label, href] = linkMatch;
      const isExternal = href.startsWith("http");
      if (isExternal) {
        return (
          <a
            key={i}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline-offset-2 hover:underline"
          >
            {label}
          </a>
        );
      }
      return (
        <Link
          key={i}
          href={href}
          className="text-accent underline-offset-2 hover:underline"
        >
          {label}
        </Link>
      );
    }
    return part;
  });
}

export function MarkdownRenderer({
  content,
  className,
  compact = false,
}: MarkdownRendererProps) {
  const elements: ReactNode[] = [];
  let codeLang = "cpp";
  const pClass = compact
    ? "my-1 text-[12px] leading-relaxed text-foreground/90"
    : "my-2 text-[13px] leading-relaxed text-muted";
  const quoteClass = compact
    ? "my-1 border-l-2 border-border pl-3 text-[12px] text-muted"
    : "my-3 border-l-2 border-accent/30 pl-4 text-[13px] italic text-muted";
  const h2Class = compact
    ? "mb-1 mt-2 font-heading text-[14px] font-medium text-foreground"
    : "mb-2 mt-5 font-heading text-[18px] font-medium tracking-tight text-foreground";
  const h3Class = compact
    ? "mb-1 mt-2 font-heading text-[13px] font-medium text-foreground"
    : "mb-2 mt-4 font-heading text-[15px] font-medium tracking-tight text-foreground";
  const liClass = compact
    ? "ml-3 list-disc text-[12px] text-foreground/90"
    : "ml-4 list-disc text-[13px] text-muted";

  const lines = content.split("\n");
  let buffer: string[] = [];
  let tableRows: string[][] = [];
  let inTable = false;

  const flushParagraph = (key: string) => {
    if (buffer.length === 0) return;
    const text = buffer.join("\n").trim();
    if (!text) {
      buffer = [];
      return;
    }
    if (text.startsWith("> ")) {
      elements.push(
        <blockquote key={key} className={quoteClass}>
          {renderInline(text.slice(2))}
        </blockquote>,
      );
    } else {
      elements.push(
        <p key={key} className={pClass}>
          {renderInline(text)}
        </p>,
      );
    }
    buffer = [];
  };

  const flushTable = (key: string) => {
    if (tableRows.length === 0) return;
    const [header, ...rows] = tableRows;
    elements.push(
      <div key={key} className="my-3 overflow-x-auto rounded-[12px] border border-border">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="border-b border-border bg-background/60">
              {header.map((cell) => (
                <th
                  key={cell}
                  className="px-3 py-2 text-left font-heading text-[10px] uppercase tracking-wider text-muted-foreground"
                >
                  {cell.trim()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri} className="border-b border-border/60 last:border-0">
                {row.map((cell, ci) => (
                  <td key={ci} className="px-3 py-2 text-muted">
                    {renderInline(cell.trim())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>,
    );
    tableRows = [];
    inTable = false;
  };

  let codeBuffer: string[] = [];
  let inCodeBlock = false;
  let blockIndex = 0;

  for (let li = 0; li < lines.length; li++) {
    const line = lines[li];

    if (line.startsWith("```")) {
      if (!inCodeBlock) {
        flushParagraph(`p-${blockIndex++}`);
        flushTable(`t-${blockIndex++}`);
        inCodeBlock = true;
        codeBuffer = [];
        codeLang = line.slice(3).trim() || "cpp";
      } else {
        elements.push(
          <CodeBlock
            key={`code-${blockIndex++}`}
            code={codeBuffer.join("\n")}
            language={codeLang}
          />,
        );
        inCodeBlock = false;
        codeBuffer = [];
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      continue;
    }

    if (line.startsWith("# ")) {
      flushParagraph(`p-${blockIndex++}`);
      flushTable(`t-${blockIndex++}`);
      elements.push(
        <h2 key={`h1-${blockIndex++}`} className={h2Class}>
          {line.slice(2)}
        </h2>,
      );
      continue;
    }

    if (line.match(/^(-{3,}|\*{3,}|_{3,})$/)) {
      flushParagraph(`p-${blockIndex++}`);
      flushTable(`t-${blockIndex++}`);
      elements.push(
        <hr key={`hr-${blockIndex++}`} className="my-4 border-border" />,
      );
      continue;
    }

    if (line.startsWith("## ")) {
      flushParagraph(`p-${blockIndex++}`);
      flushTable(`t-${blockIndex++}`);
      elements.push(
        <h3 key={`h-${blockIndex++}`} className={h3Class}>
          {line.slice(3)}
        </h3>,
      );
      continue;
    }

    if (line.startsWith("### ")) {
      flushParagraph(`p-${blockIndex++}`);
      flushTable(`t-${blockIndex++}`);
      elements.push(
        <h4
          key={`h4-${blockIndex++}`}
          className="mb-1.5 mt-3 font-heading text-[13px] font-medium text-foreground"
        >
          {line.slice(4)}
        </h4>,
      );
      continue;
    }

    if (line.match(/^\|.+\|$/)) {
      flushParagraph(`p-${blockIndex++}`);
      inTable = true;
      const cells = line.split("|").filter(Boolean);
      if (!cells[0]?.includes("---")) {
        tableRows.push(cells);
      }
      continue;
    } else if (inTable) {
      flushTable(`t-${blockIndex++}`);
    }

    if (line.match(/^- \[ \] /)) {
      flushParagraph(`p-${blockIndex++}`);
      elements.push(
        <label
          key={`chk-${blockIndex++}`}
          className="my-1 flex items-start gap-2 text-[13px] text-muted"
        >
          <input type="checkbox" disabled className="mt-1" />
          {renderInline(line.slice(6))}
        </label>,
      );
      continue;
    }

    if (line.match(/^- /)) {
      flushParagraph(`p-${blockIndex++}`);
      elements.push(
        <li key={`li-${blockIndex++}`} className={liClass}>
          {renderInline(line.slice(2))}
        </li>,
      );
      continue;
    }

    if (line.match(/^\d+\. /)) {
      flushParagraph(`p-${blockIndex++}`);
      elements.push(
        <li key={`oli-${blockIndex++}`} className="ml-4 list-decimal text-[13px] text-muted">
          {renderInline(line.replace(/^\d+\. /, ""))}
        </li>,
      );
      continue;
    }

    if (line.trim() === "") {
      flushParagraph(`p-${blockIndex++}`);
      continue;
    }

    buffer.push(line);
  }

  flushParagraph(`p-${blockIndex++}`);
  flushTable(`t-${blockIndex++}`);

  if (inCodeBlock && codeBuffer.length > 0) {
    elements.push(
      <CodeBlock
        key={`code-final`}
        code={codeBuffer.join("\n")}
        language={codeLang}
      />,
    );
  }

  return (
    <div className={cn("markdown-content", className)}>
      {elements}
    </div>
  );
}
