"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Camera, Loader2 } from "lucide-react";
import {
  SettingsCard,
  SettingsField,
  settingsInputClass,
  settingsTextareaClass,
} from "@/components/settings/SettingsCard";
import { useAuth } from "@/hooks/useAuth";
import { useUpdateProfile, useUploadAvatar } from "@/hooks/useProfile";
import { siteContact } from "@/lib/site-contact";
import { resolveAvatarUrl } from "@/lib/utils/avatar";
import {
  profileSettingsSchema,
  type ProfileSettingsForm,
} from "@/lib/validations/settings";

type ProfileSettingsProps = {
  onSuccess: (message: string) => void;
};

function getExtended(profile: ReturnType<typeof useAuth>["profile"]) {
  const links = (profile?.social_links ?? {}) as Record<string, string | undefined>;
  return {
    username: links.username ?? "",
    department: links.department ?? "",
    location: links.location ?? "",
    portfolio: links.portfolio ?? links.website ?? profile?.website ?? "",
  };
}

export function ProfileSettings({ onSuccess }: ProfileSettingsProps) {
  const { user, profile, refreshProfile } = useAuth();
  const updateProfile = useUpdateProfile();
  const uploadAvatar = useUploadAvatar();
  const fileRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const extended = getExtended(profile);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
  } = useForm<ProfileSettingsForm>({
    resolver: zodResolver(profileSettingsSchema),
    defaultValues: {
      full_name: profile?.full_name ?? "",
      username: extended.username,
      bio: profile?.bio ?? "",
      institution: profile?.institution ?? "",
      department: extended.department,
      course: profile?.course ?? "",
      location: extended.location,
      website: profile?.website ?? "",
      github: profile?.github ?? "",
      linkedin: profile?.linkedin ?? "",
      portfolio: extended.portfolio,
    },
  });

  const watched = watch();

  const onSubmit = handleSubmit(async (data) => {
    await updateProfile.mutateAsync({
      full_name: data.full_name,
      bio: data.bio || null,
      institution: data.institution || null,
      course: data.course || null,
      website: data.website || null,
      github: data.github || null,
      linkedin: data.linkedin || null,
      social_links: {
        username: data.username,
        department: data.department,
        location: data.location,
        portfolio: data.portfolio,
        website: data.website,
        github: data.github,
        linkedin: data.linkedin,
      },
    });
    await refreshProfile();
    onSuccess("Profile updated successfully.");
  });

  const handleAvatarChange = async (file: File) => {
    setAvatarPreview(URL.createObjectURL(file));
    await uploadAvatar.mutateAsync(file);
    await refreshProfile();
    onSuccess("Avatar updated.");
  };

  const displayName = watched.full_name || "RoboForge User";
  const avatarUrl =
    avatarPreview ?? resolveAvatarUrl(user, profile);
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <SettingsCard
        title="Profile"
        description="This information may be displayed publicly on RoboForge."
        footer={
          <motion.button
            type="submit"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            disabled={!isDirty || updateProfile.isPending}
            className="rounded-[10px] border border-foreground bg-foreground px-4 py-2 text-[13px] font-medium text-background disabled:opacity-50"
          >
            {updateProfile.isPending ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Saving…
              </span>
            ) : (
              "Save changes"
            )}
          </motion.button>
        }
      >
        <div className="grid gap-6 lg:grid-cols-[1fr_240px]">
          <div className="grid gap-4 sm:grid-cols-2">
            <SettingsField label="Full name" error={errors.full_name?.message}>
              <input className={settingsInputClass} {...register("full_name")} />
            </SettingsField>
            <SettingsField label="Username" error={errors.username?.message}>
              <input className={settingsInputClass} placeholder="@username" {...register("username")} />
            </SettingsField>
            <div className="sm:col-span-2">
              <SettingsField label="Bio" error={errors.bio?.message}>
                <textarea rows={3} className={settingsTextareaClass} {...register("bio")} />
              </SettingsField>
            </div>
            <SettingsField label="College / University" error={errors.institution?.message}>
              <input className={settingsInputClass} {...register("institution")} />
            </SettingsField>
            <SettingsField label="Department" error={errors.department?.message}>
              <input className={settingsInputClass} {...register("department")} />
            </SettingsField>
            <SettingsField label="Course" error={errors.course?.message}>
              <input className={settingsInputClass} {...register("course")} />
            </SettingsField>
            <SettingsField label="Location" error={errors.location?.message}>
              <input className={settingsInputClass} {...register("location")} />
            </SettingsField>
            <SettingsField label="Website" error={errors.website?.message}>
              <input className={settingsInputClass} placeholder="https://" {...register("website")} />
            </SettingsField>
            <SettingsField label="GitHub" error={errors.github?.message}>
              <input className={settingsInputClass} placeholder={siteContact.github} {...register("github")} />
            </SettingsField>
            <SettingsField label="LinkedIn" error={errors.linkedin?.message}>
              <input className={settingsInputClass} placeholder={siteContact.linkedin} {...register("linkedin")} />
            </SettingsField>
            <div className="sm:col-span-2">
              <SettingsField label="Portfolio" error={errors.portfolio?.message}>
                <input className={settingsInputClass} placeholder="https://" {...register("portfolio")} />
              </SettingsField>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-[12px] font-medium text-muted">Preview</p>
            <div className="rounded-default border border-border bg-background/60 p-5">
              <div className="relative mx-auto w-fit">
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarUrl} alt="" referrerPolicy="no-referrer" className="h-20 w-20 rounded-full border border-border object-cover" />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-full border border-border bg-foreground font-heading text-2xl text-background">
                    {initials}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-surface shadow-soft"
                >
                  {uploadAvatar.isPending ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Camera className="h-3.5 w-3.5" strokeWidth={1.75} />
                  )}
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void handleAvatarChange(file);
                  }}
                />
              </div>
              <div className="mt-4 text-center">
                <p className="font-heading text-[15px] font-medium">{displayName}</p>
                {watched.username ? (
                  <p className="text-[12px] text-muted">@{watched.username}</p>
                ) : null}
                {watched.bio ? (
                  <p className="mt-2 text-[12px] leading-relaxed text-muted">{watched.bio}</p>
                ) : null}
                {watched.institution ? (
                  <p className="mt-2 text-[11px] text-muted-foreground">{watched.institution}</p>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </SettingsCard>
    </form>
  );
}
