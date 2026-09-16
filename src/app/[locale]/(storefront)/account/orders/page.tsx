import {CustomerOrders} from '@/components/account/customer-orders';
import {getCustomerOrders} from '@/lib/orders/customer-order-service';
import {createClient} from "@/lib/supabase/server";
import {getLocale} from 'next-intl/server';
import {redirect} from 'next/navigation';
import React from 'react';

export default async function OrdersPage() {
  const locale = await getLocale();

  const supabase = await createClient();

  const {
    data: {user},
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/account/login`);
  }

  const orders = await getCustomerOrders();

  return (
    <main className="min-h-[calc(100vh-8rem)] px-6 py-16 sm:px-8 lg:px-12">
      <CustomerOrders
        orders={orders}
        locale={locale}
      />
    </main>
  );
}
