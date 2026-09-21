"use client";

import {useState} from "react";
import type {FormEvent} from "react";
import {Check, Eye, EyeOff, Loader2} from "lucide-react";
import {useLocale, useTranslations} from "next-intl";
import {createClient} from "@/lib/supabase/client";

type PasswordToggleProps = {
  visible: boolean;
  onClick: () => void;
  label: string;
  disabled?: boolean;
};

function PasswordToggle({
  visible,
  onClick,
  label,
  disabled = false,
}: PasswordToggleProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="absolute inset-e-0 bottom-3 text-ink/35 transition-colors hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
    >
      {visible ? (
        <EyeOff className="h-4 w-4" strokeWidth={1.5} />
      ) : (
        <Eye className="h-4 w-4" strokeWidth={1.5} />
      )}
    </button>
  );
}

type PasswordChangeErrorCode =
  | "incorrectCurrent"
  | "weakPassword"
  | "samePassword"
  | "updateFailed";

function getPasswordChangeErrorCode(
  code?: string,
): PasswordChangeErrorCode {
  switch (code) {
    case "invalid_credentials":
      return "incorrectCurrent";

    case "weak_password":
      return "weakPassword";

    case "same_password":
      return "samePassword";

    default:
      return "updateFailed";
  }
}

export function ChangePasswordForm() {
  const t = useTranslations("Auth");
  const locale = useLocale();
  const isAr = locale === "ar";

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess(false);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError(t("changePassword.errors.required"));
      return;
    }

    if (newPassword.length < 8) {
      setError(t("changePassword.errors.tooShort"));
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(t("changePassword.errors.mismatch"));
      return;
    }

    if (currentPassword === newPassword) {
      setError(t("changePassword.errors.samePassword"));
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      const {error: updateError} = await supabase.auth.updateUser({
        password: newPassword,
        current_password: currentPassword,
      });

      if (updateError) {
        console.error("Password change error:", {
          code: updateError.code,
          message: updateError.message,
        });

        const errorCode = getPasswordChangeErrorCode(
          updateError.code,
        );

        setError(
          t(`changePassword.errors.${errorCode}`),
        );

        return;
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);

      setSuccess(true);
    } catch (error) {
      console.error("Change password error:", error);
      setError(t("changePassword.errors.generic"));
    } finally {
      setLoading(false);
    }
  }

  const inputClassName =
    "mt-3 h-12 w-full border-0 border-b border-ink/15 bg-transparent px-0 pe-10 text-base text-ink outline-none transition-colors placeholder:text-ink/25 focus:border-plum disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <section className="max-w-3xl">
      <div className="mb-10">
        <p className="eyebrow text-plum">
          {t("changePassword.eyebrow")}
        </p>

        <h2
          className={`mt-4 font-editorial leading-[0.9] tracking-[-0.035em] ${isAr
            ? "text-xl sm:text-2xl"
            : "text-lg sm:text-xl"
            }`}
        >
          {t("changePassword.title")}
        </h2>

        <p
          className={`mt-5 max-w-xl ${isAr ? "text-base" : "text-sm"
            } leading-7 text-ink/50`}
        >
          {t("changePassword.description")}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-9">
        {/* Current password */}
        <div className="group">
          <label
            htmlFor="current-password"
            className={`block ${isAr ? "text-sm" : "text-xs"
              } font-semibold uppercase tracking-[0.25em] text-ink/40`}
          >
            {t("changePassword.currentPassword")}
          </label>

          <div className="relative">
            <input
              id="current-password"
              name="currentPassword"
              type={showCurrentPassword ? "text" : "password"}
              autoComplete="current-password"
              value={currentPassword}
              onChange={(event) => {
                setCurrentPassword(event.target.value);
                setSuccess(false);
              }}
              disabled={loading}
              className={inputClassName}
            />

            <PasswordToggle
              visible={showCurrentPassword}
              onClick={() =>
                setShowCurrentPassword(
                  (value) => !value,
                )
              }
              disabled={loading}
              label={
                showCurrentPassword
                  ? t("changePassword.hidePassword")
                  : t("changePassword.showPassword")
              }
            />
          </div>
        </div>

        {/* New password */}
        <div className="group">
          <label
            htmlFor="new-password"
            className={`block ${isAr ? "text-sm" : "text-xs"
              } font-semibold uppercase tracking-[0.25em] text-ink/40`}
          >
            {t("changePassword.newPassword")}
          </label>

          <div className="relative">
            <input
              id="new-password"
              name="newPassword"
              type={showNewPassword ? "text" : "password"}
              autoComplete="new-password"
              minLength={8}
              value={newPassword}
              onChange={(event) => {
                setNewPassword(event.target.value);
                setSuccess(false);
              }}
              disabled={loading}
              className={inputClassName}
            />

            <PasswordToggle
              visible={showNewPassword}
              onClick={() =>
                setShowNewPassword(
                  (value) => !value,
                )
              }
              disabled={loading}
              label={
                showNewPassword
                  ? t("changePassword.hidePassword")
                  : t("changePassword.showPassword")
              }
            />
          </div>

          <p className="mt-3 text-xs leading-6 text-ink/35">
            {t("changePassword.passwordHint")}
          </p>
        </div>

        {/* Confirm new password */}
        <div className="group">
          <label
            htmlFor="confirm-new-password"
            className={`block ${isAr ? "text-sm" : "text-xs"
              } font-semibold uppercase tracking-[0.25em] text-ink/40`}
          >
            {t("changePassword.confirmPassword")}
          </label>

          <div className="relative">
            <input
              id="confirm-new-password"
              name="confirmNewPassword"
              type={
                showConfirmPassword ? "text" : "password"
              }
              autoComplete="new-password"
              minLength={8}
              value={confirmPassword}
              onChange={(event) => {
                setConfirmPassword(event.target.value);
                setSuccess(false);
              }}
              disabled={loading}
              className={inputClassName}
            />

            <PasswordToggle
              visible={showConfirmPassword}
              onClick={() =>
                setShowConfirmPassword(
                  (value) => !value,
                )
              }
              disabled={loading}
              label={
                showConfirmPassword
                  ? t("changePassword.hidePassword")
                  : t("changePassword.showPassword")
              }
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="flex items-start gap-4 border-s-2 border-coral bg-coral/5 px-5 py-4"
          >
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-coral" />

            <p className="text-sm leading-6 text-ink/70">
              {error}
            </p>
          </div>
        )}

        {/* Success */}
        {success && (
          <div
            role="status"
            className="flex items-center gap-3 border-s-2 border-plum bg-plum/5 px-5 py-4"
          >
            <Check
              className="h-4 w-4 shrink-0 text-plum"
              strokeWidth={1.5}
            />

            <p className="text-sm leading-6 text-ink/70">
              {t("changePassword.saved")}
            </p>
          </div>
        )}

        {/* Submit */}
        <div className="flex flex-col gap-5 pt-2 sm:flex-row sm:items-center">
          <button
            type="submit"
            disabled={loading}
            className="button-editorial button-editorial-primary inline-flex min-w-42.5 items-center justify-center gap-3 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2
                  className="h-4 w-4 animate-spin"
                  strokeWidth={1.5}
                />

                <span>
                  {t("changePassword.saving")}
                </span>
              </>
            ) : (
              <span>{t("changePassword.save")}</span>
            )}
          </button>

          <div className="h-px w-8 bg-coral sm:w-10" />
        </div>
      </form>
    </section>
  );
}