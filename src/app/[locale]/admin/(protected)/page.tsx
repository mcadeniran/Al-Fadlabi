import {Package, ClipboardList, Users, Banknote, Boxes, PackageX, } from "lucide-react";

import {getDashboardStats} from "@/lib/admin/dashboard";
import {DashboardStatCard} from "@/components/admin/dashboard-stat-card";
import {QuickActions} from "@/components/admin/quick-actions";
import {RecentOrders} from "@/components/admin/recent-orders";
import {LowStockItems} from "@/components/admin/low-stock-items";
import {getLocale, getTranslations} from "next-intl/server";
import {PendingOrders} from "@/components/admin/pending-order";
import {SalesOverview} from "@/components/admin/sales-overview";
import {hasAdminPermission} from "@/lib/admin/admin-permissions";
import {requireAdmin} from "@/lib/admin/auth/require-admin";

export default async function AdminDashboardPage() {
  const locale = await getLocale();
  const admin = await requireAdmin(locale);

  const role = admin.role;

  const canViewProducts = hasAdminPermission(role, "products");
  const canViewInventory = role === "owner" || role === "admin";

  const stats = await getDashboardStats();
  const t = await getTranslations("AdminDashboard");

  const currencyFormatter = new Intl.NumberFormat(locale === 'ar' ? 'ar' : 'en', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    currency: "SDG",
    style: "currency",
  });

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="relative overflow-hidden rounded-3xl border border-neutral-200/80 bg-white px-6 py-7 shadow-sm sm:px-8 sm:py-8">
        <div className="relative z-10">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-400">
            {t('admin')}
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
            {t("title")}
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">
            {t("overview")}
          </p>
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-20 size-56 rounded-full bg-neutral-100 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 right-24 size-40 rounded-full bg-neutral-50 blur-3xl"
        />
      </div>

      {/* <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <DashboardStatCard
          title={t("totalProducts")}
          value={stats.products}
          icon={Package}
          description={`${stats.activeProducts} ${t("activeProducts").toLowerCase()}`}
        />

        <DashboardStatCard
          title={t("totalOrders")}
          value={stats.orders}
          icon={ClipboardList}
          description={`${stats.pendingOrders} ${t("pendingOrders").toLowerCase()}`}
        />

        <DashboardStatCard
          title={t("customers")}
          value={stats.customers}
          icon={Users}
        />

        <DashboardStatCard
          title={t("revenue")}
          value={currencyFormatter.format(stats.revenue)}
          icon={Banknote}
          featured
        />

        <DashboardStatCard
          title={t("inventoryUnits")}
          value={stats.totalInventoryUnits}
          icon={Boxes}
        />

        <DashboardStatCard
          title={t("outOfStock")}
          value={stats.outOfStockVariants}
          icon={PackageX}
        />
      </div> */}

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {canViewProducts && (
          <DashboardStatCard
            title={t("totalProducts")}
            value={stats.products}
            icon={Package}
            description={`${stats.activeProducts} ${t("activeProducts").toLowerCase()}`}
          />
        )}

        <DashboardStatCard
          title={t("totalOrders")}
          value={stats.orders}
          icon={ClipboardList}
          description={`${stats.pendingOrders} ${t("pendingOrders").toLowerCase()}`}
        />

        <DashboardStatCard
          title={t("customers")}
          value={stats.customers}
          icon={Users}
        />

        <DashboardStatCard
          title={t("revenue")}
          value={currencyFormatter.format(stats.revenue)}
          icon={Banknote}
          featured
        />

        {canViewInventory && (
          <>
            <DashboardStatCard
              title={t("inventoryUnits")}
              value={stats.totalInventoryUnits}
              icon={Boxes}
            />

            <DashboardStatCard
              title={t("outOfStock")}
              value={stats.outOfStockVariants}
              icon={PackageX}
            />
          </>
        )}
      </div>

      <SalesOverview data={stats.salesOverview} />


      <QuickActions role={role} />

      <PendingOrders count={stats.pendingOrders} />

      <div className="grid gap-6 xl:grid-cols-2">
        <RecentOrders orders={stats.recentOrders} />
        {canViewInventory && (
          <LowStockItems items={stats.lowStock} />
        )}
      </div>
    </div>
  );
}