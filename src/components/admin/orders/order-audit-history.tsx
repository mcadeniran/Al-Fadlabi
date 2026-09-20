import type {
  AdminOrderAuditLog,
  OrderStatus,
} from '@/types/order';

type OrderAuditHistoryProps = {
  auditLogs: AdminOrderAuditLog[];
};

const statusLabels: Record<OrderStatus, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  processing: 'Processing',
  out_for_delivery: 'Out for delivery',
  delivered: 'Delivered',
  rejected: 'Rejected',
  cancelled: 'Cancelled',
};

const paymentLabels = {
  pending: 'Pending',
  paid: 'Paid',
} as const;

function formatStatus(status: OrderStatus | null) {
  if (!status) {
    return '—';
  }

  return statusLabels[status] ?? status;
}

function formatPaymentStatus(
  status: 'pending' | 'paid' | null,
) {
  if (!status) {
    return '—';
  }

  return paymentLabels[status] ?? status;
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function getActionLabel(
  action: AdminOrderAuditLog['action'],
) {
  switch (action) {
    case 'status_changed':
      return 'Status changed';

    case 'payment_marked_paid':
      return 'Payment marked as paid';

    default:
      return action;
  }
}

function getActionDescription(
  log: AdminOrderAuditLog,
) {
  switch (log.action) {
    case 'status_changed':
      return (
        <>
          Order status changed from{' '}
          <strong>
            {formatStatus(log.previousStatus)}
          </strong>{' '}
          to{' '}
          <strong>
            {formatStatus(log.newStatus)}
          </strong>
        </>
      );

    case 'payment_marked_paid':
      return (
        <>
          Payment status changed from{' '}
          <strong>
            {formatPaymentStatus(
              log.previousPaymentStatus,
            )}
          </strong>{' '}
          to{' '}
          <strong>
            {formatPaymentStatus(log.newPaymentStatus)}
          </strong>
        </>
      );

    default:
      return 'Order activity recorded.';
  }
}

export default function OrderAuditHistory({
  auditLogs,
}: OrderAuditHistoryProps) {
  return (
    <section className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
      <div className="border-b border-neutral-200 px-6 py-5">
        <h2 className="text-lg font-semibold text-neutral-900">
          Order activity
        </h2>

        <p className="mt-1 text-sm text-neutral-500">
          A record of status and payment changes for this
          order.
        </p>
      </div>

      {auditLogs.length === 0 ? (
        <div className="px-6 py-8 text-sm text-neutral-500">
          No activity has been recorded yet.
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
                          {getActionLabel(log.action)}
                        </h3>

                        <p className="mt-1 text-sm leading-6 text-neutral-600">
                          {getActionDescription(log)}
                        </p>
                      </div>

                      <time
                        dateTime={log.createdAt}
                        className="shrink-0 text-xs text-neutral-400"
                      >
                        {formatDateTime(log.createdAt)}
                      </time>
                    </div>

                    {log.note ? (
                      <div className="mt-3 rounded-xl bg-neutral-50 px-4 py-3">
                        <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
                          Note
                        </p>

                        <p className="mt-1 text-sm leading-6 text-neutral-600">
                          {log.note}
                        </p>
                      </div>
                    ) : null}

                    {log.actorUserId ? (
                      <p className="mt-3 break-all text-xs text-neutral-400">
                        Admin: {log.actorUserId}
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