const CLERK_ENABLED = import.meta.env.VITE_CLERK_ENABLED;

export const isClerkEnabled = CLERK_ENABLED === "true";
