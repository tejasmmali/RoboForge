export type UserRole = "student" | "instructor" | "admin";

export type SocialLinks = {
  github?: string;
  linkedin?: string;
  website?: string;
  twitter?: string;
  username?: string;
  department?: string;
  location?: string;
  portfolio?: string;
};

export type UserProfile = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  institution: string | null;
  course: string | null;
  github: string | null;
  linkedin: string | null;
  website: string | null;
  social_links: SocialLinks | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
};

export type ProfileUpdateInput = {
  full_name?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  institution?: string | null;
  course?: string | null;
  github?: string | null;
  linkedin?: string | null;
  website?: string | null;
  social_links?: SocialLinks | null;
  role?: UserRole;
};

export type ProfileInsert = Pick<
  UserProfile,
  "id" | "email" | "full_name" | "avatar_url" | "role"
> & Partial<ProfileUpdateInput>;

export type AuthUser = {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  emailConfirmed: boolean;
  createdAt: string;
};
