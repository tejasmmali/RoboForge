import type { Transition, Variants } from "framer-motion";

/* ─── Easing Curves ─────────────────────────────────────────────── */
export const easeOut = [0.16, 1, 0.3, 1] as const;
export const easeInOut = [0.65, 0, 0.35, 1] as const;

/* ─── Base Transitions ──────────────────────────────────────────── */
export const transitionFast: Transition = {
  duration: 0.2,
  ease: easeOut,
};

export const transitionBase: Transition = {
  duration: 0.4,
  ease: easeOut,
};

export const transitionSlow: Transition = {
  duration: 0.6,
  ease: easeOut,
};

export const transitionSpring: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
};

/* ─── Page Transitions ──────────────────────────────────────────── */
export const pageVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 12,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: easeOut,
      when: "beforeChildren",
      staggerChildren: 0.08,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: 0.25,
      ease: easeInOut,
    },
  },
};

/* ─── Fade Animations ───────────────────────────────────────────── */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: transitionBase,
  },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitionBase,
  },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitionBase,
  },
};

/* ─── Scale Animations ──────────────────────────────────────────── */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: transitionBase,
  },
};

/* ─── Stagger Containers ────────────────────────────────────────── */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitionBase,
  },
};

/* ─── Hover Interactions ────────────────────────────────────────── */
export const hoverLift = {
  rest: { y: 0, scale: 1 },
  hover: {
    y: -4,
    scale: 1.01,
    transition: transitionFast,
  },
};

export const hoverGlow = {
  rest: {
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.03)",
  },
  hover: {
    boxShadow:
      "0 0 0 1px rgba(37, 99, 235, 0.08), 0 4px 20px rgba(37, 99, 235, 0.12)",
    transition: transitionFast,
  },
};

/* ─── Navbar Animations ─────────────────────────────────────────── */
export const navItemVariants: Variants = {
  hidden: { opacity: 0, y: -8 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.35,
      ease: easeOut,
    },
  }),
};

/* ─── Utility: Stagger Delay Calculator ─────────────────────────── */
export function staggerDelay(index: number, baseDelay = 0.1): number {
  return baseDelay + index * 0.08;
}

/* ─── Viewport Config for Scroll Animations ─────────────────────── */
export const viewportOnce = {
  once: true,
  margin: "-80px" as const,
  amount: 0.2 as const,
};
