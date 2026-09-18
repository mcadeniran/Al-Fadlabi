"use client";

import {useState} from "react";
import {ArrowRight, Loader2} from "lucide-react";
import {useLocale, useTranslations} from "next-intl";

import {createClient} from "@/lib/supabase/client";
import {useRouter} from "@/i18n/navigation";

export function LogoutButton() {
  const t = useTranslations("Auth");
  const locale = useLocale();

  const [loading, setLoading] = useState(false);

  const router = useRouter();

  async function handleLogout() {
    setLoading(true);

    try {
      const supabase = createClient();

      const {error} = await supabase.auth.signOut();

      if (error) {
        console.error("Logout error:", error);
        return;
      }

      router.push(`/account/login`);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
    }
  }

  const isAr = locale === 'ar';

  return (
    <button type="button" onClick={handleLogout} disabled={loading} className="group inline-flex items-center gap-4 border-b border-ink/20 pb-2 font-semibold uppercase tracking-[0.25em] text-ink/55 transition-colors hover:border-coral hover:text-coral disabled:cursor-not-allowed disabled:opacity-40">
      {loading ? (
        <>
          <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={1.5} />
          <span className={`${isAr ? "text-sm" : "text-xs"}`}>{t("logout.signingOut")}</span>
        </>
      ) : (
        <>
          <span>{t("logout.button")}</span>

          <ArrowRight size={14} strokeWidth={1.25} className="transition-transform duration-300 group-hover:translate-x-1" />
        </>
      )}
    </button>
  );
}