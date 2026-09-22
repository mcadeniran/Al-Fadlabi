"use client";

import {useState, useTransition} from "react";

import {
  AlertTriangle,
  Check,
  ChevronRight,
  X,
} from "lucide-react";

import {useRouter} from "@/i18n/navigation";
import {useTranslations} from "next-intl";

import type {OrderStatus} from "@/types/order";

import {
  confirmOrderDeliveryFeeAction,
  updateOrderStatusAction,
} from "@/app/[locale]/admin/(protected)/orders/[orderNumber]/actions";

type OrderStatusActionsProps = {
  orderId: string;
  orderNumber: string;
  status: OrderStatus;
  deliveryMethod: "standard" | "express";
  deliveryFeeConfirmed: boolean;
};

type ActionConfig = {
  status: OrderStatus;
  variant: "success" | "progress" | "secondary" | "danger";
  icon: typeof Check;
};

export function OrderStatusActions({
  orderId,
  orderNumber,
  status,
  deliveryMethod,
  deliveryFeeConfirmed,
}: OrderStatusActionsProps) {
  const t = useTranslations("AdminOrders");
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const [confirmingStatus, setConfirmingStatus] =
    useState<OrderStatus | null>(null);

  const [rejectionNote, setRejectionNote] = useState("");

  const [deliveryFee, setDeliveryFee] = useState("");

  const [error, setError] = useState<string | null>(null);

  const [success, setSuccess] = useState(false);

  const actions = getAvailableActions(status);

  const requiresDeliveryFee =
    status === "pending" &&
    deliveryMethod === "express" &&
    !deliveryFeeConfirmed;

  if (actions.length === 0) {
    return (
      <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-neutral-950">
          {t("statusManagement")}
        </h2>

        <p className="mt-2 text-sm text-neutral-500">
          {t("noStatusActions")}
        </p>
      </section>
    );
  }

  function beginAction(nextStatus: OrderStatus) {
    setError(null);
    setSuccess(false);
    setRejectionNote("");
    setDeliveryFee("");

    setConfirmingStatus(nextStatus);
  }

  function cancelConfirmation() {
    if (isPending) return;

    setConfirmingStatus(null);
    setRejectionNote("");
    setDeliveryFee("");
    setError(null);
  }

  function confirmAction() {
    if (!confirmingStatus || isPending) return;

    setError(null);

    if (
      confirmingStatus === "confirmed" &&
      requiresDeliveryFee
    ) {
      const parsedFee = Number(deliveryFee);

      if (!deliveryFee.trim()) {
        setError(t("deliveryFeeRequired"));
        return;
      }

      if (!Number.isFinite(parsedFee) || parsedFee < 0) {
        setError(t("deliveryFeeInvalid"));
        return;
      }

      startTransition(async () => {
        const result = await confirmOrderDeliveryFeeAction(
          orderId,
          orderNumber,
          parsedFee,
        );

        if (!result.success) {
          setError(result.error ?? '');
          return;
        }

        setSuccess(true);
        setConfirmingStatus(null);
        setDeliveryFee("");

        router.refresh();
      });

      return;
    }

    if (
      confirmingStatus === "rejected" &&
      !rejectionNote.trim()
    ) {
      setError(t("rejectionNoteRequired"));
      return;
    }

    startTransition(async () => {
      const result = await updateOrderStatusAction(
        orderId,
        orderNumber,
        confirmingStatus,
        confirmingStatus === "rejected"
          ? rejectionNote.trim()
          : undefined,
      );

      if (!result.success) {
        setError(result.message);
        return;
      }

      setSuccess(true);
      setConfirmingStatus(null);
      setRejectionNote("");

      router.refresh();
    });
  }

  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-semibold text-neutral-950">
        {t("statusManagement")}
      </h2>

      {success && (
        <div className="mt-4 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700">
          {t("statusUpdated")}
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

      {confirmingStatus ? (
        <div className="mt-5 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
          <p className="text-sm font-medium text-neutral-950">
            {t("confirmStatusChange", {
              status: t(
                `statuses.${confirmingStatus}`,
              ),
            })}
          </p>

          {confirmingStatus === "confirmed" &&
            requiresDeliveryFee && (
              <div className="mt-4">
                <label
                  htmlFor="delivery-fee"
                  className="text-xs font-medium uppercase tracking-wide text-neutral-500"
                >
                  {t("deliveryFee")}
                </label>

                <div className="mt-2 flex rounded-xl border border-neutral-200 bg-white focus-within:border-neutral-400">
                  <span className="flex items-center border-e border-neutral-200 px-3 text-sm text-neutral-500">
                    SDG
                  </span>

                  <input
                    id="delivery-fee"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="0.01"
                    value={deliveryFee}
                    onChange={(event) =>
                      setDeliveryFee(event.target.value)
                    }
                    disabled={isPending}
                    placeholder={t(
                      "deliveryFeePlaceholder",
                    )}
                    className="min-w-0 flex-1 rounded-e-xl bg-transparent px-3 py-2.5 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>

                <p className="mt-2 text-xs leading-5 text-neutral-500">
                  {t("deliveryFeeDescription")}
                </p>
              </div>
            )}

          {confirmingStatus === "rejected" && (
            <div className="mt-4">
              <label
                htmlFor="rejection-note"
                className="text-xs font-medium uppercase tracking-wide text-neutral-500"
              >
                {t("rejectionNote")}
              </label>

              <textarea
                id="rejection-note"
                value={rejectionNote}
                onChange={(event) =>
                  setRejectionNote(event.target.value)
                }
                rows={4}
                disabled={isPending}
                placeholder={t(
                  "rejectionNotePlaceholder",
                )}
                className="mt-2 w-full resize-none rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-neutral-400 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>
          )}

          <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={cancelConfirmation}
              disabled={isPending}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-neutral-200 px-4 text-sm font-medium text-neutral-700 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <X className="size-4" />

              {t("cancelAction")}
            </button>

            <button
              type="button"
              onClick={confirmAction}
              disabled={isPending}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-neutral-950 px-4 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Check className="size-4" />

              {isPending
                ? requiresDeliveryFee &&
                  confirmingStatus === "confirmed"
                  ? t("confirmingOrder")
                  : t("updatingStatus")
                : t("confirmAction")}
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-5 flex flex-wrap gap-2">
          {actions.map((action) => {
            const Icon = action.icon;

            return (
              <button
                key={action.status}
                type="button"
                onClick={() =>
                  beginAction(action.status)
                }
                disabled={isPending}
                className={getButtonClassName(
                  action.variant,
                )}
              >
                <Icon className="size-4" />

                {t(
                  `statusActions.${action.status}`,
                )}

                <ChevronRight className="size-3.5 opacity-60" />
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}

function getAvailableActions(
  status: OrderStatus,
): ActionConfig[] {
  switch (status) {
    case "pending":
      return [
        {
          status: "confirmed",
          variant: "success",
          icon: Check,
        },
        {
          status: "rejected",
          variant: "danger",
          icon: X,
        },
        {
          status: "cancelled",
          variant: "secondary",
          icon: X,
        },
      ];

    case "confirmed":
      return [
        {
          status: "processing",
          variant: "progress",
          icon: Check,
        },
        {
          status: "rejected",
          variant: "danger",
          icon: X,
        },
        {
          status: "cancelled",
          variant: "secondary",
          icon: X,
        },
      ];

    case "processing":
      return [
        {
          status: "out_for_delivery",
          variant: "progress",
          icon: ChevronRight,
        },
        {
          status: "rejected",
          variant: "danger",
          icon: X,
        },
        {
          status: "cancelled",
          variant: "secondary",
          icon: X,
        },
      ];

    case "out_for_delivery":
      return [
        {
          status: "delivered",
          variant: "success",
          icon: Check,
        },
        {
          status: "cancelled",
          variant: "secondary",
          icon: X,
        },
      ];

    case "delivered":
    case "rejected":
    case "cancelled":
      return [];

    default:
      return [];
  }
}

function getButtonClassName(
  variant: ActionConfig["variant"],
) {
  const base =
    "inline-flex h-10 items-center justify-center gap-2 rounded-xl px-3.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50";

  switch (variant) {
    case "success":
      return `${base} bg-emerald-600 text-white hover:bg-emerald-700`;

    case "progress":
      return `${base} bg-blue-600 text-white hover:bg-blue-700`;

    case "danger":
      return `${base} bg-red-600 text-white hover:bg-red-700`;

    case "secondary":
      return `${base} border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50`;
  }
}