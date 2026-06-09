import { useAuth } from "@clerk/clerk-react";
import type React from "react";
import { useEffect } from "react";
import { setTokenProvider } from "@/lib/api/client";

/**
 * Invisible component that wires Clerk's getToken() into the apiFetch client.
 * Place inside ClerkProvider so useAuth() is available.
 */
export function AuthTokenProvider({ children }: { children: React.ReactNode }) {
  const { getToken } = useAuth();

  useEffect(() => {
    setTokenProvider(() => getToken());
  }, [getToken]);

  return <>{children}</>;
}
