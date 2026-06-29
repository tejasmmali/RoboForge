"use client";

import { motion } from "framer-motion";
import { Check, Link2 } from "lucide-react";
import { SettingsCard, SettingsRow } from "@/components/settings/SettingsCard";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const providers = [
  { id: "google", label: "Google", available: true },
  { id: "github", label: "GitHub", available: false },
  { id: "azure", label: "Microsoft", available: false },
  { id: "discord", label: "Discord", available: false },
];

export function ConnectedAccounts() {
  const { user, signInWithGoogle } = useAuth();

  const linkedProvider =
    user?.app_metadata?.provider ??
    user?.identities?.[0]?.provider ??
    "email";

  return (
    <SettingsCard
      title="Connected accounts"
      description="Link OAuth providers for faster sign-in."
    >
      {providers.map((provider) => {
        const isLinked = linkedProvider === provider.id;
        const isGoogle = provider.id === "google";

        return (
          <SettingsRow
            key={provider.id}
            label={provider.label}
            description={
              provider.available
                ? isLinked
                  ? "Connected to your account"
                  : "Available to connect"
                : "Coming soon"
            }
          >
            {isLinked ? (
              <span className="flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-[12px] text-foreground">
                <Check className="h-3 w-3" strokeWidth={2} />
                Connected
              </span>
            ) : provider.available && isGoogle ? (
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => void signInWithGoogle()}
                className="flex items-center gap-1.5 rounded-[10px] border border-border px-3 py-1.5 text-[12px] font-medium text-muted hover:bg-background hover:text-foreground"
              >
                <Link2 className="h-3.5 w-3.5" strokeWidth={1.75} />
                Connect
              </motion.button>
            ) : (
              <span
                className={cn(
                  "rounded-full border border-border px-3 py-1 text-[12px]",
                  provider.available ? "text-muted" : "text-muted-foreground/60",
                )}
              >
                {provider.available ? "Not connected" : "Coming soon"}
              </span>
            )}
          </SettingsRow>
        );
      })}
    </SettingsCard>
  );
}
