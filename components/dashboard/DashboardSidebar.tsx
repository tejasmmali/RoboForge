"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, Menu, User, X } from "lucide-react";
import {
  dashboardNavItems,
  type DashboardSection,
} from "@/components/dashboard/dashboard-nav";
import { cn } from "@/lib/utils";

type DashboardSidebarProps = {
  active: DashboardSection;
  onChange: (section: DashboardSection) => void;
  className?: string;
};

function SidebarContent({
  active,
  onChange,
  onNavigate,
}: {
  active: DashboardSection;
  onChange: (section: DashboardSection) => void;
  onNavigate?: () => void;
}) {
  return (
    <>
      <div className="border-b border-border px-5 py-6">
        <Link
          href="/dashboard"
          className="font-heading text-[15px] font-medium tracking-tight"
          onClick={onNavigate}
        >
          Dashboard
        </Link>
        <p className="mt-1 text-[11px] text-muted-foreground">
          Your robotics workspace
        </p>
      </div>
      <nav className="flex-1 overflow-y-auto overscroll-contain p-3">
        <ul className="space-y-1" role="list">
          {dashboardNavItems.map((item) => {
            const isActive = active === item.id;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(item.id);
                    onNavigate?.();
                  }}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-[12px] px-3.5 py-2.5 text-left text-[13px] transition-colors",
                    isActive
                      ? "bg-foreground text-background shadow-soft"
                      : "text-muted hover:bg-background hover:text-foreground",
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="border-t border-border p-3">
        <Link
          href="/profile"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-[12px] px-3.5 py-2.5 text-[13px] text-muted transition-colors hover:bg-background hover:text-foreground"
        >
          <User className="h-4 w-4" strokeWidth={1.75} />
          Profile
        </Link>
        <button
          type="button"
          onClick={() => {
            onChange("overview");
            onNavigate?.();
          }}
          className="flex w-full items-center gap-3 rounded-[12px] px-3.5 py-2.5 text-[13px] text-muted transition-colors hover:bg-background hover:text-foreground"
        >
          <Bell className="h-4 w-4" strokeWidth={1.75} />
          Notifications
        </button>
      </div>
    </>
  );
}

export function DashboardSidebar({
  active,
  onChange,
  className,
}: DashboardSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <div className="relative min-h-0 h-full">
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="fixed bottom-6 left-6 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface shadow-elevated backdrop-blur-xl lg:hidden"
        aria-label="Open dashboard menu"
      >
        <Menu className="h-5 w-5" strokeWidth={1.75} />
      </button>

      <aside
        className={cn(
          "hidden h-full min-h-0 w-full shrink-0 flex-col overflow-hidden rounded-default border border-border bg-surface/95 shadow-soft backdrop-blur-md lg:flex",
          className,
        )}
      >
        <SidebarContent active={active} onChange={onChange} />
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-surface/95 shadow-elevated backdrop-blur-xl lg:hidden"
            >
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="absolute right-4 top-4 rounded-[10px] p-1.5 text-muted hover:bg-background hover:text-foreground"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" strokeWidth={1.75} />
              </button>
              <SidebarContent
                active={active}
                onChange={onChange}
                onNavigate={() => setMobileOpen(false)}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
