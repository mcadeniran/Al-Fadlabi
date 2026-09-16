import {getTranslations} from "next-intl/server";
import type {OrderStatus} from "@/types/order";
import {Check} from "lucide-react";

type CustomerOrderProgressProps = {
  status: OrderStatus;
};

type ProgressStep = {
  key:
  | "pending"
  | "confirmed"
  | "processing"
  | "outForDelivery"
  | "delivered";
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

export async function CustomerOrderProgress({
  status,
}: CustomerOrderProgressProps) {
  const t = await getTranslations("Auth");

  const currentStepIndex = getStepIndex(status);

  const isTerminalErrorState =
    status === "rejected" || status === "cancelled";

  return (
    <section>
      <div className="mb-9">
        <p className="eyebrow text-plum">
          {t("orders.progress.eyebrow")}
        </p>

        <h2 className="mt-4 font-editorial text-4xl leading-[0.9] tracking-[-0.035em] sm:text-5xl">
          {t("orders.progress.title")}
        </h2>

        <p className="mt-5 max-w-xl text-sm leading-7 text-ink/45">
          {t("orders.progress.description")}
        </p>
      </div>

      {isTerminalErrorState ? (
        <div className="border-t border-ink/15 py-7">
          <div className="flex items-start gap-4">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-coral" />

            <div>
              <p className="text-[8px] font-semibold uppercase tracking-[0.25em] text-ink/30">
                {t("orders.progress.currentStatus")}
              </p>

              <p className="mt-3 font-editorial text-3xl leading-none tracking-tight">
                {t(
                  `orders.status.${getStatusLabelKey(status)}`,
                )}
              </p>

              <p className="mt-4 max-w-xl text-sm leading-7 text-ink/45">
                {t(
                  status === "rejected"
                    ? "orders.progress.rejectedDescription"
                    : "orders.progress.cancelledDescription",
                )}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="hidden md:block">
            <div className="relative">
              <div className="absolute left-0 right-0 top-3 h-px bg-ink/10" />

              <div
                className="absolute left-0 top-3 h-px bg-plum transition-all duration-500"
                style={{
                  width:
                    currentStepIndex <= 0
                      ? "0%"
                      : `${(currentStepIndex / (progressSteps.length - 1)) * 100}%`,
                }}
              />

              <div className="relative grid grid-cols-5">
                {progressSteps.map((step, index) => {
                  const isCompleted =
                    currentStepIndex > index;

                  const isCurrent =
                    currentStepIndex === index;

                  return (
                    <div
                      key={step.key}
                      className="flex flex-col items-center"
                    >
                      <div
                        className={`relative z-10 flex size-6 items-center justify-center rounded-full border transition-all duration-300 ${isCompleted || isCurrent
                          ? "border-plum bg-plum text-snow"
                          : "border-ink/15 bg-snow text-ink/25"
                          }`}
                      >
                        {isCompleted ? (
                          <Check
                            size={11}
                            strokeWidth={1.75}
                          />
                        ) : (
                          <span className="text-[8px] font-semibold">
                            {index + 1}
                          </span>
                        )}
                      </div>

                      <p
                        className={`mt-5 text-center text-[8px] font-semibold uppercase tracking-[0.18em] ${isCurrent
                          ? "text-plum"
                          : isCompleted
                            ? "text-ink/65"
                            : "text-ink/30"
                          }`}
                      >
                        {t(
                          `orders.progress.steps.${step.key}`,
                        )}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-0 md:hidden">
            {progressSteps.map((step, index) => {
              const isCompleted =
                currentStepIndex > index;

              const isCurrent =
                currentStepIndex === index;

              const isLast =
                index === progressSteps.length - 1;

              return (
                <div
                  key={step.key}
                  className="relative flex gap-4"
                >
                  {!isLast ? (
                    <div
                      className={`absolute left-3 top-6 h-[calc(100%-0.25rem)] w-px ${isCompleted
                        ? "bg-plum"
                        : "bg-ink/10"
                        }`}
                    />
                  ) : null}

                  <div
                    className={`relative z-10 flex size-6 shrink-0 items-center justify-center rounded-full border ${isCompleted || isCurrent
                      ? "border-plum bg-plum text-snow"
                      : "border-ink/15 bg-snow text-ink/25"
                      }`}
                  >
                    {isCompleted ? (
                      <Check
                        size={11}
                        strokeWidth={1.75}
                      />
                    ) : (
                      <span className="text-[8px] font-semibold">
                        {index + 1}
                      </span>
                    )}
                  </div>

                  <div className="pb-8">
                    <p
                      className={`text-sm ${isCurrent
                        ? "font-medium text-plum"
                        : isCompleted
                          ? "text-ink/70"
                          : "text-ink/35"
                        }`}
                    >
                      {t(
                        `orders.progress.steps.${step.key}`,
                      )}
                    </p>

                    {isCurrent ? (
                      <p className="mt-1 text-xs leading-5 text-ink/40">
                        {t("orders.progress.current")}
                      </p>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 border-t border-ink/10 pt-5">
            <div className="flex items-center gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-coral" />

              <p className="text-[8px] font-semibold uppercase tracking-[0.25em] text-ink/30">
                {t("orders.progress.currentStatus")}
              </p>

              <p className="text-sm text-ink/65">
                {t(
                  `orders.status.${getStatusLabelKey(status)}`,
                )}
              </p>
            </div>
          </div>
        </>
      )}
    </section>
  );
}