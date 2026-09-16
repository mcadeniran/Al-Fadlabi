import type {LucideIcon} from "lucide-react";

type DashboardStatCardProps = {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
};

export function DashboardStatCard({
  title,
  value,
  icon: Icon,
  description,
}: DashboardStatCardProps) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-neutral-500">
            {title}
          </p>

          <p className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950">
            {value}
          </p>

          {description && (
            <p className="mt-2 text-xs text-neutral-500">
              {description}
            </p>
          )}
        </div>

        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-neutral-200 bg-neutral-50">
          <Icon className="size-5 text-neutral-700" />
        </div>
      </div>
    </div>
  );
}