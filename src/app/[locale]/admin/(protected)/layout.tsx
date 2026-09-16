import type {ReactNode} from "react";
import {useTranslations} from "next-intl";
import {AdminSidebar} from "@/components/admin/admin-sidebar";
// import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar";
// import {AppSidebar} from "./_components/app-sidebar";
// import {SiteHeader} from "./_components/site-header";

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const t = useTranslations("Admin");

  // return (
  //   <SidebarProvider
  //     style={
  //       {
  //         "--sidebar-width": "calc(var(--spacing) * 72)",
  //         "--header-height": "calc(var(--spacing) * 12)",
  //       } as React.CSSProperties
  //     }
  //   >
  //     <AppSidebar variant="inset" />
  //     <SidebarInset>
  //       <SiteHeader />
  //       <div className="flex flex-1 flex-col">
  //         <div className="@container/main flex flex-1 flex-col gap-2">
  //           <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
  //             <div className="px-4 lg:px-6">
  //               {children}
  //             </div>

  //           </div>
  //         </div>
  //       </div>
  //     </SidebarInset>
  //   </SidebarProvider>
  // );

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 border-e border-neutral-200 bg-white lg:block">
          <div className="flex h-full flex-col">
            <div className="border-b border-neutral-200 px-6 py-6">
              <p className=" text-2xl font-semibold tracking-wide">
                {t("brand")}
              </p>

              <p className="mt-1 text-xs uppercase tracking-[0.2em] text-neutral-500">
                {t("panel")}
              </p>
            </div>

            <div className="flex-1 px-4 py-6">
              <AdminSidebar />
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-16 items-center border-b border-neutral-200 bg-white px-4 sm:px-6">
            <p className="text-sm font-medium text-neutral-600">
              {t("panel")}
            </p>
          </header>

          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}