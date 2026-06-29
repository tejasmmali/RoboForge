import { Bot, Github, Linkedin, Mail } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { siteContact } from "@/lib/site-contact";

const footerLinks = {
  platform: [
    { href: "/projects", label: "Projects" },
    { href: "/components", label: "Components" },
    { href: "/chatbot", label: "AI Assistant" },
  ],
  company: [
    { href: "/about", label: "About" },
    { href: "/about#team", label: "Team" },
    { href: "/contact", label: "Contact" },
  ],
  resources: [
    { href: "/projects", label: "Getting Started" },
    { href: "/components", label: "Parts Guide" },
    { href: "/chatbot", label: "Ask AI" },
  ],
} as const;

const socialLinks = [
  {
    href: siteContact.github,
    label: "GitHub",
    icon: Github,
  },
  {
    href: siteContact.linkedin,
    label: "LinkedIn",
    icon: Linkedin,
  },
  {
    href: siteContact.mailto,
    label: "Email",
    icon: Mail,
  },
] as const;

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border bg-surface/50">
      <Container className="py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 transition-opacity hover:opacity-80"
              aria-label="RoboForge home"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-[12px] border border-border bg-background shadow-soft">
                <Bot className="h-4 w-4 text-foreground" strokeWidth={1.75} />
              </span>
              <span className="font-heading text-[15px] font-medium tracking-tight">
                RoboForge
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-[14px] leading-relaxed text-muted">
              A robotics education platform for students. Learn by building
              real projects with guided lessons and AI-powered support.
            </p>

            {/* Social */}
            <ul className="mt-6 flex items-center gap-2" role="list">
              {socialLinks.map(({ href, label, icon: Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="hover-glow flex h-9 w-9 items-center justify-center rounded-default border border-border bg-background text-muted transition-colors hover:text-foreground"
                    aria-label={label}
                  >
                    <Icon className="h-4 w-4" strokeWidth={1.75} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Link Columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-5 lg:col-start-6">
            <div>
              <h3 className="font-heading text-[12px] font-medium uppercase tracking-wider text-muted-foreground">
                Platform
              </h3>
              <ul className="mt-4 flex flex-col gap-2.5" role="list">
                {footerLinks.platform.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[14px] text-muted transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-heading text-[12px] font-medium uppercase tracking-wider text-muted-foreground">
                Company
              </h3>
              <ul className="mt-4 flex flex-col gap-2.5" role="list">
                {footerLinks.company.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[14px] text-muted transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-heading text-[12px] font-medium uppercase tracking-wider text-muted-foreground">
                Resources
              </h3>
              <ul className="mt-4 flex flex-col gap-2.5" role="list">
                {footerLinks.resources.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[14px] text-muted transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-[13px] text-muted-foreground">
            © {currentYear} RoboForge. Built for robotics education.
          </p>
          <p className="text-[13px] text-muted-foreground">
            Component links redirect to external retailers. No checkout on this
            site.
          </p>
        </div>
      </Container>
    </footer>
  );
}
