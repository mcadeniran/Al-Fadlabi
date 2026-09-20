'use client';

import {useState, useTransition} from 'react';

import {useRouter} from '@/i18n/navigation';

import {
  revokeAdminRoleAction,
  setAdminRoleAction,
} from '@/app/[locale]/admin/(protected)/users/actions';

import type {ManagedUser} from '@/lib/admin/users';

type AdminUserRoleControlsProps = {
  users: ManagedUser[];
};

export function AdminUserRoleControls({
  users,
}: AdminUserRoleControlsProps) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const [messages, setMessages] = useState<Record<string, string>>({});
  const [roles, setRoles] = useState<Record<string, 'admin' | 'manager'>>({});

  const adminUsers = users.filter((user) => user.role !== null);

  function handleChangeRole(user: ManagedUser) {
    if (!user.role || user.role === 'owner') return;

    const role = roles[user.userId] ?? user.role;

    if (role === user.role) {
      setMessages((current) => ({
        ...current,
        [user.userId]: 'Choose a different role first.',
      }));
      return;
    }

    startTransition(async () => {
      const result = await setAdminRoleAction(user.userId, role);

      if (!result.success) {
        setMessages((current) => ({
          ...current,
          [user.userId]: result.message,
        }));
        return;
      }

      setMessages((current) => ({
        ...current,
        [user.userId]: `Role updated to ${role}.`,
      }));

      router.refresh();
    });
  }

  function handleRevoke(user: ManagedUser) {
    if (!user.role || user.role === 'owner') return;

    const confirmed = window.confirm(
      `Revoke ${user.fullName || 'this user'}'s ${user.role} access?`,
    );

    if (!confirmed) return;

    startTransition(async () => {
      const result = await revokeAdminRoleAction(user.userId);

      if (!result.success) {
        setMessages((current) => ({
          ...current,
          [user.userId]: result.message,
        }));
        return;
      }

      setMessages((current) => ({
        ...current,
        [user.userId]: 'Admin access revoked.',
      }));

      router.refresh();
    });
  }

  if (adminUsers.length === 0) {
    return (
      <p className="px-6 py-10 text-sm text-muted-foreground">
        No admin users found.
      </p>
    );
  }

  return (
    <div className="divide-y divide-border">
      {adminUsers.map((user) => {
        const isOwner = user.role === 'owner';
        const selectedRole =
          roles[user.userId] ??
          (user.role === 'manager' ? 'manager' : 'admin');

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

            {isOwner ? (
              <span className="inline-flex border border-border px-3 py-1 text-xs uppercase tracking-[0.15em]">
                Owner · Protected
              </span>
            ) : (
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <label
                  htmlFor={`admin-role-${user.userId}`}
                  className="sr-only"
                >
                  Change role for {user.fullName || 'admin user'}
                </label>

                <select
                  id={`admin-role-${user.userId}`}
                  value={selectedRole}
                  disabled={isPending}
                  onChange={(event) =>
                    setRoles((current) => ({
                      ...current,
                      [user.userId]: event.target.value as
                        | 'admin'
                        | 'manager',
                    }))
                  }
                  className="h-11 border border-border bg-background px-3 text-sm"
                >
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                </select>

                <button
                  type="button"
                  disabled={isPending || selectedRole === user.role}
                  onClick={() => handleChangeRole(user)}
                  className="h-11 border border-foreground px-5 text-xs uppercase tracking-[0.15em] transition-opacity hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Change Role
                </button>

                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => handleRevoke(user)}
                  className="h-11 border border-destructive px-5 text-xs uppercase tracking-[0.15em] text-destructive transition-opacity hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Revoke Access
                </button>
              </div>
            )}

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