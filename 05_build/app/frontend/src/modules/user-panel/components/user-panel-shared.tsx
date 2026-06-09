import { CircleHelpIcon, GaugeIcon, SettingsIcon, ShieldUserIcon, UserIcon } from "lucide-react";
import type { ReactNode } from "react";

export type UserPanelNavItem = {
  title: string;
  path?: string;
  icon?: ReactNode;
  isActive?: boolean;
};

export type UserPanelNavGroup = {
  label?: string;
  items: UserPanelNavItem[];
};

export const userPanelNavGroups: UserPanelNavGroup[] = [
  {
    label: "User",
    items: [
      {
        title: "Dashboard",
        path: "/user",
        icon: <GaugeIcon />,
      },
      {
        title: "Profile",
        path: "/user/profile",
        icon: <UserIcon />,
      },
      {
        title: "Settings",
        path: "/user/settings",
        icon: <SettingsIcon />,
      },
    ],
  },
];

export const userPanelFooterLinks: UserPanelNavItem[] = [
  {
    title: "Account Help",
    path: "/user/help",
    icon: <CircleHelpIcon />,
  },
  {
    title: "Admin Panel",
    path: "/admin",
    icon: <ShieldUserIcon />,
  },
];

export const userPanelNavLinks: UserPanelNavItem[] = [
  ...userPanelNavGroups.flatMap((group) => group.items),
  ...userPanelFooterLinks,
];
