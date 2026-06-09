import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { AppShell } from "@/components/app-shell";
import { ClerkGate } from "@/components/auth/clerk-gate";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { ErrorBoundary } from "@/components/error-boundary";
import { PlaceholderPage } from "@/components/placeholder-page";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { queryClient } from "@/lib/api/query-client";
import { UserPanelShell } from "@/modules/user-panel/components/user-panel-shell";
import { AdminPage } from "@/routes/dashboard/admin-page";
import { UserPage } from "@/routes/dashboard/user-page";
import { RootRedirect } from "@/routes/root/root-redirect";
import { SignInPage } from "@/routes/sign-in/sign-in-page";
import { SignUpPage } from "@/routes/sign-up/sign-up-page";

export function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <ClerkGate>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<RootRedirect />} />
                <Route path="/sign-in/*" element={<SignInPage />} />
                <Route path="/sign-up/*" element={<SignUpPage />} />

                {/* User panel routes */}
                <Route
                  path="/user"
                  element={
                    <ProtectedRoute>
                      <UserPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/user/profile"
                  element={
                    <ProtectedRoute>
                      <UserPanelShell>
                        <PlaceholderPage title="Profile" />
                      </UserPanelShell>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/user/settings"
                  element={
                    <ProtectedRoute>
                      <UserPanelShell>
                        <PlaceholderPage title="Settings" />
                      </UserPanelShell>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/user/help"
                  element={
                    <ProtectedRoute>
                      <UserPanelShell>
                        <PlaceholderPage title="Account Help" />
                      </UserPanelShell>
                    </ProtectedRoute>
                  }
                />

                {/* Admin panel routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute requireAdmin>
                      <AdminPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/analytics"
                  element={
                    <ProtectedRoute requireAdmin>
                      <AppShell>
                        <PlaceholderPage title="Analytics" />
                      </AppShell>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/projects"
                  element={
                    <ProtectedRoute requireAdmin>
                      <AppShell>
                        <PlaceholderPage title="Projects" />
                      </AppShell>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/team"
                  element={
                    <ProtectedRoute requireAdmin>
                      <AppShell>
                        <PlaceholderPage title="Team" />
                      </AppShell>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/integrations"
                  element={
                    <ProtectedRoute requireAdmin>
                      <AppShell>
                        <PlaceholderPage title="Integrations" />
                      </AppShell>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/api-keys"
                  element={
                    <ProtectedRoute requireAdmin>
                      <AppShell>
                        <PlaceholderPage title="API Keys" />
                      </AppShell>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/settings"
                  element={
                    <ProtectedRoute requireAdmin>
                      <AppShell>
                        <PlaceholderPage title="Settings" />
                      </AppShell>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/billing"
                  element={
                    <ProtectedRoute requireAdmin>
                      <AppShell>
                        <PlaceholderPage title="Billing" />
                      </AppShell>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/help"
                  element={
                    <ProtectedRoute requireAdmin>
                      <AppShell>
                        <PlaceholderPage title="Help Center" />
                      </AppShell>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/docs"
                  element={
                    <ProtectedRoute requireAdmin>
                      <AppShell>
                        <PlaceholderPage title="Documentation" />
                      </AppShell>
                    </ProtectedRoute>
                  }
                />

                <Route path="*" element={<Navigate to="/user" replace />} />
              </Routes>
            </BrowserRouter>
          </ClerkGate>
          <Toaster />
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
