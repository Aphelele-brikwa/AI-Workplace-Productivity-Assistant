import { Outlet } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppHeader } from "./AppHeader";
import { AppSidebar } from "./AppSidebar";

export function AppShell({ children }: { children?: ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <SidebarInset className="min-w-0 flex-1">
          <AppHeader />
          <main className="min-w-0 flex-1">
            {children ?? <Outlet />}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
