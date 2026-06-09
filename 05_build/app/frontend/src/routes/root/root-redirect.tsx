import { useAuth } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

import { isClerkEnabled } from "@/lib/auth-flag";

export function RootRedirect() {
  if (!isClerkEnabled) return <Navigate to="/user" replace />;
  return <ClerkRootRedirect />;
}

function ClerkRootRedirect() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return <div className="min-h-screen bg-background" />;
  }

  return <Navigate to={isSignedIn ? "/user" : "/sign-in"} replace />;
}
