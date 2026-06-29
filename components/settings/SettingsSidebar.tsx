"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import {
  settingsNavItems,
  type SettingsSection,
} from "@/components/settings/settings-nav";
import { cn } from "@/lib/utils";

type SettingsSidebarProps = {
  active: SettingsSection;
  onChange: (section: SettingsSection) => void;
  mobileOpen: boolean;
  onMobileOpenChange: (open: boolean) => void;
};

function NavList({
  active,
  onChange,
  onNavigate,
}: {
  active: SettingsSection;
  onChange: (section: SettingsSection) => void;
  onNavigate?: () => void;
}) {
  return (
    <nav className="space-y-0.5 p-2" aria-label="Settings">
      {settingsNavItems.map((item) => {
        const Icon = item.icon;
        const isActive = active === item.id;
        const isDanger = item.id === "danger";

        return (
          <motion.button
            key={item.id}
            type="button"
            whileHover={{ x: isActive ? 0 : 2 }}
            onClick={() => {
              onChange(item.id);
              onNavigate?.();
            }}
            className={cn(
              "flex w-full items-center gap-2.5 rounded-[12px] px-3 py-2.5 text-left transition-colors",
              isActive && !isDanger && "bg-background shadow-soft",
              isActive && isDanger && "bg-red-50 shadow-soft",
              !isActive && "hover:bg-background/70",
            )}
          >
            <Icon
              className={cn(
                "h-4 w-4 shrink-0",
                isDanger ? "text-red-600" : isActive ? "text-foreground" : "text-muted",
              )}
              strokeWidth={1.75}
            />
            <div className="min-w-0">
              <p
                className={cn(
                  "text-[13px] font-medium",
                  isDanger ? "text-red-700" : isActive ? "text-foreground" : "text-muted",
                )}
              >
                {item.label}
              </p>
            </div>
          </motion.button>
        );
      })}
    </nav>
  );
}

export function SettingsSidebar({
  active,
  onChange,
  mobileOpen,
  onMobileOpenChange,
}: SettingsSidebarProps) {
  return (
    <>
      <button
        type="button"
        onClick={() => onMobileOpenChange(true)}
        className="mb-4 flex items-center gap-2 rounded-[12px] border border-border bg-surface px-3 py-2 text-[13px] font-medium text-muted lg:hidden"
      >
        <Menu className="h-4 w-4" strokeWidth={1.75} />
        Settings menu
      </button>

      <aside className="hidden lg:block">
        <div className="sticky top-24 rounded-default border border-border bg-surface/90 shadow-soft backdrop-blur-md">
          <div className="border-b border-border px-4 py-4">
            <p className="font-heading text-[14px] font-medium">Settings</p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              Manage your RoboForge account
            </p>
          </div>
          <NavList active={active} onChange={onChange} />
        </div>
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-foreground/25 backdrop-blur-sm lg:hidden"
              onClick={() => onMobileOpenChange(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-y-0 left-0 z-50 flex w-[min(300px,88vw)] flex-col border-r border-border bg-surface/95 shadow-elevated backdrop-blur-xl lg:hidden"
              style={{ top: "var(--nav-height)" }}
            >
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <p className="font-heading text-[14px] font-medium">Settings</p>
                <button
                  type="button"
                  onClick={() => onMobileOpenChange(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-[8px] border border-border"
                  aria-label="Close menu"
                >
                  <X className="h-4 w-4" strokeWidth={1.75} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <NavList
                  active={active}
                  onChange={onChange}
                  onNavigate={() => onMobileOpenChange(false)}
                />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
