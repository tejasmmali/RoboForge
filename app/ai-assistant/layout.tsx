import type { ReactNode } from "react";

export default function AIAssistantLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 top-[var(--nav-height)] z-30 bg-background">
      {children}
    </div>
  );
}
