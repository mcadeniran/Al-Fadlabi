'use client';

import {useState, useTransition} from 'react';
import {
  AlertTriangle,
  Check,
  CreditCard,
  X,
} from 'lucide-react';
import {useRouter} from '@/i18n/navigation';
import {useTranslations} from 'next-intl';
import {markOrderAsPaidAction} from '@/app/[locale]/admin/(protected)/orders/[orderNumber]/payment-actions';


type OrderPaymentActionsProps = {
  orderId: string;
  orderNumber: string;
  orderStatus: string;
  paymentStatus: 'pending' | 'paid';
};

export function OrderPaymentActions({
  orderId,
  orderNumber,
  orderStatus,
  paymentStatus,
}: OrderPaymentActionsProps) {
  const t = useTranslations('AdminOrders');
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(
    null,
  );
  const [success, setSuccess] = useState(false);

  if (
    paymentStatus === 'paid' ||
    orderStatus !== 'delivered'
  ) {
    return null;
  }

  function beginConfirmation() {
    setError(null);
    setSuccess(false);
    setConfirming(true);
  }

  function cancelConfirmation() {
    if (isPending) return;

    setConfirming(false);
    setError(null);
  }

  function confirmPayment() {
    if (isPending) return;

    setError(null);

    startTransition(async () => {
      const result = await markOrderAsPaidAction(
        orderId,
        orderNumber,
      );

      if (!result.success) {
        setError(result.message);
        return;
      }

      setSuccess(true);
      setConfirming(false);

      router.refresh();
    });
  }

  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <CreditCard className="size-5 text-neutral-500" />

        <div>
          <h2 className="text-sm font-semibold text-neutral-950">
            {t('paymentManagement')}
          </h2>

          <p className="mt-1 text-xs text-neutral-500">
            {t('paymentPendingDescription')}
          </p>
        </div>
      </div>

      {success && (
        <div className="mt-4 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700">
          {t('paymentMarkedAsPaid')}
        </div>
      )}

      {error && (
        <div className="mt-4 flex gap-3 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-neutral-500" />

          <p className="text-sm leading-5 text-neutral-700">
            {error}
          </p>
        </div>
      )}

      {confirming ? (
        <div className="mt-5 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
          <p className="text-sm font-medium text-neutral-950">
            {t('confirmPayment')}
          </p>

          <p className="mt-2 text-sm leading-5 text-neutral-600">
            {t('confirmPaymentDescription')}
          </p>

          <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={cancelConfirmation}
              disabled={isPending}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-neutral-200 px-4 text-sm font-medium text-neutral-700 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <X className="size-4" />
              {t('cancelAction')}
            </button>

            <button
              type="button"
              onClick={confirmPayment}
              disabled={isPending}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-neutral-950 px-4 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Check className="size-4" />

              {isPending
                ? t('markingAsPaid')
                : t('confirmPaymentAction')}
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-5">
          <button
            type="button"
            onClick={beginConfirmation}
            disabled={isPending}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-neutral-950 px-4 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Check className="size-4" />
            {t('markAsPaid')}
          </button>
        </div>
      )}
    </section>
  );
}