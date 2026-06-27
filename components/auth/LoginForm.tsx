"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { AuthInput } from "@/components/auth/AuthInput";
import { GitHubButtonComingSoon, GoogleButton } from "@/components/auth/GoogleButton";
import { useAuth } from "@/hooks/useAuth";
import {
  loginSchema,
  type LoginFormValues,
} from "@/lib/validations/auth";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/profile";
  const { signIn, signInWithGoogle } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { rememberMe: true },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setFormError(null);
    const { error } = await signIn(values.email, values.password);
    if (error) {
      setFormError(error);
      return;
    }
    router.push(redirect);
    router.refresh();
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    setFormError(null);
    const { error } = await signInWithGoogle();
    if (error) {
      setFormError(error);
      setGoogleLoading(false);
    }
  };

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

      <div className="space-y-1.5">
        <div className="relative">
          <AuthInput
            label="Password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
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
      </div>

      <div className="flex items-center justify-between text-[13px]">
        <label className="flex items-center gap-2 text-muted">
          <input
            type="checkbox"
            className="rounded border-border"
            {...register("rememberMe")}
          />
          Remember me
        </label>
        <Link
          href="/forgot-password"
          className="font-medium text-foreground transition-colors hover:text-accent"
        >
          Forgot password?
        </Link>
      </div>

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
            Signing in…
          </>
        ) : (
          "Sign In"
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

      <GoogleButton onClick={handleGoogle} loading={googleLoading} />
      <GitHubButtonComingSoon />

      <p className="pt-2 text-center text-[13px] text-muted">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="font-medium text-foreground transition-colors hover:text-accent"
        >
          Create Account →
        </Link>
      </p>
    </form>
  );
}
