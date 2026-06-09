import { Link, useLocation } from "react-router-dom";

import { LogoIcon } from "@/components/logo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { UserPanelNavGroup } from "@/modules/user-panel/components/user-panel-nav-group";
import {
  userPanelFooterLinks,
  userPanelNavGroups,
} from "@/modules/user-panel/components/user-panel-shared";

export function UserPanelSidebar() {
  const { pathname } = useLocation();

  return (
    <Sidebar
      className={cn(
        "*:data-[slot=sidebar-inner]:bg-background",
        "*:data-[slot=sidebar-inner]:dark:bg-[radial-gradient(60%_18%_at_10%_0%,--theme(--color-foreground/.08),transparent)]",
        "**:data-[slot=sidebar-menu-button]:[&>span]:text-foreground/75",
      )}
      collapsible="icon"
      variant="sidebar"
    >
      <SidebarHeader className="h-14 justify-center border-b px-2">
        <SidebarMenuButton asChild>
          <Link to="/user">
            <LogoIcon />
            <span className="font-medium text-foreground!">User Panel</span>
          </Link>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        {userPanelNavGroups.map((group) => (
          <UserPanelNavGroup key={group.label} {...group} />
        ))}
      </SidebarContent>
      <SidebarFooter className="gap-0 p-0">
        <SidebarMenu className="border-t p-2">
          {userPanelFooterLinks.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                className="text-muted-foreground"
                isActive={item.path === pathname}
                size="sm"
              >
                <Link to={item.path ?? "#"}>
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
