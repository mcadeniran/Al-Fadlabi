'use client';

import {useState, useTransition} from 'react';

import {setAdminRoleAction} from '@/app/[locale]/admin/(protected)/users/actions';

import type {ManagedUser} from '@/lib/admin/users';
import {useRouter} from '@/i18n/navigation';

type AssignableRole = 'admin' | 'manager';

type UserRoleAssignmentProps = {
  users: ManagedUser[];
};

export function UserRoleAssignment({
  users,
}: UserRoleAssignmentProps) {
  const [roles, setRoles] = useState<Record<string, AssignableRole>>({});
  const [messages, setMessages] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  function handleAssign(user: ManagedUser) {
    const role = roles[user.userId] ?? 'admin';

    setMessages((current) => ({
      ...current,
      [user.userId]: '',
    }));

    startTransition(async () => {
      const result = await setAdminRoleAction(user.userId, role);

      if (!result.success) {
        setMessages((current) => ({
          ...current,
          [user.userId]: result.message,
        }));

        router.refresh();

        return;
      }

      setMessages((current) => ({
        ...current,
        [user.userId]: `Role assigned: ${role}.`,
      }));
    });
  }

  if (users.length === 0) {
    return (
      <p className="px-6 py-10 text-sm text-muted-foreground">
        There are no customers available for role assignment.
      </p>
    );
  }

  return (
    <div className="divide-y divide-border">
      {users.map((user) => {
        const selectedRole = roles[user.userId] ?? 'admin';

        return (
          <div
            key={user.customerId}
            className="space-y-4 px-6 py-5"
          >
            <div>
              <p className="font-medium">
                {user.fullName || 'Unnamed customer'}
              </p>

              <p className="text-sm text-muted-foreground">
                {user.email || 'No email'}
              </p>

              <p className="text-xs text-muted-foreground">
                {user.phone || 'No phone'}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <label
                htmlFor={`role-${user.userId}`}
                className="sr-only"
              >
                Select role for {user.fullName || 'customer'}
              </label>

              <select
                id={`role-${user.userId}`}
                value={selectedRole}
                disabled={isPending}
                onChange={(event) =>
                  setRoles((current) => ({
                    ...current,
                    [user.userId]: event.target.value as AssignableRole,
                  }))
                }
                className="h-11 border border-border bg-background px-3 text-sm"
              >
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
              </select>

              <button
                type="button"
                disabled={isPending}
                onClick={() => handleAssign(user)}
                className="h-11 border border-foreground bg-foreground px-5 text-xs uppercase tracking-[0.15em] text-background transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPending ? 'Assigning...' : 'Assign Role'}
              </button>
            </div>

            {messages[user.userId] && (
              <p
                role="status"
                className="text-sm text-muted-foreground"
              >
                {messages[user.userId]}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}