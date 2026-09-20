import type {LucideIcon} from "lucide-react";

type DashboardStatCardProps = {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  featured?: boolean;
};

export function DashboardStatCard({
  title,
  value,
  icon: Icon,
  description,
  featured = false,
}: DashboardStatCardProps) {
  return (
    <div
      className={[
        "group relative overflow-hidden rounded-2xl border p-5 transition-all duration-300",
        "hover:-translate-y-0.5 hover:shadow-md",
        featured
          ? "border-neutral-900 bg-plum-deep text-white shadow-sm"
          : "border-neutral-200/80 bg-white text-neutral-950 shadow-sm",
      ].join(" ")}
    >
      {/* Subtle decorative glow */}
      <div
        className={[
          "pointer-events-none absolute -right-8 -top-8 size-24 rounded-full blur-2xl transition-opacity duration-300",
          featured
            ? "bg-white/10 opacity-100"
            : "bg-neutral-100 opacity-0 group-hover:opacity-100",
        ].join(" ")}
      />

      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p
            className={[
              "text-sm font-medium",
              featured ? "text-white/60" : "text-neutral-500",
            ].join(" ")}
          >
            {title}
          </p>

          <p
            className={[
              "mt-3 truncate text-3xl font-semibold tracking-tight",
              featured ? "text-white" : "text-neutral-950",
            ].join(" ")}
          >
            {value}
          </p>

          {description && (
            <p
              className={[
                "mt-2 text-xs",
                featured ? "text-white/50" : "text-neutral-500",
              ].join(" ")}
            >
              {description}
            </p>
          )}
        </div>

        <div
          className={[
            "flex size-11 shrink-0 items-center justify-center rounded-xl border transition-transform duration-300 group-hover:scale-105",
            featured
              ? "border-white/10 bg-white/10 text-white"
              : "border-neutral-200 bg-neutral-50 text-neutral-700",
          ].join(" ")}
        >
          <Icon className="size-5" strokeWidth={1.8} />
        </div>
      </div>

      {/* Bottom accent */}
      <div
        className={[
          "absolute inset-x-0 bottom-0 h-px",
          featured ? "bg-white/20" : "bg-neutral-100",
        ].join(" ")}
      />
    </div>
  );
}