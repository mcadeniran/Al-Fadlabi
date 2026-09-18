import {getLocale, getTranslations} from "next-intl/server";
import type {CustomerOrder, OrderStatus} from "@/types/order";
import {Check} from "lucide-react";

type CustomerOrderProgressProps = {
  order: CustomerOrder;
};

type ProgressStep = {
  key: "pending" | "confirmed" | "processing" | "outForDelivery" | "delivered";
};

type TimelineEvent = {
  key: ProgressStep["key"] | "rejected" | "cancelled";
  timestamp: string;
  note?: string | null;
};

const progressSteps: ProgressStep[] = [
  {key: "pending"},
  {key: "confirmed"},
  {key: "processing"},
  {key: "outForDelivery"},
  {key: "delivered"},
];

function getStepIndex(status: OrderStatus): number {
  switch (status) {
    case "pending":
      return 0;
    case "confirmed":
      return 1;
    case "processing":
      return 2;
    case "out_for_delivery":
      return 3;
    case "delivered":
      return 4;
    default:
      return -1;
  }
}

function getStatusLabelKey(status: OrderStatus): string {
  switch (status) {
    case "pending":
      return "pending";
    case "confirmed":
      return "confirmed";
    case "processing":
      return "processing";
    case "out_for_delivery":
      return "outForDelivery";
    case "delivered":
      return "delivered";
    case "rejected":
      return "rejected";
    case "cancelled":
      return "cancelled";
  }
}

function getTimelineEvents(order: CustomerOrder): TimelineEvent[] {
  const events: TimelineEvent[] = [
    {
      key: "pending",
      timestamp: order.createdAt,
    },
  ];

  if (order.confirmedAt) {
    events.push({
      key: "confirmed",
      timestamp: order.confirmedAt,
    });
  }

  if (order.processedAt) {
    events.push({
      key: "processing",
      timestamp: order.processedAt,
    });
  }

  if (order.dispatchedAt) {
    events.push({
      key: "outForDelivery",
      timestamp: order.dispatchedAt,
    });
  }

  if (order.deliveredAt) {
    events.push({
      key: "delivered",
      timestamp: order.deliveredAt,
    });
  }

  if (order.rejectedAt) {
    events.push({
      key: "rejected",
      timestamp: order.rejectedAt,
      note: order.rejectionNote,
    });
  }

  if (order.cancelledAt) {
    events.push({
      key: "cancelled",
      timestamp: order.cancelledAt,
    });
  }

  return events;
}

function formatTimelineDate(timestamp: string, locale: string): string {
  const date = new Date(timestamp);

  return new Intl.DateTimeFormat(locale === "ar" ? "ar" : "en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export async function CustomerOrderProgress({order}: CustomerOrderProgressProps) {
  const t = await getTranslations("Auth");
  const locale = await getLocale();
  const isArabic = locale === "ar";

  const {status} = order;
  const currentStepIndex = getStepIndex(status);
  const isTerminalErrorState = status === "rejected" || status === "cancelled";
  const timelineEvents = getTimelineEvents(order);

  return (
    <section>
      <div className="mb-8 sm:mb-9">
        <p className={`text-plum ${isArabic ? "text-sm font-medium" : "eyebrow"}`}>{t("orders.progress.eyebrow")}</p>
        <h2 className={`mt-3 text-ink ${isArabic ? "font-sans text-2xl font-medium leading-9" : "font-editorial text-2xl leading-tight tracking-[-0.02em] sm:text-3xl"}`}>{t("orders.progress.title")}</h2>
        <p className={`mt-3 max-w-xl text-ink/50 ${isArabic ? "text-sm leading-7" : "text-sm leading-7"}`}>{t("orders.progress.description")}</p>
      </div>

      {isTerminalErrorState ? (
        <div className="border-t border-ink/15 py-6">
          <div className="flex items-start gap-4">
            <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-coral" />
            <div>
              <p className={`font-medium leading-6 text-ink/35 ${isArabic ? "text-sm" : "text-xs"}`}>{t("orders.progress.currentStatus")}</p>
              <p className={`mt-2 text-ink ${isArabic ? "font-sans text-2xl font-medium leading-9" : "font-editorial text-2xl leading-tight tracking-tight sm:text-3xl"}`}>{t(`orders.status.${getStatusLabelKey(status)}`)}</p>
              <p className={`mt-3 max-w-xl text-ink/50 ${isArabic ? "text-sm leading-7" : "text-sm leading-7"}`}>{t(status === "rejected" ? "orders.progress.rejectedDescription" : "orders.progress.cancelledDescription")}</p>
              {status === "rejected" && order.rejectionNote ? <p className={`mt-4 max-w-xl border-s-2 border-coral ps-4 text-ink/65 ${isArabic ? "text-sm leading-7" : "text-sm leading-6"}`}>{order.rejectionNote}</p> : null}
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="hidden md:block">
            <div className="relative px-1">
              <div className="absolute left-1 right-1 top-3.5 h-px bg-ink/10" />
              <div className="absolute left-1 top-3.5 h-px bg-plum transition-all duration-500" style={{width: currentStepIndex <= 0 ? "0%" : `${(currentStepIndex / (progressSteps.length - 1)) * 100}%`}} />
              <div className="relative grid grid-cols-5">
                {progressSteps.map((step, index) => {
                  const isCompleted = currentStepIndex > index;
                  const isCurrent = currentStepIndex === index;

                  return (
                    <div key={step.key} className="flex flex-col items-center">
                      <div className={`relative z-10 flex size-7 items-center justify-center rounded-full border transition-all duration-300 ${isCompleted || isCurrent ? "border-plum bg-plum text-snow" : "border-ink/15 bg-snow text-ink/25"}`}>
                        {isCompleted ? <Check size={12} strokeWidth={1.75} /> : <span className="text-[10px] font-semibold">{index + 1}</span>}
                      </div>
                      <p className={`mt-4 max-w-30 text-center leading-6 transition-colors ${isArabic ? "text-sm" : "text-xs"} ${isCurrent ? "font-medium text-plum" : isCompleted ? "text-ink/65" : "text-ink/35"}`}>{t(`orders.progress.steps.${step.key}`)}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-0 md:hidden">
            {progressSteps.map((step, index) => {
              const isCompleted = currentStepIndex > index;
              const isCurrent = currentStepIndex === index;
              const isLast = index === progressSteps.length - 1;

              return (
                <div key={step.key} className="relative flex gap-4">
                  {!isLast ? <div className={`absolute left-3 top-7 h-[calc(100%-0.5rem)] w-px ${isCompleted ? "bg-plum" : "bg-ink/10"}`} /> : null}
                  <div className={`relative z-10 flex size-7 shrink-0 items-center justify-center rounded-full border ${isCompleted || isCurrent ? "border-plum bg-plum text-snow" : "border-ink/15 bg-snow text-ink/25"}`}>
                    {isCompleted ? <Check size={12} strokeWidth={1.75} /> : <span className="text-[10px] font-semibold">{index + 1}</span>}
                  </div>
                  <div className="pb-7">
                    <p className={`leading-7 ${isArabic ? "text-sm" : "text-sm"} ${isCurrent ? "font-medium text-plum" : isCompleted ? "text-ink/70" : "text-ink/35"}`}>{t(`orders.progress.steps.${step.key}`)}</p>
                    {isCurrent ? <p className={`mt-0.5 text-ink/45 ${isArabic ? "text-sm leading-7" : "text-xs leading-6"}`}>{t("orders.progress.current")}</p> : null}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-7 border-t border-ink/10 pt-5">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 shrink-0 rounded-full bg-coral" />
              <p className={`font-medium leading-6 text-ink/35 ${isArabic ? "text-sm" : "text-xs"}`}>{t("orders.progress.currentStatus")}</p>
              <p className={`leading-7 text-ink/70 ${isArabic ? "text-sm" : "text-sm"}`}>{t(`orders.status.${getStatusLabelKey(status)}`)}</p>
            </div>
          </div>
        </>
      )}

      {timelineEvents.length > 0 ? (
        <div className="mt-10 border-t border-ink/10 pt-8">
          <div className="mb-6">
            <p className={`text-plum ${isArabic ? "text-sm font-medium" : "eyebrow"}`}>{t("orders.progress.timelineEyebrow")}</p>
            <h3 className={`mt-2 text-ink ${isArabic ? "font-sans text-xl font-medium leading-8" : "font-editorial text-2xl leading-tight"}`}>{t("orders.progress.timelineTitle")}</h3>
          </div>

          <div className="relative">
            <div className="absolute bottom-3 left-1.75 top-3 w-px bg-ink/10" />

            <div className="space-y-0">
              {timelineEvents.map((event, index) => {
                const isLast = index === timelineEvents.length - 1;
                const isError = event.key === "rejected" || event.key === "cancelled";

                return (
                  <div key={`${event.key}-${event.timestamp}`} className="relative flex gap-5 pb-7 last:pb-0">
                    <div className="relative z-10 mt-1 flex size-4 shrink-0 items-center justify-center bg-snow">
                      {isLast ? (
                        <span className={`size-3 rounded-full ${isError ? "bg-coral" : "bg-plum"}`} />
                      ) : (
                        <span className={`size-2 rounded-full ${isError ? "bg-coral" : "bg-ink/25"}`} />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                        <p className={`text-ink ${isArabic ? "text-base font-medium leading-7" : "text-sm font-medium leading-6"}`}>{t(`orders.progress.steps.${event.key}`)}</p>
                        <time dateTime={event.timestamp} className={`shrink-0 text-ink/35 ${isArabic ? "text-xs leading-6" : "text-[11px] leading-5"}`}>{formatTimelineDate(event.timestamp, locale)}</time>
                      </div>

                      {isLast && isError && event.note ? <p className={`mt-2 max-w-xl text-ink/55 ${isArabic ? "text-sm leading-7" : "text-xs leading-6"}`}>{event.note}</p> : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}