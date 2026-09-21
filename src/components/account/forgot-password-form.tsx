"use client";

import {FormEvent, useState} from "react";
import Link from "next/link";
import {useLocale, useTranslations} from "next-intl";
import {createClient} from "@/lib/supabase/client";

export function ForgotPasswordForm() {
  const t = useTranslations("Auth");
  const locale = useLocale();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess(false);

    const trimmedEmail = email.trim().toLowerCase();

    // Basic email validation
    if (
      !trimmedEmail ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)
    ) {
      setError(t("forgotPassword.errors.invalidEmail"));
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      const redirectTo = new URL(
        `/${locale}/account/reset-password`,
        window.location.origin
      ).toString();

      const {error: resetError} =
        await supabase.auth.resetPasswordForEmail(
          trimmedEmail,
          {redirectTo}
        );

      if (resetError) {
        console.error(
          "Password reset request error:",
          resetError.message
        );

        setError(t("forgotPassword.errors.generic"));
        return;
      }

      // Keep this message neutral to avoid revealing
      // whether an account exists for this email.
      setSuccess(true);
    } catch (error) {
      console.error("Forgot password error:", error);
      setError(t("forgotPassword.errors.generic"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="space-y-8">
      <div className="space-y-3 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          {t("forgotPassword.eyebrow")}
        </p>

        <h1 className="font-serif text-4xl tracking-tight sm:text-5xl">
          {t("forgotPassword.title")}
        </h1>

        <p className="mx-auto max-w-sm text-sm leading-7 text-muted-foreground">
          {t("forgotPassword.description")}
        </p>
      </div>

      {success ? (
        <div
          role="status"
          className="space-y-4 rounded-xl border border-border bg-muted/30 p-5 text-center"
        >
          <p className="text-sm leading-7">
            {t("forgotPassword.success")}
          </p>

          <p className="text-xs leading-6 text-muted-foreground">
            {t("forgotPassword.successHint")}
          </p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-xs uppercase tracking-[0.15em]"
            >
              {t("login.email")}
            </label>

            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              disabled={loading}
              placeholder={t(
                "forgotPassword.emailPlaceholder"
              )}
              className="h-12 w-full rounded-xl border border-border bg-transparent px-4 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-foreground disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex h-12 w-full items-center justify-center rounded-xl border border-foreground bg-foreground px-6 text-xs uppercase tracking-[0.2em] text-background transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? t("forgotPassword.sending")
              : t("forgotPassword.submit")}
          </button>
        </form>
      )}

      <div className="border-t border-border pt-6 text-center">
        <Link
          href="/account/login"
          className="text-sm text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
        >
          {t("forgotPassword.backToLogin")}
        </Link>
      </div>
    </section>
  );
}