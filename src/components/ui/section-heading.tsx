import type {ReactNode} from "react";

import {cn} from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        align === "center" && "mx-auto text-center",
        "max-w-3xl",
        className
      )}
    >
      <p className="mb-5 text-[10px] uppercase tracking-[0.4em] text-brand-gold-muted">
        {eyebrow}
      </p>

      <h2 className="font-heading text-5xl leading-none tracking-[-0.03em] md:text-6xl">
        {title}
      </h2>

      {description && (
        <p className="mt-6 max-w-xl text-sm leading-7 text-foreground/55">
          {description}
        </p>
      )}
    </div>
  );
}