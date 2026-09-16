import type {ButtonHTMLAttributes} from "react";

import {cn} from "@/lib/utils";

type LuxuryButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "dark" | "light";
};

export function LuxuryButton({
  className,
  variant = "dark",
  children,
  ...props
}: LuxuryButtonProps) {
  return (
    <button
      className={cn(
        "group inline-flex items-center justify-center border px-7 py-4 text-[9px] uppercase tracking-[0.3em] transition-all duration-300",
        variant === "dark" && [
          "border-brand-gold/60",
          "text-brand-ivory",
          "hover:bg-brand-gold/10",
          "hover:border-brand-gold",
        ],
        variant === "light" && [
          "border-brand-ink/30",
          "text-brand-ink",
          "hover:bg-brand-ink",
          "hover:text-brand-ivory",
        ],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}