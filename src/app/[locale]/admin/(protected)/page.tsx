import {ClipboardList, DollarSign, Package, Users, } from "lucide-react";

import {getDashboardStats} from "@/lib/admin/dashboard";
import {DashboardStatCard} from "@/components/admin/dashboard-stat-card";
import {QuickActions} from "@/components/admin/quick-actions";
import {RecentOrders} from "@/components/admin/recent-orders";
import {LowStockItems} from "@/components/admin/low-stock-items";
import {getTranslations} from "next-intl/server";

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();
  const t = await getTranslations('AdminDashboard');

  const currencyFormatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-950">
          {t("title")}
        </h1>

        <p className="mt-2 text-sm text-neutral-500">
          {t("overview")}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
          icon={DollarSign}
        />

        <DashboardStatCard
          title={t("inventoryUnits")}
          value={stats.totalInventoryUnits}
          icon={DollarSign}
        />

        <DashboardStatCard
          title={t("outOfStock")}
          value={stats.outOfStockVariants}
          icon={DollarSign}
        />
      </div>

      <QuickActions />

      <div className="rounded-2xl border border-neutral-200 bg-white p-6">
        <div>
          <h2 className="text-lg font-semibold text-neutral-950">
            {t("pendingOrders")}
          </h2>

          <p className="mt-1 text-sm text-neutral-500">
            {stats.pendingOrders}
          </p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <RecentOrders orders={stats.recentOrders} />
        <LowStockItems items={stats.lowStock} />
      </div>
    </div>
  );
}