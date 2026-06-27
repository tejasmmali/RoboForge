"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2 } from "lucide-react";
import { AuthInput } from "@/components/auth/AuthInput";
import { useAuth } from "@/hooks/useAuth";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "@/lib/validations/auth";

export function ForgotPasswordForm() {
  const { resetPassword } = useAuth();
  const [success, setSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setFormError(null);
    const { error } = await resetPassword(values.email);
    if (error) {
      setFormError(error);
      return;
    }
    setSuccess(true);
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" strokeWidth={1.5} />
        <h2 className="mt-4 font-heading text-xl font-medium">Check your inbox</h2>
        <p className="mt-2 text-[14px] text-muted">
          We&apos;ve sent a password reset link to your email address.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-block text-[13px] font-medium text-foreground hover:text-accent"
        >
          Back to Login
        </Link>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <AuthInput
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        error={errors.email?.message}
        {...register("email")}
      />

      {formError && (
        <p className="rounded-[12px] border border-red-200 bg-red-50 px-3 py-2 text-[13px] text-red-700">
          {formError}
        </p>
      )}

      <motion.button
        type="submit"
        disabled={isSubmitting}
        whileHover={{ scale: isSubmitting ? 1 : 1.01 }}
        className="hover-glow flex w-full items-center justify-center gap-2 rounded-default border border-foreground bg-foreground py-3 text-[14px] font-medium text-background disabled:opacity-60"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending…
          </>
        ) : (
          "Send Reset Link"
        )}
      </motion.button>

      <p className="text-center text-[13px] text-muted">
        <Link href="/login" className="font-medium text-foreground hover:text-accent">
          ← Back to Login
        </Link>
      </p>
    </form>
  );
}
