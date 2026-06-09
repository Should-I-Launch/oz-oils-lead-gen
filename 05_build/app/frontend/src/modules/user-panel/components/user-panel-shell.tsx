import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { UserPanelHeader } from "@/modules/user-panel/components/user-panel-header";
import { UserPanelSidebar } from "@/modules/user-panel/components/user-panel-sidebar";

export function UserPanelShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider className={cn("[--app-wrapper-max-width:80rem]")}>
      <UserPanelSidebar />
      <SidebarInset>
        <UserPanelHeader />
        <div
          className={cn(
            "flex flex-1 flex-col p-4 md:p-6",
            "mx-auto w-full max-w-(--app-wrapper-max-width)",
          )}
        >
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
