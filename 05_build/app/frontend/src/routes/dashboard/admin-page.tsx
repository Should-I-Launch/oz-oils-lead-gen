import { AppShell } from "@/components/app-shell";
import { AdminDashboardView } from "@/modules/dashboard/components/admin-dashboard-view";

export function AdminPage() {
  return (
    <AppShell>
      <AdminDashboardView />
    </AppShell>
  );
}
