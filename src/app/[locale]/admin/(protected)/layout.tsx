import type {ReactNode} from "react";
import {requireAdmin} from "@/lib/admin/auth/require-admin";

import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar";
import {AppSidebar} from "./_components/app-sidebar";
import {SiteHeader} from "./_components/site-header";

export default async function AdminLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{locale: string;}>;
}) {
  const {locale} = await params;

  await requireAdmin(locale);

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                {children}
              </div>

            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}