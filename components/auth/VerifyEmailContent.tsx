"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, Mail } from "lucide-react";
import { AuthCard } from "@/components/auth/AuthCard";

export function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  return (
    <div className="flex min-h-[calc(100dvh-var(--nav-height))] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <AuthCard>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="text-center"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-border bg-background shadow-soft">
              <CheckCircle2 className="h-8 w-8 text-emerald-600" strokeWidth={1.5} />
            </div>
            <h1 className="mt-6 font-heading text-2xl font-medium tracking-tight">
              Verify Your Email
            </h1>
            <p className="mt-3 text-[15px] leading-relaxed text-muted">
              We&apos;ve sent a verification link to your inbox
              {email ? (
                <>
                  {" "}
                  at{" "}
                  <span className="font-medium text-foreground">{email}</span>
                </>
              ) : (
                "."
              )}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <motion.a
                href="https://mail.google.com"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="hover-glow inline-flex items-center justify-center gap-2 rounded-default border border-foreground bg-foreground px-5 py-2.5 text-[13px] font-medium text-background"
              >
                <Mail className="h-4 w-4" strokeWidth={1.75} />
                Open Gmail
              </motion.a>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-default border border-border bg-surface px-5 py-2.5 text-[13px] font-medium transition-colors hover:border-border-strong"
              >
                Back to Login
              </Link>
            </div>
          </motion.div>
        </AuthCard>
      </div>
    </div>
  );
}
