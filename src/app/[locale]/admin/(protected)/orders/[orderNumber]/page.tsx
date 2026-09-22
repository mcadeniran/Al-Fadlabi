import Image from 'next/image';
import {notFound} from 'next/navigation';
import {getLocale, getTranslations} from 'next-intl/server';
import {MapPin, Package, Phone, User} from 'lucide-react';

import type {AdminOrder, OrderStatus} from '@/types/order';
import {getAdminOrder, getAdminOrderAuditLog} from '@/lib/admin/orders';
import {OrderStatusActions} from '@/components/admin/orders/order-status-actions';
import BackToOrdersAdminButton from './BackToOrdersAdminButton';
import {OrderPaymentActions} from '@/components/admin/orders/order-payment-actions';
import OrderAuditHistory from '@/components/admin/orders/order-audit-history';

type AdminOrderDetailsPageProps = {
  params: Promise<{
    orderNumber: string;
  }>;
};

function getLocalizedProductName(
  productName: Record<string, string> | null,
  locale: string,
) {
  if (!productName) return '—';

  return (
    productName[locale] ??
    productName.en ??
    Object.values(productName)[0] ??
    '—'
  );
}

function formatCurrency(value: number, locale: string) {
  return new Intl.NumberFormat(locale === "ar" ? "ar" : "en", {
    style: "currency",
    currency: "SDG",
    maximumFractionDigits: 0,
  })
    .format(value);
}

function formatDate(value: string | null, locale: string) {
  if (!value) return '—';

  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function getStatusClassName(status: OrderStatus) {
  switch (status) {
    case 'pending':
      return 'border-amber-200 bg-amber-50 text-amber-800';

    case 'confirmed':
      return 'border-blue-200 bg-blue-50 text-blue-800';

    case 'processing':
      return 'border-blue-200 bg-blue-50 text-blue-800';

    case 'out_for_delivery':
      return "border-indigo-200 bg-indigo-50 text-indigo-800";

    case 'delivered':
      return 'border-emerald-200 bg-emerald-50 text-emerald-800';

    case 'rejected':
      return "border-red-200 bg-red-50 text-red-800";

    case 'cancelled':
      return "border-red-200 bg-red-50 text-red-800";


    default:
      return 'bg-neutral-100 text-neutral-700';
  }
}

function getTimeline(order: AdminOrder) {
  return [
    {
      key: 'created',
      date: order.createdAt,
    },
    {
      key: 'confirmed',
      date: order.confirmedAt,
    },
    {
      key: 'processed',
      date: order.processedAt,
    },
    {
      key: 'dispatched',
      date: order.dispatchedAt,
    },
    {
      key: 'delivered',
      date: order.deliveredAt,
    },
    {
      key: 'rejected',
      date: order.rejectedAt,
    },
    {
      key: 'cancelled',
      date: order.cancelledAt,
    },
  ];
}

export default async function AdminOrderDetailsPage({
  params,
}: AdminOrderDetailsPageProps) {
  const {orderNumber} = await params;

  const [order, t, locale] = await Promise.all([
    getAdminOrder(orderNumber),
    getTranslations('AdminOrders'),
    getLocale(),
  ]);

  if (!order) {
    notFound();
  }

  const auditLogs = await getAdminOrderAuditLog(order.id);

  const timeline = getTimeline(order);

  return (
    <div className="space-y-8">
      {/* Back */}
      <div>
        <BackToOrdersAdminButton />
      </div>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-semibold tracking-tight text-neutral-950">
              #{order.orderNumber}
            </h1>

            <span
              className={[
                'inline-flex rounded-full px-2.5 py-1 text-xs font-medium',
                getStatusClassName(order.status),
              ].join(' ')}
            >
              {t(`statuses.${order.status}`)}
            </span>
          </div>

          <p className="mt-2 text-sm text-neutral-500">
            {t('placedOn', {
              date: formatDate(order.createdAt, locale),
            })}
          </p>
        </div>
      </div>

      {/* Status management */}
      <OrderStatusActions
        orderId={order.id}
        orderNumber={order.orderNumber}
        status={order.status}
        deliveryMethod={order.deliveryMethod}
        deliveryFeeConfirmed={order.deliveryFeeConfirmed}
      />

      {/* Payment management */}
      <OrderPaymentActions
        orderId={order.id}
        orderNumber={order.orderNumber}
        orderStatus={order.status}
        paymentStatus={order.paymentStatus}
      />

      {/* Main grid */}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          {/* Order items */}
          <section className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
            <div className="border-b border-neutral-200 px-5 py-4">
              <div className="flex items-center gap-3">
                <Package className="size-5 text-neutral-500" />

                <div>
                  <h2 className="text-sm font-semibold text-neutral-950">
                    {t('orderItems')}
                  </h2>

                  <p className="mt-1 text-xs text-neutral-500">
                    {t('itemCount', {
                      count: order.items.reduce(
                        (total, item) => total + item.quantity,
                        0,
                      ),
                    })}
                  </p>
                </div>
              </div>
            </div>

            <div className="divide-y divide-neutral-100">
              {order.items.map((item) => {
                const productName = getLocalizedProductName(
                  item.productName,
                  locale,
                );

                return (
                  <div
                    key={item.id}
                    className="flex gap-4 p-5"
                  >
                    <div className="relative size-20 shrink-0 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50">
                      {item.productImageUrl ? (
                        <Image
                          src={item.productImageUrl}
                          alt={productName}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex size-full items-center justify-center text-xs text-neutral-400">
                          —
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="font-medium text-neutral-950">
                            {productName}
                          </p>

                          <p className="mt-1 text-sm text-neutral-500">
                            {item.sizeMl} ml
                          </p>
                        </div>

                        <p className="font-medium text-neutral-950">
                          {formatCurrency(item.subtotal, locale)}
                        </p>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-neutral-500">
                        <span>
                          {t('quantity')}: {item.quantity}
                        </span>

                        <span>
                          {t('unitPrice')}: {formatCurrency(item.unitPrice, locale)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {order.items.length === 0 && (
                <div className="px-5 py-12 text-center text-sm text-neutral-500">
                  {t('noOrderItems')}
                </div>
              )}
            </div>
          </section>

          {/* Customer */}
          <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <User className="size-5 text-neutral-500" />

              <h2 className="text-sm font-semibold text-neutral-950">
                {t('customerDetails')}
              </h2>
            </div>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
                  {t('name')}
                </p>

                <p className="mt-1 text-sm text-neutral-900">
                  {order.customer.firstName} {order.customer.lastName}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
                  {t('phone')}
                </p>

                <p className="mt-1 inline-flex items-center gap-2 text-sm text-neutral-900">
                  <Phone className="size-3.5 text-neutral-400" />
                  {order.customer.phone}
                </p>
              </div>

              <div className="sm:col-span-2">
                <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
                  {t('email')}
                </p>

                <p className="mt-1 text-sm text-neutral-900">
                  {order.customer.email ?? '—'}
                </p>
              </div>
            </div>
          </section>

          {/* Delivery */}
          <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <MapPin className="size-5 text-neutral-500" />

              <h2 className="text-sm font-semibold text-neutral-950">
                {t('deliveryDetails')}
              </h2>
            </div>

            <div className="mt-5 space-y-5">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
                  {t('address')}
                </p>

                <p className="mt-1 text-sm leading-6 text-neutral-900">
                  {order.deliveryAddress.address}
                </p>

                <p className="text-sm text-neutral-900">
                  {order.deliveryAddress.city}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
                  {t('deliveryMethod')}
                </p>

                <p className="mt-1 text-sm text-neutral-900">
                  {order.deliveryMethod === 'express'
                    ? t('express')
                    : t('standard')}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
                  {t('deliveryNotes')}
                </p>

                <p className="mt-1 text-sm leading-6 text-neutral-700">
                  {order.deliveryAddress.notes || '—'}
                </p>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          {/* Summary */}
          <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-neutral-950">
              {t("orderSummary")}
            </h2>

            <div className="mt-5 space-y-3 text-sm">
              <div className="flex items-center justify-between gap-4">
                <span className="text-neutral-500">
                  {t("subtotal")}
                </span>

                <span className="font-medium text-neutral-900">
                  {formatCurrency(order.subtotal, locale)}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-neutral-500">
                  {t("deliveryCost")}
                </span>

                {order.deliveryFeeConfirmed ? (
                  <span className="font-medium text-neutral-900">
                    {formatCurrency(order.deliveryCost, locale)}
                  </span>
                ) : (
                  <span className="font-medium text-amber-700">
                    {t("deliveryFeePending")}
                  </span>
                )}
              </div>

              <div className="border-t border-neutral-200 pt-3">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-medium text-neutral-950">
                    {order.deliveryFeeConfirmed
                      ? t("total")
                      : t("itemsTotal")}
                  </span>

                  <span className="text-lg font-semibold text-neutral-950">
                    {formatCurrency(order.total, locale)}
                  </span>
                </div>

                {!order.deliveryFeeConfirmed && (
                  <p className="mt-2 text-xs leading-5 text-amber-700">
                    {t("totalPendingDeliveryFee")}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Payment */}
          <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-neutral-950">
              {t('paymentDetails')}
            </h2>

            <div className="mt-5 space-y-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
                  {t('paymentMethod')}
                </p>

                <p className="mt-1 text-sm text-neutral-900">
                  {t('payOnDelivery')}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
                  {t('paymentStatus')}
                </p>

                <p className="mt-1 text-sm text-neutral-900">
                  {t(`paymentStatuses.${order.paymentStatus}`)}
                </p>
              </div>
            </div>
          </section>

          {/* Rejection note */}
          {order.rejectionNote && (
            <section className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
              <h2 className="text-sm font-semibold text-neutral-950">
                {t('rejectionNote')}
              </h2>

              <p className="mt-2 text-sm leading-6 text-neutral-600">
                {order.rejectionNote}
              </p>
            </section>
          )}

          {/* Timeline */}
          <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-neutral-950">
              {t('orderTimeline')}
            </h2>

            <div className="mt-5 space-y-4">
              {timeline.map((event) => {
                if (!event.date) return null;

                return (
                  <div
                    key={event.key}
                    className="flex gap-3"
                  >
                    <div className="mt-1.5 size-2 shrink-0 rounded-full bg-neutral-900" />

                    <div className="min-w-0">
                      <p className="text-sm font-medium text-neutral-900">
                        {t(`timeline.${event.key}`)}
                      </p>

                      <p className="mt-1 text-xs text-neutral-500">
                        {formatDate(event.date, locale)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <OrderAuditHistory auditLogs={auditLogs} />
        </div>
      </div>
    </div>
  );
}