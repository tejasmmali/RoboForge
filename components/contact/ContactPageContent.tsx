"use client";

import { motion } from "framer-motion";
import {
  Clock,
  Github,
  Linkedin,
  Mail,
  MapPin,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import { ContactForm } from "@/components/contact/ContactForm";
import { siteContact } from "@/lib/site-contact";
import { BlueprintGrid, TechLabel } from "@/components/visuals/LabDecor";

const contactDetails = [
  {
    icon: Mail,
    label: "Email",
    value: siteContact.email,
    href: siteContact.mailto,
  },
  {
    icon: Clock,
    label: "Response time",
    value: "Within 1–2 business days",
  },
  {
    icon: MapPin,
    label: "Based in",
    value: "India · Remote-first",
  },
] as const;

const socialLinks = [
  { icon: Github, label: "GitHub", href: siteContact.github },
  { icon: Linkedin, label: "LinkedIn", href: siteContact.linkedin },
] as const;

export function ContactPageContent() {
  return (
    <div className="flex min-h-[calc(100dvh-var(--nav-height))] flex-col lg:flex-row">
      {/* Left panel */}
      <aside className="relative border-b border-border bg-surface/40 lg:w-[42%] lg:max-w-xl lg:border-b-0 lg:border-r">
        <BlueprintGrid size={40} opacity={0.14} className="pointer-events-none" />
        <div className="relative flex h-full flex-col justify-between px-6 py-12 md:px-10 lg:px-12 lg:py-16 xl:px-16">
          <TechLabel coord="CNT-01">Contact</TechLabel>

          <div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-3.5 py-1.5 font-heading text-[11px] font-medium uppercase tracking-wider text-muted backdrop-blur-sm">
                <MessageSquare className="h-3.5 w-3.5" strokeWidth={1.75} />
                Get in touch
              </span>

              <h1 className="font-heading text-3xl font-medium tracking-tight md:text-4xl">
                We&apos;d love to hear from you
              </h1>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted">
                Questions about projects, feedback on the platform, partnership
                ideas, or bug reports — send us a message and we&apos;ll respond
                as soon as we can.
              </p>
            </motion.div>

            <ul className="mt-10 space-y-4" role="list">
              {contactDetails.map((item, index) => (
                <motion.li
                  key={item.label}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 + index * 0.06 }}
                  className="flex items-start gap-3"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border border-border bg-background">
                    <item.icon className="h-4 w-4 text-muted" strokeWidth={1.75} />
                  </span>
                  <div>
                    <p className="font-heading text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                      {item.label}
                    </p>
                    {"href" in item ? (
                      <a
                        href={item.href}
                        className="mt-0.5 text-[14px] font-medium transition-colors hover:text-accent"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="mt-0.5 text-[14px] font-medium">{item.value}</p>
                    )}
                  </div>
                </motion.li>
              ))}
            </ul>

            <div className="mt-8 flex items-center gap-2">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className="hover-glow flex h-9 w-9 items-center justify-center rounded-default border border-border bg-background text-muted transition-colors hover:text-foreground"
                >
                  <link.icon className="h-4 w-4" strokeWidth={1.75} />
                </a>
              ))}
            </div>
          </div>

          <TechLabel className="mt-10 hidden lg:block">
            Support · Feedback · Partnerships
          </TechLabel>
        </div>
      </aside>

      {/* Right — form */}
      <div className="flex flex-1 items-center justify-center px-6 py-12 md:px-10 lg:px-12 xl:px-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-lg"
        >
          <div className="mb-8 lg:hidden">
            <h2 className="font-heading text-2xl font-medium tracking-tight">
              Send a message
            </h2>
            <p className="mt-2 text-[14px] text-muted">
              Fill out the form and we&apos;ll get back to you shortly.
            </p>
          </div>

          <div className="hidden lg:block">
            <h2 className="font-heading text-2xl font-medium tracking-tight">
              Send a message
            </h2>
            <p className="mt-2 text-[14px] text-muted">
              All fields are required. Your message is delivered securely via
              Web3Forms.
            </p>
          </div>

          <div className="mt-8 rounded-default border border-border bg-surface/80 p-6 backdrop-blur-sm md:p-8">
            <ContactForm />
          </div>

          <p className="mt-6 text-center text-[12px] text-muted-foreground">
            Prefer email?{" "}
            <Link href={siteContact.mailto} className="text-foreground hover:text-accent">
              {siteContact.email}
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
