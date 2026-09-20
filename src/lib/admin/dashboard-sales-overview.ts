'use server';

import { createClient } from '@/lib/supabase/server';

export type DashboardSalesOverviewItem = {
  date: string;
  revenue: number | string;
  orders: number | string;
};

const VALID_PERIODS = [7, 30, 90] as const;

type SalesPeriod = (typeof VALID_PERIODS)[number];

export type DashboardSalesSummary = {
  current_revenue: number | string;
  current_orders: number | string;
  previous_revenue: number | string;
  previous_orders: number | string;
};

export async function getDashboardSalesOverview(
  days: SalesPeriod,
): Promise<DashboardSalesOverviewItem[]> {
  if (!VALID_PERIODS.includes(days)) {
    throw new Error('Invalid sales overview period.');
  }

  const supabase = await createClient();

  const { data, error } = await supabase.rpc('get_dashboard_sales_overview', {
    p_days: days,
  });

  if (error) {
    throw new Error('Failed to load sales overview.');
  }

  return data ?? [];
}

export async function getDashboardSalesSummary(
  days: SalesPeriod,
): Promise<DashboardSalesSummary> {
  if (!VALID_PERIODS.includes(days)) {
    throw new Error('Invalid sales summary period.');
  }

  const supabase = await createClient();

  const { data, error } = await supabase.rpc('get_dashboard_sales_summary', {
    p_days: days,
  });

  if (error) {
    throw new Error('Failed to load sales summary.');
  }

  const summary = data?.[0];

  return (
    summary ?? {
      current_revenue: 0,
      current_orders: 0,
      previous_revenue: 0,
      previous_orders: 0,
    }
  );
}
