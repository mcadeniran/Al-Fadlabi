"use client";

import {useState, useTransition} from "react";
import {useTranslations} from "next-intl";

import {setAdminRoleAction} from "@/app/[locale]/admin/(protected)/users/actions";
import type {ManagedUser} from "@/lib/admin/users";
import {useRouter} from "@/i18n/navigation";
import {RoleConfirmationDialog} from "./role-confirmation-dialog";

type AssignableRole = "admin" | "manager";

type UserRoleAssignmentProps = {
  user: ManagedUser;
};

export function UserRoleAssignment({
  user,
}: UserRoleAssignmentProps) {
  const t = useTranslations("Admin.Users");
  const router = useRouter();

  const [selectedRole, setSelectedRole] =
    useState<AssignableRole>("admin");

  const [message, setMessage] = useState("");

  const [isPending, startTransition] = useTransition();

  const [isConfirmationOpen, setIsConfirmationOpen] =
    useState(false);

  if (user.role !== null) {
    return null;
  }

  const userName =
    user.fullName ||
    t("common.unnamedCustomer");

  function handleAssignClick() {
    setMessage("");
    setIsConfirmationOpen(true);
  }

  function handleConfirmAssign() {
    setMessage("");

    startTransition(async () => {
      const result = await setAdminRoleAction(
        user.userId,
        selectedRole,
      );

      if (!result.success) {
        setMessage(result.message);
        setIsConfirmationOpen(false);
        return;
      }

      setMessage(
        t("messages.roleAssigned", {
          role: t(`roles.${selectedRole}`),
        }),
      );

      setIsConfirmationOpen(false);

      router.refresh();
    });
  }

  return (
    <>
      <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
        <label
          htmlFor={`assign-role-${user.userId}`}
          className="sr-only"
        >
          {t("controls.assignRoleFor", {
            name: userName,
          })}
        </label>

        <select
          id={`assign-role-${user.userId}`}
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
          disabled={isPending}
          onClick={handleAssignClick}
          className="h-10 rounded-xl border border-foreground px-4 text-xs uppercase tracking-[0.15em] transition-opacity hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isPending
            ? t("confirmations.pleaseWait")
            : t("controls.assignRole")}
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
        open={isConfirmationOpen}
        onOpenChange={(open) => {
          if (!isPending) {
            setIsConfirmationOpen(open);
          }
        }}
        title={t("confirmations.assignTitle", {role: ''})}
        description={t("confirmations.assignDescription", {
          name: userName,
          role: t(`roles.${selectedRole}`),
        })}
        cancelLabel={t("confirmations.cancel")}
        confirmLabel={t("confirmations.confirm")}
        pendingLabel={t("confirmations.pleaseWait")}
        isPending={isPending}
        onConfirm={handleConfirmAssign}
      />
    </>
  );
}