"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { AuthInput } from "@/components/auth/AuthInput";
import { GitHubButtonComingSoon, GoogleButton } from "@/components/auth/GoogleButton";
import { PasswordStrength } from "@/components/auth/PasswordStrength";
import { useAuth } from "@/hooks/useAuth";
import {
  signupSchema,
  type SignupFormValues,
} from "@/lib/validations/auth";

export function SignupForm() {
  const router = useRouter();
  const { signUp, signInWithGoogle } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { acceptTerms: false },
  });

  const password = watch("password", "");

  const onSubmit = async (values: SignupFormValues) => {
    setFormError(null);
    const { error, needsVerification } = await signUp(
      values.email,
      values.password,
      values.fullName,
    );
    if (error) {
      setFormError(error);
      return;
    }
    if (needsVerification) {
      router.push(`/verify-email?email=${encodeURIComponent(values.email)}`);
    } else {
      router.push("/profile");
      router.refresh();
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    const { error } = await signInWithGoogle();
    if (error) {
      setFormError(error);
      setGoogleLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <AuthInput
        label="Full Name"
        autoComplete="name"
        placeholder="Your full name"
        error={errors.fullName?.message}
        {...register("fullName")}
      />

      <AuthInput
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        error={errors.email?.message}
        {...register("email")}
      />

      <div>
        <div className="relative">
          <AuthInput
            label="Password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="••••••••"
            error={errors.password?.message}
            className="pr-11"
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-3 top-[34px] text-muted transition-colors hover:text-foreground"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" strokeWidth={1.75} />
            ) : (
              <Eye className="h-4 w-4" strokeWidth={1.75} />
            )}
          </button>
        </div>
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

      <label className="flex items-start gap-2.5 text-[13px] text-muted">
        <input
          type="checkbox"
          className="mt-0.5 rounded border-border"
          {...register("acceptTerms")}
        />
        <span>
          I agree to the{" "}
          <Link href="/about" className="text-foreground underline-offset-2 hover:underline">
            Terms
          </Link>{" "}
          &{" "}
          <Link href="/about" className="text-foreground underline-offset-2 hover:underline">
            Privacy Policy
          </Link>
        </span>
      </label>
      {errors.acceptTerms && (
        <p className="text-[12px] text-red-600">{errors.acceptTerms.message}</p>
      )}

      {formError && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[12px] border border-red-200 bg-red-50 px-3 py-2 text-[13px] text-red-700"
          role="alert"
        >
          {formError}
        </motion.p>
      )}

      <motion.button
        type="submit"
        disabled={isSubmitting}
        whileHover={{ scale: isSubmitting ? 1 : 1.01 }}
        whileTap={{ scale: isSubmitting ? 1 : 0.99 }}
        className="hover-glow flex w-full items-center justify-center gap-2 rounded-default border border-foreground bg-foreground py-3 text-[14px] font-medium text-background disabled:opacity-60"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Creating account…
          </>
        ) : (
          "Create Account"
        )}
      </motion.button>

      <div className="relative py-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-surface/80 px-3 text-[11px] uppercase tracking-wider text-muted-foreground">
            Or
          </span>
        </div>
      </div>

      <GoogleButton onClick={handleGoogle} loading={googleLoading} label="Sign up with Google" />
      <GitHubButtonComingSoon />

      <p className="pt-2 text-center text-[13px] text-muted">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-foreground transition-colors hover:text-accent"
        >
          Sign In →
        </Link>
      </p>
    </form>
  );
}
