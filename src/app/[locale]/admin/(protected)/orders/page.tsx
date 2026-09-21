import Link from 'next/link';
import {getLocale, getTranslations} from 'next-intl/server';


import type {
  AdminOrder,
  OrderStatus,
} from '@/types/order';
import {getAdminOrders} from '@/lib/admin/orders';
import {OrdersFilters} from '@/components/admin/orders/orders-filters';

type OrdersPageProps = {
  searchParams: Promise<{
    search?: string;
    status?: string;
  }>;
};

const validStatuses: OrderStatus[] = [
  'pending',
  'confirmed',
  'processing',
  'out_for_delivery',
  'delivered',
  'rejected',
  'cancelled',
];

function getLocalizedProductName(
  productName: Record<string, string> | null,
  locale: string,
) {
  if (!productName) {
    return '—';
  }

  return (
    productName[locale] ??
    productName.en ??
    Object.values(productName)[0] ??
    '—'
  );
}

function matchesSearch(
  order: AdminOrder,
  search: string,
  locale: string,
) {
  if (!search) {
    return true;
  }

  const normalizedSearch = search.toLowerCase();

  const customerName =
    `${order.customer.firstName} ${order.customer.lastName}`.toLowerCase();

  const customerPhone =
    order.customer.phone.toLowerCase();

  const customerEmail =
    order.customer.email?.toLowerCase() ?? '';

  const orderNumber =
    order.orderNumber.toLowerCase();

  const productNames = order.items
    .map((item) =>
      getLocalizedProductName(
        item.productName,
        locale,
      ).toLowerCase(),
    )
    .join(' ');

  return (
    orderNumber.includes(normalizedSearch) ||
    customerName.includes(normalizedSearch) ||
    customerPhone.includes(normalizedSearch) ||
    customerEmail.includes(normalizedSearch) ||
    productNames.includes(normalizedSearch)
  );
}

function formatCurrency(value: number, locale: string) {
  return new Intl.NumberFormat(locale === 'ar' ? 'ar' : "en", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    currency: "SDG",
    style: "currency"
  }).format(value);
}

function formatDate(
  value: string,
  locale: string,
) {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function getStatusClassName(
  status: OrderStatus,
) {
  switch (status) {
    case 'pending':
      return 'bg-neutral-100 text-neutral-700';

    case 'confirmed':
      return 'bg-neutral-200 text-neutral-800';

    case 'processing':
      return 'bg-neutral-200 text-neutral-800';

    case 'out_for_delivery':
      return 'bg-neutral-900 text-white';

    case 'delivered':
      return 'bg-neutral-950 text-white';

    case 'rejected':
      return 'bg-neutral-100 text-neutral-500';

    case 'cancelled':
      return 'bg-neutral-100 text-neutral-500';

    default:
      return 'bg-neutral-100 text-neutral-700';
  }
}

function getItemSummary(
  order: AdminOrder,
  locale: string,
  t: (key: string, values?: Record<string, string | number>) => string,
) {
  if (order.items.length === 0) {
    return '—';
  }

  const firstItem = order.items[0];

  const firstName = getLocalizedProductName(
    firstItem.productName,
    locale,
  );

  if (order.items.length === 1) {
    return `${firstName} · ${firstItem.sizeMl} ml`;
  }

  return t("orderValueSummary.itemsMore", {
    firstName,
    sizeMl: firstItem.sizeMl,
    count: order.items.length - 1,
  });

  // return `${firstName} · ${firstItem.sizeMl} ml + ${order.items.length - 1
  //   } more`;
}

export default async function AdminOrdersPage({
  searchParams,
}: OrdersPageProps) {
  const params = await searchParams;

  const search =
    params.search?.trim() ?? '';

  const requestedStatus =
    params.status ?? 'all';

  const status = validStatuses.includes(
    requestedStatus as OrderStatus,
  )
    ? (requestedStatus as OrderStatus)
    : 'all';

  const [orders, t, locale] =
    await Promise.all([
      getAdminOrders(),
      getTranslations('AdminOrders'),
      getLocale(),
    ]);

  const filteredOrders = orders.filter(
    (order) => {
      const matchesStatus =
        status === 'all' ||
        order.status === status;

      return (
        matchesStatus &&
        matchesSearch(
          order,
          search,
          locale,
        )
      );
    },
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-950">
          {t('title')}
        </h1>

        <p className="mt-2 text-sm text-neutral-500">
          {t('description')}
        </p>
      </div>

      <OrdersFilters />

      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-245">
            <thead className="border-b border-neutral-200 bg-neutral-50">
              <tr className="text-start text-xs font-medium uppercase tracking-wide text-neutral-500">
                <th className="px-4 py-3 text-start">
                  {t('order')}
                </th>

                <th className="px-4 py-3 text-start">
                  {t('customer')}
                </th>

                <th className="px-4 py-3 text-start">
                  {t('items')}
                </th>

                <th className="px-4 py-3 text-start">
                  {t('total')}
                </th>

                <th className="px-4 py-3 text-start">
                  {t('status')}
                </th>

                <th className="px-4 py-3 text-start">
                  {t('date')}
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-neutral-100">
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="text-sm transition hover:bg-neutral-50"
                >
                  <td className="px-4 py-4">
                    <Link
                      href={`/admin/orders/${order.orderNumber}`}
                      className="group"
                    >
                      <p className="font-medium text-neutral-950 group-hover:underline">
                        #{order.orderNumber}
                      </p>

                      <p className="mt-1 text-xs text-neutral-500">
                        {order.deliveryMethod ===
                          'express'
                          ? t('express')
                          : t('standard')}
                      </p>
                    </Link>
                  </td>

                  <td className="px-4 py-4">
                    <p className="font-medium text-neutral-900">
                      {order.customer.firstName}{' '}
                      {order.customer.lastName}
                    </p>

                    <p className="mt-1 text-xs text-neutral-500">
                      {order.customer.phone}
                    </p>
                  </td>

                  <td className="max-w-70 px-4 py-4">
                    <p className="truncate text-neutral-700">
                      {getItemSummary(
                        order,
                        locale,
                        t,
                      )}
                    </p>

                    <p className="mt-1 text-xs text-neutral-500">
                      {t('itemCount', {
                        count: order.items.reduce(
                          (total, item) =>
                            total + item.quantity,
                          0,
                        ),
                      })}
                    </p>
                  </td>

                  <td className="px-4 py-4 font-medium text-neutral-900">
                    {formatCurrency(order.total, locale)}
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={[
                        'inline-flex rounded-full px-2.5 py-1 text-xs font-medium',
                        getStatusClassName(
                          order.status,
                        ),
                      ].join(' ')}
                    >
                      {t(`statuses.${order.status}`)}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-4 py-4 text-neutral-600">
                    {formatDate(
                      order.createdAt,
                      locale,
                    )}
                  </td>
                </tr>
              ))}

              {filteredOrders.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-16 text-center"
                  >
                    <p className="text-sm font-medium text-neutral-900">
                      {t('noOrders')}
                    </p>

                    <p className="mt-1 text-xs text-neutral-500">
                      {t('noOrdersDescription')}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-neutral-500">
        {t('showingCount', {
          count: filteredOrders.length,
        })}
      </p>
    </div>
  );
}