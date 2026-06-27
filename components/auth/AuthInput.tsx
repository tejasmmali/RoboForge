"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type AuthInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="space-y-1.5">
        <label
          htmlFor={inputId}
          className="block font-heading text-[11px] font-medium uppercase tracking-wider text-muted-foreground"
        >
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "w-full rounded-[12px] border border-border bg-background/80 px-4 py-2.5 text-[14px] text-foreground backdrop-blur-sm transition-all duration-200",
            "placeholder:text-muted-foreground focus:border-accent/30 focus:shadow-glow focus:outline-none",
            error && "border-red-400/60 focus:border-red-400/60",
            className,
          )}
          {...props}
        />
        {error && (
          <p className="text-[12px] text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  },
);

AuthInput.displayName = "AuthInput";
