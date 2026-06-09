import { CustomSidebarTrigger } from "@/components/custom-sidebar-trigger";
import { NavUser } from "@/components/nav-user";
import { DecorIcon } from "@/components/ui/decor-icon";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { userPanelNavLinks } from "@/modules/user-panel/components/user-panel-shared";

const activeItem = userPanelNavLinks.find((item) => item.isActive);

export function UserPanelHeader() {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 flex h-14 shrink-0 items-center justify-between gap-2 border-b px-4 md:px-6",
        "bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/50",
      )}
    >
      <DecorIcon className="hidden md:block" position="bottom-left" />
      <div className="flex items-center gap-3">
        <CustomSidebarTrigger />
        <Separator
          className="mr-2 h-4 data-[orientation=vertical]:self-center"
          orientation="vertical"
        />
        <div className="text-sm font-medium text-foreground">
          {activeItem?.title ?? "Dashboard"}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <NavUser />
      </div>
    </header>
  );
}
