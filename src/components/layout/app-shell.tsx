"use client";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { Header } from "./header";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <div className="mx-auto flex-1 w-full max-w-[1184px] p-4 mt-10 mb-10">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
