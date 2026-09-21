"use client";

import {FormEvent, useEffect, useRef, useState} from "react";
import Link from "next/link";
import {useTranslations} from "next-intl";
import {createClient} from "@/lib/supabase/client";

type RecoveryStatus = "checking" | "ready" | "invalid";

export function ResetPasswordForm() {
  const t = useTranslations("Auth");

  const [status, setStatus] = useState<RecoveryStatus>("checking");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    let active = true;

    async function verifyRecovery() {
      try {
        const supabase = createClient();
        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");
        const tokenHash = url.searchParams.get("token_hash");
        const type = url.searchParams.get("type");

        console.info("Recovery callback parameters:", {
          hasCode: Boolean(code),
          hasTokenHash: Boolean(tokenHash),
          type,
          hasError: url.searchParams.has("error"),
          errorCode: url.searchParams.get("error_code"),
        });

        if (code) {
          const {error: exchangeError} =
            await supabase.auth.exchangeCodeForSession(code);

          if (exchangeError) {
            throw exchangeError;
          }

          // Remove the one-time code from the address bar.
          url.searchParams.delete("code");
          window.history.replaceState({}, "", url.toString());
        }

        const {
          data: {session},
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError || !session) {
          throw sessionError ?? new Error("Recovery session missing");
        }

        if (active) setStatus("ready");
      } catch (err) {
        console.error("Recovery verification error:", err);

        if (active) setStatus("invalid");
      }
    }

    void verifyRecovery();

    return () => {
      active = false;
    };
  }, []);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setError("");

    if (password.length < 8) {
      setError(t("resetPassword.errors.tooShort"));
      return;
    }

    if (password !== confirmPassword) {
      setError(t("resetPassword.errors.mismatch"));
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      const {error: updateError} =
        await supabase.auth.updateUser({password});

      if (updateError) {
        console.error(
          "Password update error:",
          updateError.message
        );

        setError(t("resetPassword.errors.updateFailed"));
        return;
      }

      setSuccess(true);
    } catch (err) {
      console.error("Reset password error:", err);
      setError(t("resetPassword.errors.generic"));
    } finally {
      setLoading(false);
    }
  }

  if (status === "checking") {
    return (
      <section
        className="space-y-3 py-8 text-center"
        role="status"
      >
        <h1 className="font-serif text-3xl">
          {t("resetPassword.verifying")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t("resetPassword.pleaseWait")}
        </p>
      </section>
    );
  }

  if (status === "invalid") {
    return (
      <section className="space-y-5 text-center">
        <h1 className="font-serif text-3xl">
          {t("resetPassword.invalidTitle")}
        </h1>

        <p className="text-sm leading-7 text-muted-foreground">
          {t("resetPassword.invalidDescription")}
        </p>

        <Link
          href="/account/forgot-password"
          className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-foreground px-6 text-xs uppercase tracking-widest text-background"
        >
          {t("resetPassword.requestNewLink")}
        </Link>
      </section>
    );
  }

  if (success) {
    return (
      <section className="space-y-5 text-center">
        <h1 className="font-serif text-3xl">
          {t("resetPassword.successTitle")}
        </h1>

        <p
          role="status"
          className="text-sm leading-7 text-muted-foreground"
        >
          {t("resetPassword.successDescription")}
        </p>

        <Link
          href="/account/login"
          className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-foreground px-6 text-xs uppercase tracking-widest text-background"
        >
          {t("resetPassword.backToLogin")}
        </Link>
      </section>
    );
  }

  return (
    <section className="space-y-8">
      <div className="space-y-3 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          {t("resetPassword.eyebrow")}
        </p>

        <h1 className="font-serif text-4xl tracking-tight sm:text-5xl">
          {t("resetPassword.title")}
        </h1>

        <p className="text-sm leading-7 text-muted-foreground">
          {t("resetPassword.description")}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label
            htmlFor="new-password"
            className="text-xs uppercase tracking-widest"
          >
            {t("resetPassword.newPassword")}
          </label>

          <input
            id="new-password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            className="h-12 w-full rounded-xl border border-border bg-transparent px-4 text-sm outline-none focus:border-foreground disabled:opacity-50"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="confirm-password"
            className="text-xs uppercase tracking-widest"
          >
            {t("resetPassword.confirmPassword")}
          </label>

          <input
            id="confirm-password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
            className="h-12 w-full rounded-xl border border-border bg-transparent px-4 text-sm outline-none focus:border-foreground disabled:opacity-50"
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
          className="flex h-12 w-full items-center justify-center rounded-xl bg-foreground px-6 text-xs uppercase tracking-widest text-background transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? t("resetPassword.updating")
            : t("resetPassword.submit")}
        </button>
      </form>
    </section>
  );
}