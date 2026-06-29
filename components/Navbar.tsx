"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Bot, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ProfileDropdown } from "@/components/auth/ProfileDropdown";
import { Container } from "@/components/ui/Container";
import { navItemVariants } from "@/lib/animations";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/projects", label: "Projects" },
  { href: "/components", label: "Components" },
  { href: "/chatbot", label: "AI Assistant" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-transparent transition-all duration-300",
        isScrolled && "border-border bg-background/80 shadow-soft backdrop-blur-md",
      )}
    >
      <Container>
        <nav
          className="flex h-[var(--nav-height)] items-center justify-between"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <Link
            href="/"
            className="group flex items-center gap-2.5 rounded-default px-1 py-1 transition-opacity hover:opacity-80"
            aria-label="RoboForge home"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-[12px] border border-border bg-surface shadow-soft transition-shadow group-hover:shadow-glow">
              <Bot className="h-4 w-4 text-foreground" strokeWidth={1.75} />
            </span>
            <span className="font-heading text-[15px] font-medium tracking-tight">
              RoboForge
            </span>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden items-center gap-1 md:flex" role="list">
            {navLinks.map((link, index) => {
              const isActive =
                pathname === link.href || pathname.startsWith(`${link.href}/`);

              return (
                <motion.li
                  key={link.href}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  variants={navItemVariants}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      "link-underline rounded-default px-3.5 py-2 text-[13px] font-medium transition-colors",
                      isActive
                        ? "text-foreground"
                        : "text-muted hover:text-foreground",
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {link.label}
                  </Link>
                </motion.li>
              );
            })}
          </ul>

          {/* Desktop auth + CTA */}
          <div className="hidden items-center gap-3 md:flex">
            <ProfileDropdown />
            <Link
              href="/projects"
              className="hover-glow inline-flex items-center rounded-default border border-border bg-foreground px-4 py-2 text-[13px] font-medium text-background transition-colors hover:bg-foreground/90"
            >
              Start Building
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-default border border-border bg-surface transition-colors hover:border-border-strong md:hidden"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? (
              <X className="h-4 w-4" strokeWidth={1.75} />
            ) : (
              <Menu className="h-4 w-4" strokeWidth={1.75} />
            )}
          </button>
        </nav>
      </Container>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-border bg-background md:hidden"
          >
            <Container className="py-4">
              <ul className="flex flex-col gap-1" role="list">
                {navLinks.map((link) => {
                  const isActive =
                    pathname === link.href ||
                    pathname.startsWith(`${link.href}/`);

                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className={cn(
                          "flex items-center rounded-default px-3 py-3 text-[15px] font-medium transition-colors",
                          isActive
                            ? "bg-surface text-foreground shadow-soft"
                            : "text-muted hover:bg-surface hover:text-foreground",
                        )}
                        aria-current={isActive ? "page" : undefined}
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-4 space-y-2 border-t border-border pt-4">
                <Link
                  href="/login"
                  className="flex w-full items-center justify-center rounded-default border border-border bg-surface px-4 py-3 text-[14px] font-medium text-foreground"
                >
                  Login
                </Link>
                <Link
                  href="/projects"
                  className="hover-glow flex w-full items-center justify-center rounded-default border border-border bg-foreground px-4 py-3 text-[14px] font-medium text-background"
                >
                  Start Building
                </Link>
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
