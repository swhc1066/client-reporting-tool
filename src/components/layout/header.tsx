"use client";

import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

function getPageTitle(pathname: string): string {
  if (pathname === "/dashboard") return "Dashboard";
  if (pathname === "/clients") return "Clients";
  if (pathname.startsWith("/clients/") && pathname.endsWith("/present"))
    return "Presentation";
  if (pathname.match(/^\/clients\/[^/]+$/)) return "Client Details";
  return "Client Reporting Tool";
}

export function Header() {
  const pathname = usePathname();
  const title = getPageTitle(pathname);

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border px-4">
      <SidebarTrigger aria-label="Toggle sidebar" />
      <Separator orientation="vertical" className="h-6" />
      <h1 className="text-xl font-semibold truncate">{title}</h1>
    </header>
  );
}
