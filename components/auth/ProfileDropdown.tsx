"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bot,
  Bookmark,
  ChevronDown,
  FolderOpen,
  LayoutDashboard,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { AvatarImage } from "@/components/ui/AvatarImage";
import { cn } from "@/lib/utils";

export function ProfileDropdown() {
  const { user, profile, signOut, loading } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (loading) {
    return (
      <div className="hidden h-9 w-9 animate-pulse rounded-full bg-border md:block" />
    );
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className="hover-glow hidden rounded-default border border-border bg-surface px-4 py-2 text-[13px] font-medium transition-colors hover:border-border-strong md:inline-flex"
      >
        Login
      </Link>
    );
  }

  const handleLogout = async () => {
    await signOut();
    setOpen(false);
    router.push("/");
    router.refresh();
  };

  const menuItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/profile", label: "My Profile", icon: User },
    { href: "/dashboard?section=saved-projects", label: "Saved Projects", icon: FolderOpen },
    { href: "/dashboard?section=ai-history", label: "AI Conversations", icon: Bot },
    { href: "/dashboard?section=components", label: "Bookmarked Components", icon: Bookmark },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div ref={ref} className="relative hidden md:block">
      <motion.button
        type="button"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full border border-border bg-surface py-1 pl-1 pr-2.5 transition-colors hover:border-border-strong"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <AvatarImage user={user} profile={profile} size="sm" className="shadow-none" />
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 text-muted transition-transform duration-200",
            open && "rotate-180",
          )}
          strokeWidth={1.75}
        />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 top-[calc(100%+8px)] z-50 w-56 overflow-hidden rounded-default border border-border bg-surface/95 shadow-elevated backdrop-blur-xl"
            role="menu"
          >
            <div className="border-b border-border px-4 py-3">
              <p className="truncate text-[13px] font-medium">
                {profile?.full_name ?? "RoboForge User"}
              </p>
              <p className="truncate text-[11px] text-muted-foreground">
                {user.email}
              </p>
            </div>
            <ul className="py-1" role="list">
              {menuItems.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-muted transition-colors hover:bg-background hover:text-foreground"
                    role="menuitem"
                  >
                    <item.icon className="h-3.5 w-3.5" strokeWidth={1.75} />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="border-t border-border p-1">
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-[13px] text-muted transition-colors hover:bg-background hover:text-foreground"
                role="menuitem"
              >
                <LogOut className="h-3.5 w-3.5" strokeWidth={1.75} />
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
