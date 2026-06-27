"use client";

import { motion } from "framer-motion";
import { getPasswordStrength } from "@/lib/validations/auth";
import { cn } from "@/lib/utils";

type PasswordStrengthProps = {
  password: string;
};

export function PasswordStrength({ password }: PasswordStrengthProps) {
  if (!password) return null;

  const { score, label, color } = getPasswordStrength(password);

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      className="mt-2"
    >
      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
        <span>Password strength</span>
        <span className="font-medium text-foreground">{label}</span>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-border">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.3 }}
          className={cn("h-full rounded-full", color)}
        />
      </div>
    </motion.div>
  );
}
