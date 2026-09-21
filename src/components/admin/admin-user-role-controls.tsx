"use client";

import {useState, useTransition} from "react";
import {useTranslations} from "next-intl";

import {
  revokeAdminRoleAction,
  setAdminRoleAction,
} from "@/app/[locale]/admin/(protected)/users/actions";
import type {ManagedUser} from "@/lib/admin/users";
import {useRouter} from "@/i18n/navigation";
import {RoleConfirmationDialog} from "./role-confirmation-dialog";

type AssignableRole = "admin" | "manager";

type AdminUserRoleControlsProps = {
  user: ManagedUser;
};

type ConfirmationAction = "change" | "revoke" | null;

export function AdminUserRoleControls({
  user,
}: AdminUserRoleControlsProps) {
  const t = useTranslations("Admin.Users");
  const router = useRouter();

  const [selectedRole, setSelectedRole] =
    useState<AssignableRole>(
      user.role === "manager" ? "manager" : "admin",
    );

  const [message, setMessage] = useState("");

  const [isPending, startTransition] = useTransition();

  const [confirmationAction, setConfirmationAction] =
    useState<ConfirmationAction>(null);

  if (!user.role || user.role === "owner") {
    return null;
  }

  const userName =
    user.fullName ||
    t("common.unnamedCustomer");

  function handleChangeRoleClick() {
    if (selectedRole === user.role) {
      setMessage(
        t("messages.chooseDifferentRole"),
      );
      return;
    }

    setMessage("");
    setConfirmationAction("change");
  }

  function handleConfirmChangeRole() {
    setMessage("");

    startTransition(async () => {
      const result = await setAdminRoleAction(
        user.userId,
        selectedRole,
      );

      if (!result.success) {
        setMessage(result.message);
        setConfirmationAction(null);
        return;
      }

      setMessage(
        t("messages.roleUpdated", {
          role: t(`roles.${selectedRole}`),
        }),
      );

      setConfirmationAction(null);

      router.refresh();
    });
  }

  function handleRevokeClick() {
    setMessage("");
    setConfirmationAction("revoke");
  }

  function handleConfirmRevoke() {
    setMessage("");

    startTransition(async () => {
      const result = await revokeAdminRoleAction(
        user.userId,
      );

      if (!result.success) {
        setMessage(result.message);
        setConfirmationAction(null);
        return;
      }

      setMessage(
        t("messages.accessRevoked"),
      );

      setConfirmationAction(null);

      router.refresh();
    });
  }

  const isChangeConfirmation =
    confirmationAction === "change";

  const isRevokeConfirmation =
    confirmationAction === "revoke";

  return (
    <>
      <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
        <label
          htmlFor={`admin-role-${user.userId}`}
          className="sr-only"
        >
          {t("controls.changeRoleFor", {
            name: userName,
          })}
        </label>

        <select
          id={`admin-role-${user.userId}`}
          value={selectedRole}
          disabled={isPending}
          onChange={(event) =>
            setSelectedRole(
              event.target.value as AssignableRole,
            )
          }
          className="h-10 rounded-xl border border-border bg-background px-3 text-sm outline-none transition-colors focus:border-foreground disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="admin">
            {t("roles.admin")}
          </option>

          <option value="manager">
            {t("roles.manager")}
          </option>
        </select>

        <button
          type="button"
          disabled={
            isPending ||
            selectedRole === user.role
          }
          onClick={handleChangeRoleClick}
          className="h-10 rounded-xl border border-foreground px-4 text-xs uppercase tracking-[0.15em] transition-opacity hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isPending && isChangeConfirmation
            ? t("confirmations.pleaseWait")
            : t("controls.changeRole")}
        </button>

        <button
          type="button"
          disabled={isPending}
          onClick={handleRevokeClick}
          className="h-10 rounded-xl border border-destructive px-4 text-xs uppercase tracking-[0.15em] text-destructive transition-opacity hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isPending && isRevokeConfirmation
            ? t("confirmations.pleaseWait")
            : t("controls.revokeAccess")}
        </button>
      </div>

      {message && (
        <p
          role="status"
          className="text-xs text-muted-foreground"
        >
          {message}
        </p>
      )}

      <RoleConfirmationDialog
        open={confirmationAction !== null}
        onOpenChange={(open) => {
          if (!isPending && !open) {
            setConfirmationAction(null);
          }
        }}
        title={
          isRevokeConfirmation
            ? t("confirmations.revokeTitle")
            : t("confirmations.changeTitle")
        }
        description={
          isRevokeConfirmation
            ? t(
              "confirmations.revokeDescription",
              {
                name: userName,
              },
            )
            : t(
              "confirmations.changeDescription",
              {
                name: userName,
                currentRole: t(
                  `roles.${user.role}`,
                ),
                newRole: t(
                  `roles.${selectedRole}`,
                ),
              },
            )
        }
        cancelLabel={t("confirmations.cancel")}
        confirmLabel={
          isRevokeConfirmation
            ? t("confirmations.revoke")
            : t("confirmations.confirm")
        }
        pendingLabel={t("confirmations.pleaseWait")}
        isPending={isPending}
        destructive={isRevokeConfirmation}
        onConfirm={
          isRevokeConfirmation
            ? handleConfirmRevoke
            : handleConfirmChangeRole
        }
      />
    </>
  );
}