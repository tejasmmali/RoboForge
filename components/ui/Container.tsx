import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ContainerProps = {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article" | "main" | "header" | "footer";
  size?: "default" | "narrow" | "wide";
};

const sizeClasses = {
  default: "max-w-[var(--container-max)]",
  narrow: "max-w-3xl",
  wide: "max-w-[1400px]",
} as const;

export function Container({
  children,
  className,
  as: Component = "div",
  size = "default",
}: ContainerProps) {
  return (
    <Component
      className={cn(
        "mx-auto w-full px-[var(--container-padding)]",
        sizeClasses[size],
        className,
      )}
    >
      {children}
    </Component>
  );
}
