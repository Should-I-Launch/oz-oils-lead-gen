import { ChevronRightIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import type { SidebarNavGroup } from "@/components/app-shared";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

export function NavGroup({ label, items }: SidebarNavGroup) {
  const { pathname } = useLocation();

  return (
    <SidebarGroup>
      {label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
      <SidebarMenu>
        {items.map((item) => {
          const isActive = item.path === pathname;
          const hasActiveChild = item.subItems?.some((sub) => sub.path === pathname);

          return (
            <Collapsible
              asChild
              className="group/collapsible"
              defaultOpen={isActive || hasActiveChild}
              key={item.title}
            >
              <SidebarMenuItem>
                {item.subItems?.length ? (
                  <>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton isActive={isActive || hasActiveChild}>
                        {item.icon}
                        <span>{item.title}</span>
                        <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.subItems?.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild isActive={subItem.path === pathname}>
                              <Link to={subItem.path ?? "#"}>
                                {subItem.icon}
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </>
                ) : (
                  <SidebarMenuButton asChild isActive={isActive}>
                    <Link to={item.path ?? "#"}>
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                )}
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
