import { useAuth } from "@clerk/clerk-react";
import type React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isClerkEnabled } from "@/lib/auth-flag";
import { useIsAdmin } from "@/lib/auth-role";

export function ProtectedRoute({
  children,
  requireAdmin = false,
}: {
  children: React.ReactNode;
  requireAdmin?: boolean;
}) {
  const location = useLocation();

  if (!isClerkEnabled) return <>{children}</>;

  return (
    <ClerkProtectedRoute locationPath={location.pathname} requireAdmin={requireAdmin}>
      {children}
    </ClerkProtectedRoute>
  );
}

function ClerkProtectedRoute({
  children,
  locationPath,
  requireAdmin,
}: {
  children: React.ReactNode;
  locationPath: string;
  requireAdmin: boolean;
}) {
  const { isLoaded, isSignedIn } = useAuth();
  const { isAdmin, isLoaded: isRoleLoaded } = useIsAdmin();

  if (!isLoaded || !isRoleLoaded) {
    return <div className="min-h-screen bg-background" />;
  }

  if (!isSignedIn) {
    const redirectUrl = encodeURIComponent(locationPath);
    return <Navigate to={`/sign-in?redirect_url=${redirectUrl}`} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/user" replace />;
  }

  return <>{children}</>;
}
