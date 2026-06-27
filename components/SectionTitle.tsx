import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionTitleProps = {
  children: ReactNode;
  subtitle?: string;
  className?: string;
  align?: "left" | "center";
};

export function SectionTitle({
  children,
  subtitle,
  className,
  align = "left",
}: SectionTitleProps) {
  return (
    <div
      className={cn(
        "mb-12 md:mb-16",
        align === "center" && "text-center",
        className,
      )}
    >
      <h2 className="font-heading text-balance text-3xl font-medium tracking-tight md:text-4xl lg:text-[2.75rem]">
        {children}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "mt-4 max-w-2xl text-[15px] leading-relaxed text-muted",
            align === "center" && "mx-auto",
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
