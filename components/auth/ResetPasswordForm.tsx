"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2 } from "lucide-react";
import { AuthInput } from "@/components/auth/AuthInput";
import { PasswordStrength } from "@/components/auth/PasswordStrength";
import { useAuth } from "@/hooks/useAuth";
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "@/lib/validations/auth";

export function ResetPasswordForm() {
  const router = useRouter();
  const { updatePassword } = useAuth();
  const [success, setSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const password = watch("password", "");

  const onSubmit = async (values: ResetPasswordFormValues) => {
    setFormError(null);
    const { error } = await updatePassword(values.password);
    if (error) {
      setFormError(error);
      return;
    }
    setSuccess(true);
    setTimeout(() => router.push("/login"), 2500);
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" strokeWidth={1.5} />
        <h2 className="mt-4 font-heading text-xl font-medium">Password updated</h2>
        <p className="mt-2 text-[14px] text-muted">
          Redirecting you to login…
        </p>
        <Link
          href="/login"
          className="mt-6 inline-block text-[13px] font-medium text-foreground hover:text-accent"
        >
          Go to Login
        </Link>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <AuthInput
          label="New Password"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register("password")}
        />
        <PasswordStrength password={password} />
      </div>

      <AuthInput
        label="Confirm Password"
        type="password"
        autoComplete="new-password"
        placeholder="••••••••"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
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
            Updating…
          </>
        ) : (
          "Update Password"
        )}
      </motion.button>
    </form>
  );
}
