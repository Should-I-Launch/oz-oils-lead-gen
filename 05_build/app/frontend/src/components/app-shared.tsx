import {
  BarChart3Icon,
  BookOpenIcon,
  BriefcaseIcon,
  CreditCardIcon,
  HelpCircleIcon,
  KeyRoundIcon,
  LayoutGridIcon,
  PlugIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react";
import type { ReactNode } from "react";

export type SidebarNavItem = {
  title: string;
  path?: string;
  icon?: ReactNode;
  isActive?: boolean;
  subItems?: SidebarNavItem[];
};

export type SidebarNavGroup = {
  label?: string;
  items: SidebarNavItem[];
};

export const navGroups: SidebarNavGroup[] = [
  {
    label: "Product",
    items: [
      {
        title: "Dashboard",
        path: "/admin",
        icon: <LayoutGridIcon />,
      },
      {
        title: "Analytics",
        path: "/admin/analytics",
        icon: <BarChart3Icon />,
      },
      {
        title: "Projects",
        path: "/admin/projects",
        icon: <BriefcaseIcon />,
      },
    ],
  },
  {
    label: "Workspace",
    items: [
      {
        title: "Team",
        path: "/admin/team",
        icon: <UsersIcon />,
      },
      {
        title: "Integrations",
        path: "/admin/integrations",
        icon: <PlugIcon />,
      },
      {
        title: "API Keys",
        path: "/admin/api-keys",
        icon: <KeyRoundIcon />,
      },
    ],
  },
  {
    label: "Administration",
    items: [
      {
        title: "Settings",
        path: "/admin/settings",
        icon: <SettingsIcon />,
      },
      {
        title: "Billing",
        path: "/admin/billing",
        icon: <CreditCardIcon />,
      },
    ],
  },
];

export const footerNavLinks: SidebarNavItem[] = [
  {
    title: "Help Center",
    path: "/admin/help",
    icon: <HelpCircleIcon />,
  },
  {
    title: "Documentation",
    path: "/admin/docs",
    icon: <BookOpenIcon />,
  },
];

export const navLinks: SidebarNavItem[] = [
  ...navGroups.flatMap((group) =>
    group.items.flatMap((item) => (item.subItems?.length ? [item, ...item.subItems] : [item])),
  ),
  ...footerNavLinks,
];
