"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { AuthInput } from "@/components/auth/AuthInput";
import {
  contactFormSchema,
  type ContactFormValues,
} from "@/lib/validations/contact";
import { cn } from "@/lib/utils";

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (values: ContactFormValues) => {
    const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
    if (!accessKey) {
      setStatus("error");
      setErrorMessage("Contact form is not configured. Please try again later.");
      return;
    }

    setStatus("idle");
    setErrorMessage(null);

    try {
      const response = await fetch(WEB3FORMS_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: accessKey,
          name: values.name,
          email: values.email,
          subject: values.subject,
          message: values.message,
          from_name: "RoboForge Contact",
        }),
      });

      const data = (await response.json()) as { success?: boolean; message?: string };

      if (!response.ok || !data.success) {
        throw new Error(data.message ?? "Failed to send message.");
      }

      setStatus("success");
      reset();
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong. Please try again.",
      );
    }
  };

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-default border border-border bg-surface/80 p-8 text-center backdrop-blur-sm md:p-10"
      >
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-accent/30 bg-accent/5">
          <CheckCircle2 className="h-6 w-6 text-accent" strokeWidth={1.75} />
        </span>
        <h2 className="mt-5 font-heading text-xl font-medium tracking-tight">
          Message sent
        </h2>
        <p className="mt-2 text-[14px] text-muted">
          Thanks for reaching out. We&apos;ll get back to you as soon as we can.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 text-[13px] font-medium text-accent transition-colors hover:text-accent/80"
        >
          Send another message
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <AuthInput
          label="Name"
          autoComplete="name"
          placeholder="Your name"
          error={errors.name?.message}
          {...register("name")}
        />
        <AuthInput
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register("email")}
        />
      </div>

      <AuthInput
        label="Subject"
        placeholder="How can we help?"
        error={errors.subject?.message}
        {...register("subject")}
      />

      <div className="space-y-1.5">
        <label
          htmlFor="contact-message"
          className="block font-heading text-[11px] font-medium uppercase tracking-wider text-muted-foreground"
        >
          Message
        </label>
        <textarea
          id="contact-message"
          rows={6}
          placeholder="Tell us about your question, feedback, or project idea…"
          className={cn(
            "w-full resize-y rounded-[12px] border border-border bg-background/80 px-4 py-3 text-[14px] text-foreground backdrop-blur-sm transition-all duration-200",
            "placeholder:text-muted-foreground focus:border-accent/30 focus:shadow-glow focus:outline-none",
            errors.message && "border-red-400/60 focus:border-red-400/60",
          )}
          {...register("message")}
        />
        {errors.message && (
          <p className="text-[12px] text-red-600" role="alert">
            {errors.message.message}
          </p>
        )}
      </div>

      {errorMessage && (
        <p className="rounded-[12px] border border-red-400/30 bg-red-50 px-4 py-3 text-[13px] text-red-700" role="alert">
          {errorMessage}
        </p>
      )}

      <motion.button
        type="submit"
        disabled={isSubmitting}
        whileHover={{ scale: isSubmitting ? 1 : 1.01 }}
        whileTap={{ scale: isSubmitting ? 1 : 0.99 }}
        className="hover-glow inline-flex w-full items-center justify-center gap-2 rounded-default border border-foreground bg-foreground px-5 py-3 text-[14px] font-medium text-background transition-colors disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.75} />
            Sending…
          </>
        ) : (
          <>
            <Send className="h-4 w-4" strokeWidth={1.75} />
            Send message
          </>
        )}
      </motion.button>
    </form>
  );
}
