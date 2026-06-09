import { ClerkProvider } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";

import { AuthTokenProvider } from "@/components/auth/auth-token-provider";
import { isClerkEnabled } from "@/lib/auth-flag";

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

export function ClerkGate({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();

  if (!isClerkEnabled) return <>{children}</>;

  if (!CLERK_PUBLISHABLE_KEY) {
    throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY");
  }

  return (
    <ClerkProvider
      publishableKey={CLERK_PUBLISHABLE_KEY}
      appearance={{ baseTheme: resolvedTheme === "dark" ? dark : undefined }}
    >
      <AuthTokenProvider>{children}</AuthTokenProvider>
    </ClerkProvider>
  );
}
