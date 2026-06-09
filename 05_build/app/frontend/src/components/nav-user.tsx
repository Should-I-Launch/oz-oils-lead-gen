import { useClerk, useUser } from "@clerk/clerk-react";
import {
  CreditCardIcon,
  LogOutIcon,
  MonitorIcon,
  MoonIcon,
  SettingsIcon,
  SunIcon,
  UserIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { isClerkEnabled } from "@/lib/auth-flag";

function getInitials(name?: string | null, email?: string | null) {
  if (name) {
    const parts = name.trim().split(/\s+/);
    const a = parts[0]?.[0] ?? "";
    const b = parts[1]?.[0] ?? "";
    return (a + b).toUpperCase() || "U";
  }
  return email?.slice(0, 2).toUpperCase() ?? "U";
}

function subscribeMounted() {
  return () => {};
}

function getClientSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

function ThemeSubmenu() {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribeMounted, getClientSnapshot, getServerSnapshot);

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <SunIcon className="dark:hidden" />
        <MoonIcon className="hidden dark:block" />
        Theme
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent>
        <DropdownMenuRadioGroup value={mounted ? theme : undefined} onValueChange={setTheme}>
          <DropdownMenuRadioItem value="light">
            <SunIcon /> Light
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark">
            <MoonIcon /> Dark
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="system">
            <MonitorIcon /> System
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  );
}

export function NavUser() {
  if (!isClerkEnabled) return <GuestNavUser />;
  return <ClerkNavUser />;
}

function ClerkNavUser() {
  const { isLoaded, user } = useUser();
  const clerk = useClerk();

  if (!isLoaded) return <Skeleton className="size-8 rounded-full" />;
  if (!user) return null;

  const name = user.fullName ?? user.username ?? user.primaryEmailAddress?.emailAddress ?? "User";
  const email = user.primaryEmailAddress?.emailAddress ?? "";
  const initials = getInitials(user.fullName, email);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="size-8 cursor-pointer">
          {user.hasImage && <AvatarImage src={user.imageUrl} alt={name} />}
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel className="flex items-center gap-3 py-2">
          <Avatar className="size-10">
            {user.hasImage && <AvatarImage src={user.imageUrl} alt={name} />}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="truncate font-medium text-foreground">{name}</div>
            <div className="truncate text-xs text-muted-foreground">{email}</div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onSelect={() => clerk.openUserProfile()}>
            <UserIcon /> Account
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => clerk.openUserProfile()}>
            <SettingsIcon /> Settings
          </DropdownMenuItem>
          <ThemeSubmenu />
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => clerk.openUserProfile()}>
          <CreditCardIcon /> Plan & Billing
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          className="cursor-pointer"
          onSelect={() => clerk.signOut({ redirectUrl: "/sign-in" })}
        >
          <LogOutIcon /> Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function GuestNavUser() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="size-8 cursor-pointer">
          <AvatarFallback>G</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel className="py-2">
          <div className="font-medium text-foreground">Guest</div>
          <div className="text-xs text-muted-foreground">Clerk auth disabled</div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ThemeSubmenu />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
