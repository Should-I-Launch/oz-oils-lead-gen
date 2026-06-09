import { useUser } from "@clerk/clerk-react";

export function hasAdminRole(publicMetadata: Record<string, unknown> | undefined | null): boolean {
  return publicMetadata?.role === "admin";
}

export function useIsAdmin(): { isAdmin: boolean; isLoaded: boolean } {
  const { user, isLoaded } = useUser();
  if (!isLoaded) return { isAdmin: false, isLoaded: false };
  return { isAdmin: hasAdminRole(user?.publicMetadata), isLoaded: true };
}
