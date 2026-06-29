export const siteContact = {
  email: "tejasmali@mail.com",
  mailto: "mailto:tejasmali@mail.com",
  github: "https://github.com/tejasmmali/RoboForge",
  linkedin: "https://www.linkedin.com/in/tejasmmali/",
} as const;

export const siteSocialLinks = [
  {
    href: siteContact.github,
    label: "GitHub",
    key: "github",
  },
  {
    href: siteContact.linkedin,
    label: "LinkedIn",
    key: "linkedin",
  },
  {
    href: siteContact.mailto,
    label: "Email",
    key: "email",
  },
] as const;
