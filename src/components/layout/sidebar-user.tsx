"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LogOut,
  Settings,
  HelpCircle,
  Search,
  MoreVertical,
} from "lucide-react";

function getInitialsFromName(displayName: string) {
  if (!displayName || displayName === "User") return "U";
  const parts = displayName.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return displayName.slice(0, 2).toUpperCase();
}

function getAvatarUrl(displayName: string, authAvatarUrl: string | undefined) {
  if (authAvatarUrl) return authAvatarUrl;
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&size=128`;
}

export function SidebarUser() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    try {
      const supabase = createClient();
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (!cancelled && session?.user) setUser(session.user);
      });
      supabase.auth
        .getUser()
        .then(({ data: { user: u } }) => {
          if (!cancelled) setUser(u ?? null);
        })
        .catch(() => {
          if (!cancelled) setUser(null);
        })
        .finally(() => {
          if (!cancelled) setLoaded(true);
        });
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        if (!cancelled) setUser(session?.user ?? null);
      });
      return () => {
        cancelled = true;
        subscription.unsubscribe();
      };
    } catch {
      setLoaded(true);
      setUser(null);
      return undefined;
    }
  }, []);

  const displayName = user?.user_metadata?.full_name ?? user?.email ?? "User";
  const email = user?.email ?? "user@example.com";
  const initials = getInitialsFromName(displayName);
  const avatarUrl = getAvatarUrl(displayName, user?.user_metadata?.avatar_url);

  async function handleSignOut() {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } finally {
      router.push("/sign-in");
      router.refresh();
    }
  }

  return (
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                tooltip={displayName}
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 shrink-0 rounded-lg group-data-[collapsible=icon]:size-8">
                  <AvatarImage src={avatarUrl} alt={displayName} />
                  <AvatarFallback className="rounded-lg">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="grid min-w-0 flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="truncate font-semibold">{displayName}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {email}
                  </span>
                </div>
                <MoreVertical
                  className="size-4 shrink-0 text-muted-foreground group-data-[collapsible=icon]:hidden"
                  aria-hidden
                />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              side="top"
              align="start"
              sideOffset={4}
            >
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" aria-hidden />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HelpCircle className="mr-2 h-4 w-4" aria-hidden />
                Get Help
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Search className="mr-2 h-4 w-4" aria-hidden />
                Search
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-2 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={avatarUrl} alt={displayName} />
                    <AvatarFallback className="rounded-lg">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid min-w-0 flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {displayName}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" aria-hidden />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
}
