import { UserDashboardView } from "@/modules/user-panel/components/user-dashboard-view";
import { UserPanelShell } from "@/modules/user-panel/components/user-panel-shell";

export function UserPage() {
  return (
    <UserPanelShell>
      <UserDashboardView />
    </UserPanelShell>
  );
}
