"use client";

import {useState} from "react";
import type {FormEvent} from "react";
import {Check, Loader2} from "lucide-react";
import {useLocale, useTranslations} from "next-intl";

import {updateCustomerProfile} from "@/app/[locale]/(storefront)/account/actions";
import type {CustomerProfile} from "@/lib/customers/customer-profile";

type ProfileFormProps = {
  customer: CustomerProfile;
};

export function ProfileForm({customer}: ProfileFormProps) {
  const t = useTranslations("Auth");

  const locale = useLocale();

  const isAr = locale === 'ar';

  const [firstName, setFirstName] = useState(customer.firstName);
  const [lastName, setLastName] = useState(customer.lastName);
  const [phone, setPhone] = useState(customer.phone);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess(false);

    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedFirstName || !trimmedLastName || !trimmedPhone) {
      setError(t("profile.errors.required"));
      return;
    }

    setLoading(true);

    try {
      const result = await updateCustomerProfile(
        trimmedFirstName,
        trimmedLastName,
        trimmedPhone,
      );

      if (!result.success) {
        switch (result.error) {
          case "UNAUTHENTICATED":
            setError(t("profile.errors.unauthenticated"));
            break;
          case "REQUIRED_FIELDS":
            setError(t("profile.errors.required"));
            break;
          default:
            setError(t("profile.errors.updateFailed"));
        }

        return;
      }

      setSuccess(true);
    } catch (error) {
      console.error("Profile update error:", error);
      setError(t("profile.errors.updateFailed"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="max-w-3xl">
      <div className="mb-10">
        <p className="eyebrow text-plum">
          {t("profile.eyebrow")}
        </p>

        <h2 className={`mt-4 font-editorial leading-[0.9] tracking-[-0.035em] ${isAr ? "text-xl sm:text-2xl" : "text-lg sm:text-xl"} `}>
          {t("profile.title")}
        </h2>

        <p className={`mt-5 max-w-xl ${isAr ? "text-base" : "text-sm"} leading-7 text-ink/50`}>
          {t("profile.description")}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-9">
        <div className="grid gap-9 sm:grid-cols-2">
          <div className="group">
            <label htmlFor="profile-first-name" className={`block ${isAr ? "text-sm" : "text-xs"} font-semibold uppercase tracking-[0.25em] text-ink/40`}>
              {t("profile.firstName")}
            </label>

            <input
              id="profile-first-name"
              name="firstName"
              type="text"
              autoComplete="given-name"
              value={firstName}
              onChange={(event) => {
                setFirstName(event.target.value);
                setSuccess(false);
              }}
              disabled={loading}
              className="mt-3 h-12 w-full border-0 border-b border-ink/15 bg-transparent px-0 text-base text-ink outline-none transition-colors placeholder:text-ink/25 focus:border-plum disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="group">
            <label htmlFor="profile-last-name" className={`block ${isAr ? "text-sm" : "text-xs"} font-semibold uppercase tracking-[0.25em] text-ink/40`}>
              {t("profile.lastName")}
            </label>

            <input
              id="profile-last-name"
              name="lastName"
              type="text"
              autoComplete="family-name"
              value={lastName}
              onChange={(event) => {
                setLastName(event.target.value);
                setSuccess(false);
              }}
              disabled={loading}
              className="mt-3 h-12 w-full border-0 border-b border-ink/15 bg-transparent px-0 text-base text-ink outline-none transition-colors placeholder:text-ink/25 focus:border-plum disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </div>

        <div>
          <label htmlFor="profile-phone" className={`block ${isAr ? "text-sm" : "text-xs"} font-semibold uppercase tracking-[0.25em] text-ink/40`}>
            {t("profile.phone")}
          </label>

          <input
            id="profile-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            value={phone}
            onChange={(event) => {
              setPhone(event.target.value);
              setSuccess(false);
            }}
            disabled={loading}
            className="mt-3 h-12 w-full border-0 border-b border-ink/15 bg-transparent px-0 text-base text-ink outline-none transition-colors placeholder:text-ink/25 focus:border-plum disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <div>
          <label htmlFor="profile-email" className={`block ${isAr ? "text-sm" : "text-xs"} font-semibold uppercase tracking-[0.25em] text-ink/40`}>
            {t("profile.email")}
          </label>

          <input
            id="profile-email"
            name="email"
            type="email"
            value={customer.email ?? ""}
            disabled
            className="mt-3 h-12 w-full border-0 border-b border-ink/10 bg-transparent px-0 text-base text-ink/35 outline-none"
          />

          <p className="mt-3 max-w-lg text-xs leading-6 text-ink/35">
            {t("profile.emailHint")}
          </p>
        </div>

        {error && (
          <div role="alert" className="flex items-start gap-4 border-s-2 border-coral bg-coral/5 px-5 py-4">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-coral" />

            <p className="text-sm leading-6 text-ink/70">
              {error}
            </p>
          </div>
        )}

        {success && (
          <div role="status" className="flex items-center gap-3 border-s-2 border-plum bg-plum/5 px-5 py-4">
            <Check className="h-4 w-4 shrink-0 text-plum" strokeWidth={1.5} />

            <p className="text-sm leading-6 text-ink/70">
              {t("profile.saved")}
            </p>
          </div>
        )}

        <div className="flex flex-col gap-5 pt-2 sm:flex-row sm:items-center">
          <button type="submit" disabled={loading} className="button-editorial button-editorial-primary inline-flex min-w-42.5 items-center justify-center gap-3 disabled:cursor-not-allowed disabled:opacity-50">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} />
                <span>{t("profile.saving")}</span>
              </>
            ) : (
              <span>{t("profile.save")}</span>
            )}
          </button>

          <div className="h-px w-8 bg-coral sm:w-10" />
        </div>
      </form>
    </section>
  );
}