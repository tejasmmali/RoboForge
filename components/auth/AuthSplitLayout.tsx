"use client";

import type { ReactNode } from "react";
import { AuthBrandPanel } from "@/components/auth/AuthBrandPanel";
import { AuthCard } from "@/components/auth/AuthCard";

type AuthSplitLayoutProps = {
  children: ReactNode;
  brandHeading?: string;
  brandSubtitle?: string;
  cardTitle?: string;
  cardSubtitle?: string;
  centered?: boolean;
};

export function AuthSplitLayout({
  children,
  brandHeading,
  brandSubtitle,
  cardTitle,
  cardSubtitle,
  centered = false,
}: AuthSplitLayoutProps) {
  if (centered) {
    return (
      <div className="flex min-h-[calc(100dvh-var(--nav-height))] items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <AuthCard title={cardTitle} subtitle={cardSubtitle}>
            {children}
          </AuthCard>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100dvh-var(--nav-height))]">
      <AuthBrandPanel heading={brandHeading} subtitle={brandSubtitle} />
      <div className="flex flex-1 items-center justify-center px-4 py-12 md:px-8 lg:px-12">
        <div className="w-full max-w-md">
          <AuthCard title={cardTitle} subtitle={cardSubtitle}>
            {children}
          </AuthCard>
        </div>
      </div>
    </div>
  );
}
