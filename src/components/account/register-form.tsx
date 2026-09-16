"use client";

import {FormEvent, useState} from "react";
import Link from "next/link";
import {useLocale, useTranslations} from "next-intl";

import {createClient} from "@/lib/supabase/client";
import {useRouter} from "@/i18n/navigation";

export function RegisterForm() {
  const t = useTranslations("Auth");
  const locale = useLocale();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess(false);

    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();
    const trimmedPhone = phone.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (
      !trimmedFirstName ||
      !trimmedLastName ||
      !trimmedPhone ||
      !trimmedEmail ||
      !password ||
      !confirmPassword
    ) {
      setError(t("register.errors.required"));
      return;
    }

    if (password.length < 8) {
      setError(t("register.errors.passwordLength"));
      return;
    }

    if (password !== confirmPassword) {
      setError(t("register.errors.passwordMatch"));
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      const {data, error: signUpError} = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
        options: {
          data: {
            first_name: trimmedFirstName,
            last_name: trimmedLastName,
            phone: trimmedPhone,
          },
          emailRedirectTo: `${window.location.origin}/${locale}/account`,
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      if (data.session) {
        router.push(`/${locale}/account`);
        return;
      }

      setSuccess(true);
    } catch (error) {
      console.error("Registration error:", error);

      setError(t("register.errors.generic"));
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <section className="space-y-8 text-center">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            {t("register.successEyebrow")}
          </p>

          <h1 className="font-serif text-4xl tracking-tight sm:text-5xl">
            {t("register.successTitle")}
          </h1>

          <p className="mx-auto max-w-sm text-sm leading-7 text-muted-foreground">
            {t("register.successDescription")}
          </p>
        </div>

        <Link
          href={`/${locale}/account/login`}
          className="inline-flex h-11 items-center justify-center border border-foreground px-8 text-xs uppercase tracking-[0.2em] transition-colors hover:bg-foreground hover:text-background"
        >
          {t("register.goToLogin")}
        </Link>
      </section>
    );
  }

  return (
    <section className="space-y-10">
      <div className="space-y-3 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          {t("register.eyebrow")}
        </p>

        <h1 className="font-serif text-4xl tracking-tight sm:text-5xl">
          {t("register.title")}
        </h1>

        <p className="mx-auto max-w-sm text-sm leading-7 text-muted-foreground">
          {t("register.description")}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <label
              htmlFor="firstName"
              className="text-xs uppercase tracking-[0.15em]"
            >
              {t("register.firstName")}
            </label>

            <input
              id="firstName"
              name="firstName"
              type="text"
              autoComplete="given-name"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              disabled={loading}
              className="h-12 w-full border border-border bg-transparent px-4 text-sm outline-none transition-colors focus:border-foreground disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="lastName"
              className="text-xs uppercase tracking-[0.15em]"
            >
              {t("register.lastName")}
            </label>

            <input
              id="lastName"
              name="lastName"
              type="text"
              autoComplete="family-name"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              disabled={loading}
              className="h-12 w-full border border-border bg-transparent px-4 text-sm outline-none transition-colors focus:border-foreground disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="phone"
            className="text-xs uppercase tracking-[0.15em]"
          >
            {t("register.phone")}
          </label>

          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            disabled={loading}
            className="h-12 w-full border border-border bg-transparent px-4 text-sm outline-none transition-colors focus:border-foreground disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="email"
            className="text-xs uppercase tracking-[0.15em]"
          >
            {t("register.email")}
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
            {t("register.password")}
          </label>

          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={loading}
            className="h-12 w-full border border-border bg-transparent px-4 text-sm outline-none transition-colors focus:border-foreground disabled:cursor-not-allowed disabled:opacity-60"
          />

          <p className="text-xs text-muted-foreground">
            {t("register.passwordHint")}
          </p>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="confirmPassword"
            className="text-xs uppercase tracking-[0.15em]"
          >
            {t("register.confirmPassword")}
          </label>

          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
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
          {loading ? t("register.creating") : t("register.submit")}
        </button>
      </form>

      <div className="border-t border-border pt-8 text-center">
        <p className="text-sm text-muted-foreground">
          {t("register.haveAccount")}{" "}
          <Link
            href={`/${locale}/account/login`}
            className="text-foreground underline underline-offset-4"
          >
            {t("register.login")}
          </Link>
        </p>
      </div>
    </section>
  );
}