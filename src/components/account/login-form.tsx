"use client";

import {FormEvent, useState} from "react";
import Link from "next/link";
import {useTranslations} from "next-intl";

import {createClient} from "@/lib/supabase/client";
import {useRouter} from "@/i18n/navigation";

export function LoginForm() {
  const t = useTranslations("Auth");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail || !password) {
      setError(t("login.errors.required"));
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      const {error: signInError} =
        await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password,
        });

      if (signInError) {
        setError(t("login.errors.invalidCredentials"));
        return;
      }

      router.push(`/account`);
    } catch (error) {
      console.error("Login error:", error);
      setError(t("login.errors.generic"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="space-y-10">
      <div className="space-y-3 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          {t("login.eyebrow")}
        </p>

        <h1 className="font-serif text-4xl tracking-tight sm:text-5xl">
          {t("login.title")}
        </h1>

        <p className="mx-auto max-w-sm text-sm leading-7 text-muted-foreground">
          {t("login.description")}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
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
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={loading}
            className="h-12 w-full border border-border bg-transparent px-4 text-sm outline-none transition-colors focus:border-foreground disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="password"
            className="text-xs uppercase tracking-[0.15em]"
          >
            {t("login.password")}
          </label>

          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={loading}
            className="h-12 w-full border border-border bg-transparent px-4 text-sm outline-none transition-colors focus:border-foreground disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>

        {error && (
          <div
            role="alert"
            className="border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex h-12 w-full items-center justify-center border border-foreground bg-foreground px-6 text-xs uppercase tracking-[0.2em] text-background transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? t("login.signingIn") : t("login.submit")}
        </button>
      </form>

      <div className="border-t border-border pt-8 text-center">
        <p className="text-sm text-muted-foreground">
          {t("login.noAccount")}{" "}
          <Link
            href={`/account/register`}
            className="text-foreground underline underline-offset-4"
          >
            {t("login.register")}
          </Link>
        </p>
      </div>
    </section>
  );
}