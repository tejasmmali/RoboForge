"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Monitor, Smartphone } from "lucide-react";
import {
  SettingsCard,
  SettingsField,
  SettingsRow,
  settingsInputClass,
} from "@/components/settings/SettingsCard";
import { useAuth } from "@/hooks/useAuth";
import {
  passwordChangeSchema,
  type PasswordChangeForm,
} from "@/lib/validations/settings";

type SecuritySettingsProps = {
  onSuccess: (message: string) => void;
};

export function SecuritySettings({ onSuccess }: SecuritySettingsProps) {
  const { updatePassword, signOut } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordChangeForm>({
    resolver: zodResolver(passwordChangeSchema),
  });

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);
    setError(null);
    const result = await updatePassword(data.newPassword);
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    reset();
    onSuccess("Password updated successfully.");
  });

  return (
    <div className="space-y-6">
      <SettingsCard title="Change password" description="Update your account password.">
        <form onSubmit={onSubmit} className="grid max-w-md gap-4">
          <SettingsField label="Current password" error={errors.currentPassword?.message}>
            <input type="password" className={settingsInputClass} {...register("currentPassword")} />
          </SettingsField>
          <SettingsField label="New password" error={errors.newPassword?.message}>
            <input type="password" className={settingsInputClass} {...register("newPassword")} />
          </SettingsField>
          <SettingsField label="Confirm password" error={errors.confirmPassword?.message}>
            <input type="password" className={settingsInputClass} {...register("confirmPassword")} />
          </SettingsField>
          {error ? <p className="text-[12px] text-red-600">{error}</p> : null}
          <button
            type="submit"
            disabled={loading}
            className="w-fit rounded-[10px] border border-foreground bg-foreground px-4 py-2 text-[13px] font-medium text-background disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Updating…
              </span>
            ) : (
              "Update password"
            )}
          </button>
        </form>
      </SettingsCard>

      <SettingsCard title="Two-factor authentication" description="Add an extra layer of security.">
        <div className="rounded-[12px] border border-dashed border-border bg-background/50 p-4 text-[13px] text-muted">
          Two-factor authentication is coming soon. You will be able to use an authenticator app.
        </div>
      </SettingsCard>

      <SettingsCard title="Recent login sessions">
        <SettingsRow label="Current device" description="This browser session">
          <span className="flex items-center gap-1.5 text-[13px] text-foreground">
            <Monitor className="h-3.5 w-3.5" strokeWidth={1.75} />
            Active now
          </span>
        </SettingsRow>
        <SettingsRow label="Other devices" description="No other active sessions detected">
          <span className="flex items-center gap-1.5 text-[13px] text-muted">
            <Smartphone className="h-3.5 w-3.5" strokeWidth={1.75} />
            None
          </span>
        </SettingsRow>
        <button
          type="button"
          onClick={() => void signOut()}
          className="mt-2 rounded-[10px] border border-border px-4 py-2 text-[13px] font-medium text-muted hover:bg-background hover:text-foreground"
        >
          Log out from all devices
        </button>
      </SettingsCard>
    </div>
  );
}
