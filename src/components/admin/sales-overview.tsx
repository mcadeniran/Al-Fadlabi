"use client";

import {Area, AreaChart, CartesianGrid, XAxis, YAxis, } from "recharts";
import {ArrowUpRight, BarChart3} from "lucide-react";
import {useLocale, useTranslations} from "next-intl";
import {useEffect, useState, useTransition} from "react";

import {ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig, } from "@/components/ui/chart";
import {DashboardSalesSummary, getDashboardSalesOverview, getDashboardSalesSummary} from "@/lib/admin/dashboard-sales-overview";


type SalesPeriod = 7 | 30 | 90;

type SalesOverviewItem = {
  date: string;
  revenue: number | string;
  orders: number | string;
};

type SalesOverviewProps = {
  data: SalesOverviewItem[];
};

export function SalesOverview({data}: SalesOverviewProps) {
  const t = useTranslations("AdminDashboard");
  const locale = useLocale();

  const [period, setPeriod] = useState<SalesPeriod>(30);
  const [salesData, setSalesData] = useState<SalesOverviewItem[]>(data);

  const [isPending, startTransition] = useTransition();

  const [summary, setSummary] = useState<DashboardSalesSummary>({
    current_revenue: 0,
    current_orders: 0,
    previous_revenue: 0,
    previous_orders: 0,
  });

  useEffect(() => {
    startTransition(async () => {
      const [overview, summaryResult] = await Promise.all([
        period === 30
          ? Promise.resolve(data)
          : getDashboardSalesOverview(period),
        getDashboardSalesSummary(period),
      ]);

      setSalesData(overview);
      setSummary(summaryResult);
    });
  }, [period, data]);



  const numberFormatter = new Intl.NumberFormat(
    locale === "ar" ? "ar" : "en",
    {
      maximumFractionDigits: 0,
    },
  );

  const currencyFormatter = new Intl.NumberFormat(
    locale === "ar" ? "ar" : "en",
    {
      style: "currency",
      currency: "SDG",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    },
  );

  const dateFormatter = new Intl.DateTimeFormat(
    locale === "ar" ? "ar" : "en",
    {
      month: "short",
      day: "numeric",
    },
  );

  function formatDate(value: string) {
    return dateFormatter.format(new Date(`${value}T00:00:00`));
  }

  const chartConfig = {
    revenue: {
      label: t("salesOverview.revenue"),
    },
    orders: {
      label: t("salesOverview.orders"),
    },
  } satisfies ChartConfig;

  const chartData = salesData.map((item) => ({
    ...item,
    revenue: Number(item.revenue ?? 0),
    orders: Number(item.orders ?? 0),
  }));

  const totalRevenue = chartData.reduce(
    (sum, item) => sum + item.revenue,
    0,
  );

  const totalOrders = chartData.reduce(
    (sum, item) => sum + item.orders,
    0,
  );

  const hasSalesActivity = totalOrders > 0;

  const currentRevenue = Number(summary.current_revenue ?? 0);
  const currentOrders = Number(summary.current_orders ?? 0);
  const previousRevenue = Number(summary.previous_revenue ?? 0);
  const previousOrders = Number(summary.previous_orders ?? 0);

  const averageOrderValue =
    currentOrders > 0 ? currentRevenue / currentOrders : 0;

  function getPercentageChange(
    current: number,
    previous: number,
  ) {
    if (previous === 0) {
      return current > 0 ? null : 0;
    }

    return ((current - previous) / previous) * 100;
  }

  const revenueChange = getPercentageChange(
    currentRevenue,
    previousRevenue,
  );

  return (
    <section className="overflow-hidden rounded-3xl border border-neutral-200/80 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-neutral-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">
            {t("salesOverview.eyebrow")}
          </p>

          <h2 className="mt-1 text-xl font-semibold tracking-tight text-neutral-950">
            {t("salesOverview.title")}
          </h2>

          <p className="mt-1 text-sm text-neutral-500">
            {t("salesOverview.description", {
              days: period,
            })}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div
            className="inline-flex w-fit items-center rounded-xl border border-neutral-200 bg-neutral-50 p-1"
            role="group"
            aria-label={t("salesOverview.period")}
          >
            {([7, 30, 90] as const).map((value) => {
              const active = period === value;

              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setPeriod(value)}
                  disabled={isPending}
                  className={[
                    "rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950/20",
                    active
                      ? "bg-white text-neutral-950 shadow-sm"
                      : "text-neutral-500 hover:text-neutral-900",
                    isPending ? "cursor-wait opacity-60" : "",
                  ].join(" ")}
                >
                  {t(`salesOverview.periods.${value}`)}
                </button>
              );
            })}
          </div>

          <ArrowUpRight className="size-4 text-neutral-400" />
        </div>
      </div>

      <div className="grid gap-4 border-b border-neutral-100 p-5 sm:grid-cols-2 lg:grid-cols-3 sm:p-6">
        <div>
          <p className="text-xs font-medium text-neutral-400">
            {t("salesOverview.revenue")}
          </p>

          <div className="mt-1 flex flex-wrap items-baseline gap-2">
            <p className="text-2xl font-semibold tracking-tight text-neutral-950">
              {currencyFormatter.format(currentRevenue)}
            </p>

            {revenueChange !== null && (
              <span
                className={[
                  "text-xs font-medium",
                  revenueChange > 0
                    ? "text-emerald-600"
                    : revenueChange < 0
                      ? "text-red-600"
                      : "text-neutral-400",
                ].join(" ")}
              >
                {revenueChange > 0 ? "+" : ""}
                {numberFormatter.format(revenueChange)}%
              </span>
            )}
          </div>

          <p className="mt-1 text-xs text-neutral-400">
            {t("salesOverview.comparedWithPrevious")}
          </p>
        </div>

        <div>
          <p className="text-xs font-medium text-neutral-400">
            {t("salesOverview.orders")}
          </p>

          <p className="mt-1 text-2xl font-semibold tracking-tight text-neutral-950">
            {numberFormatter.format(currentOrders)}
          </p>

          <p className="mt-1 text-xs text-neutral-400">
            {t("salesOverview.ordersInPeriod")}
          </p>
        </div>

        <div>
          <p className="text-xs font-medium text-neutral-400">
            {t("salesOverview.averageOrderValue")}
          </p>

          <p className="mt-1 text-2xl font-semibold tracking-tight text-neutral-950">
            {currencyFormatter.format(averageOrderValue)}
          </p>

          <p className="mt-1 text-xs text-neutral-400">
            {t("salesOverview.averagePerOrder")}
          </p>
        </div>
      </div>

      {chartData.length > 0 ? (
        <div
          className={[
            "p-3 transition-opacity duration-200 sm:p-5",
            isPending ? "opacity-50" : "opacity-100",
          ].join(" ")}
        >
          <ChartContainer
            config={chartConfig}
            className="h-70 w-full"
          >
            <AreaChart
              accessibilityLayer
              data={chartData}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid
                vertical={false}
                className="stroke-neutral-100"
              />

              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                minTickGap={28}
                tickFormatter={formatDate}
                className="text-[11px] text-neutral-400"
              />

              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                width={55}
                tickFormatter={(value) =>
                  numberFormatter.format(Number(value))
                }
                className="text-[11px] text-neutral-400"
              />

              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) =>
                      formatDate(String(value))
                    }
                    formatter={(value, name) => {
                      if (name === "revenue") {
                        return currencyFormatter.format(Number(value));
                      }

                      return numberFormatter.format(Number(value));
                    }}
                  />
                }
              />

              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#54104a"
                fill="#54104a"
                fillOpacity={0.08}
                strokeWidth={2}
                className="text-neutral-950"
                connectNulls
              />
            </AreaChart>
          </ChartContainer>
        </div>
      ) : (
        <div className="flex min-h-70 flex-col items-center justify-center p-6 text-center">
          <div className="flex size-12 items-center justify-center rounded-2xl border border-neutral-200 bg-neutral-50">
            <BarChart3 className="size-5 text-neutral-400" />
          </div>

          <p className="mt-4 text-sm font-medium text-neutral-700">
            {t("salesOverview.emptyTitle")}
          </p>

          <p className="mt-1 max-w-sm text-xs text-neutral-400">
            {t("salesOverview.emptyDescription")}
          </p>
        </div>
      )}
    </section>
  );
}