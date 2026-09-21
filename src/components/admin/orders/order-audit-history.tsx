import type {
  AdminOrderAuditLog,
  OrderStatus,
} from '@/types/order';
import {useLocale, useTranslations} from "next-intl";
type OrderAuditHistoryProps = {
  auditLogs: AdminOrderAuditLog[];
};

function formatStatus(
  status: OrderStatus | null,
  t: ReturnType<typeof useTranslations<"admin.orders.orderAudit">>,
) {
  if (!status) {
    return "—";
  }

  const keyMap: Record<OrderStatus, string> = {
    pending: "statuses.pending",
    confirmed: "statuses.confirmed",
    processing: "statuses.processing",
    out_for_delivery: "statuses.outForDelivery",
    delivered: "statuses.delivered",
    rejected: "statuses.rejected",
    cancelled: "statuses.cancelled",
  };

  return t(keyMap[status]);
}

function formatPaymentStatus(
  status: "pending" | "paid" | null,
  t: ReturnType<typeof useTranslations<"admin.orders.orderAudit">>,
) {
  if (!status) {
    return "—";
  }

  return t(`paymentStatuses.${status}`);
}

function formatDateTime(
  value: string,
  locale: string,
) {
  return new Intl.DateTimeFormat(locale === 'ar' ? 'ar' : "en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function getActionLabel(
  action: AdminOrderAuditLog["action"],
  t: ReturnType<typeof useTranslations<"admin.orders.orderAudit">>,
) {
  switch (action) {
    case "status_changed":
      return t("actions.statusChanged");

    case "payment_marked_paid":
      return t("actions.paymentMarkedPaid");

    default:
      return action;
  }
}

function getActionDescription(
  log: AdminOrderAuditLog,
  t: ReturnType<typeof useTranslations<"admin.orders.orderAudit">>,
) {
  switch (log.action) {
    case "status_changed":
      return t.rich("descriptions.statusChanged", {
        previousStatus: formatStatus(log.previousStatus, t),
        newStatus: formatStatus(log.newStatus, t),
        strong: (chunks) => <strong>{chunks}</strong>,
      });

    case "payment_marked_paid":
      return t.rich("descriptions.paymentMarkedPaid", {
        previousStatus: formatPaymentStatus(
          log.previousPaymentStatus,
          t,
        ),
        newStatus: formatPaymentStatus(
          log.newPaymentStatus,
          t,
        ),
        strong: (chunks) => <strong>{chunks}</strong>,
      });

    default:
      return t("fallback");
  }
}

export default function OrderAuditHistory({
  auditLogs,
}: OrderAuditHistoryProps) {
  const t = useTranslations("AdminOrders.orderAudit");
  const locale = useLocale();

  return (
    <section className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
      <div className="border-b border-neutral-200 px-6 py-5">
        <h2 className="text-lg font-semibold text-neutral-900">
          {t("title")}
        </h2>

        <p className="mt-1 text-sm text-neutral-500">
          {t("description")}
        </p>
      </div>

      {auditLogs.length === 0 ? (
        <div className="px-6 py-8 text-sm text-neutral-500">
          {t("empty")}
        </div>
      ) : (
        <div className="px-6 py-6">
          <div className="relative">
            <div className="absolute bottom-0 left-1.75 top-0 w-px bg-neutral-200" />

            <div className="space-y-7">
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="relative flex gap-4"
                >
                  <div className="relative z-10 mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 border-white bg-neutral-900 ring-1 ring-neutral-200" />

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                      <div>
                        <h3 className="text-sm font-semibold text-neutral-900">
                          {getActionLabel(log.action, t)}
                        </h3>

                        <p className="mt-1 text-sm leading-6 text-neutral-600">
                          {getActionDescription(log, t)}
                        </p>
                      </div>

                      <time
                        dateTime={log.createdAt}
                        className="shrink-0 text-xs text-neutral-400"
                      >
                        {formatDateTime(log.createdAt, locale)}
                      </time>
                    </div>

                    {log.note ? (
                      <div className="mt-3 rounded-xl bg-neutral-50 px-4 py-3">
                        <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
                          {t("note")}
                        </p>

                        <p className="mt-1 text-sm leading-6 text-neutral-600">
                          {log.note}
                        </p>
                      </div>
                    ) : null}

                    {log.actorUserId ? (
                      <p className="mt-3 break-all text-xs text-neutral-400">
                        {t("admin")}: {log.actorUserId}
                      </p>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}