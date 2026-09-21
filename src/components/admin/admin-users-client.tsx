"use client";

import {useMemo, useState} from "react";

import type {ManagedUser} from "@/lib/admin/users";
import {AdminUserRoleControls} from "./admin-user-role-controls";
import {UserRoleAssignment} from "./user-role-assignment";

type AdminUsersTranslations = {
  accessLevels: {
    eyebrow: string;
    title: string;
    description: string;
    owner: {
      title: string;
      badge: string;
      description: string;
    };
    admin: {
      title: string;
      badge: string;
      description: string;
    };
    manager: {
      title: string;
      badge: string;
      description: string;
    };
    roleManagementLabel: string;
    roleManagementDescription: string;
  };
  search: {
    eyebrow: string;
    title: string;
    description: string;
    label: string;
    placeholder: string;
    showing: string;
  };
  administration: {
    title: string;
    description: string;
    empty: string;
    noMatches: string;
  };
  customers: {
    title: string;
    description: string;
    empty: string;
    noMatches: string;
  };
  roles: {
    owner: string;
    admin: string;
    manager: string;
    customer: string;
    protected: string;
    productsOrders: string;
    ordersOnly: string;
    noAdminAccess: string;
  };
  common: {
    unnamedCustomer: string;
    noEmail: string;
  };
};

type AdminUsersClientProps = {
  users: ManagedUser[];
  canManageRoles: boolean;
  translations: AdminUsersTranslations;
};

function getUserInitials(fullName?: string | null) {
  if (!fullName?.trim()) {
    return "?";
  }

  return fullName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
}

type UserCardProps = {
  user: ManagedUser;
  translations: AdminUsersTranslations;
};

function UserCard({user, translations, }: UserCardProps) {
  const initials = getUserInitials(user.fullName);
  // const roleLabel = getRoleLabel(user.role);

  const roleLabel =
    user.role === "owner"
      ? translations.roles.owner
      : user.role === "admin"
        ? translations.roles.admin
        : user.role === "manager"
          ? translations.roles.manager
          : translations.roles.customer;

  return (
    <div className="group flex flex-col gap-5 px-6 py-5 transition-colors hover:bg-muted/30 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-4">
        <div
          aria-hidden="true"
          className="flex size-11 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-xs font-medium tracking-[0.08em]"
        >
          {initials}
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate font-medium">
              {user.fullName || translations.common.unnamedCustomer}
            </p>

            <span
              className={[
                "inline-flex shrink-0 rounded-full border px-2.5 py-1 text-sm uppercase tracking-[0.16em]",
                user.role === "owner"
                  ? "border-foreground bg-foreground text-background"
                  : user.role === "admin"
                    ? "border-foreground/20 bg-foreground/5 text-foreground"
                    : user.role === "manager"
                      ? "border-border bg-muted text-foreground"
                      : "border-border text-muted-foreground",
              ].join(" ")}
            >
              {roleLabel}
            </span>
          </div>

          <p className="mt-1 truncate text-sm text-muted-foreground">
            {user.email || translations.common.noEmail}
          </p>

          {user.phone && (
            <p className="mt-1 truncate text-xs text-muted-foreground">
              {user.phone}
            </p>
          )}
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-start gap-3 sm:items-end">
        {user.role === "owner" ? (
          <span className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            {translations.roles.protected}
          </span>
        ) : user.role === "admin" ? (
          <span className="text-xs text-muted-foreground">
            {translations.roles.productsOrders}
          </span>
        ) : user.role === "manager" ? (
          <span className="text-xs text-muted-foreground">
            {translations.roles.ordersOnly}
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">
            {translations.roles.noAdminAccess}
          </span>
        )}

        {user.role === null ? (
          <UserRoleAssignment user={user} />
        ) : user.role !== "owner" ? (
          <AdminUserRoleControls user={user} />
        ) : null}
      </div>
    </div>
  );
}

export function AdminUsersClient({
  users,
  canManageRoles,
  translations,
}: AdminUsersClientProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const managedUsers = useMemo(
    () => users.filter((user) => user.role !== null),
    [users]
  );

  const customers = useMemo(
    () => users.filter((user) => user.role === null),
    [users]
  );

  const normalizedQuery = searchQuery.trim().toLowerCase();

  function matchesSearch(user: ManagedUser) {
    if (!normalizedQuery) return true;

    return [user.fullName, user.email, user.phone]
      .filter(Boolean)
      .some((value) =>
        value!.toLowerCase().includes(normalizedQuery)
      );
  }

  const filteredManagedUsers = useMemo(
    () => managedUsers.filter(matchesSearch),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [managedUsers, normalizedQuery]
  );

  const filteredCustomers = useMemo(
    () => customers.filter(matchesSearch),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [customers, normalizedQuery]
  );

  const totalVisibleUsers =
    filteredManagedUsers.length + filteredCustomers.length;

  console.log(filteredCustomers);
  console.log(filteredManagedUsers);

  return (
    <div className="space-y-10">
      {/* Access levels */}
      <section className="rounded-3xl border border-border bg-background p-6 sm:p-8">
        <div className="max-w-2xl">
          <p className="text-sm uppercase tracking-[0.25em] text-muted-foreground">
            {translations.accessLevels.eyebrow}
          </p>

          <h2 className="mt-2 font-serif text-2xl tracking-tight">
            {translations.accessLevels.title}
          </h2>

          <p className="mt-2 text-sm leading-7 text-muted-foreground">
            {translations.accessLevels.description}
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-border p-5">
            <div className="flex items-center justify-between gap-4">
              <h3 className="font-medium">{translations.accessLevels.owner.title}</h3>

              <span className="rounded-full border border-border px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                {translations.accessLevels.owner.badge}
              </span>
            </div>

            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              {translations.accessLevels.owner.description}
            </p>
          </div>

          <div className="rounded-2xl border border-border p-5">
            <div className="flex items-center justify-between gap-4">
              <h3 className="font-medium">{translations.accessLevels.admin.title}</h3>

              <span className="rounded-full border border-border px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                {translations.accessLevels.admin.badge}
              </span>
            </div>

            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              {translations.accessLevels.admin.description}
            </p>
          </div>

          <div className="rounded-2xl border border-border p-5">
            <div className="flex items-center justify-between gap-4">
              <h3 className="font-medium">{translations.accessLevels.manager.title}</h3>

              <span className="rounded-full border border-border px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                {translations.accessLevels.manager.badge}
              </span>
            </div>

            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              {translations.accessLevels.manager.description}
            </p>
          </div>
        </div>

        {canManageRoles && (
          <div className="mt-6 border-t border-border pt-5">
            <p className="text-base leading-5 text-muted-foreground">
              <span className="font-medium text-foreground">
                {translations.accessLevels.roleManagementLabel}
              </span>{" "}
              {translations.accessLevels.roleManagementDescription}
            </p>
          </div>
        )}
      </section>

      {/* Search */}
      <section className="space-y-4">
        <div>
          <h2 className="font-serif text-xl tracking-tight">
            {translations.search.eyebrow}
          </h2>

          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {translations.search.description}
          </p>
        </div>

        <div className="relative">
          <label htmlFor="user-search" className="sr-only">
            {translations.search.title}
          </label>

          <input
            id="user-search"
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder={translations.search.placeholder}
            className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground"
          />
        </div>

        {normalizedQuery && (
          <p className="text-xs text-muted-foreground">
            {translations.search.showing
              .replace("{count}", String(totalVisibleUsers))
              .replace("{query}", searchQuery.trim())}
          </p>
        )}
      </section>

      {/* Administration */}
      <section className="space-y-4">
        <div>
          <h2 className="font-serif text-xl tracking-tight">
            {translations.administration.title}
          </h2>

          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {translations.administration.description}
          </p>
        </div>

        <div className="rounded-3xl border border-border bg-background">
          {filteredManagedUsers.length === 0 ? (
            <div className="px-6 py-10 text-sm text-muted-foreground">
              {normalizedQuery
                ? translations.administration.noMatches
                : translations.administration.empty}
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredManagedUsers.map((user) => (
                <UserCard
                  key={user.customerId}
                  user={user}
                  translations={translations}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Customers */}
      {canManageRoles && (
        <section className="space-y-4">
          <div>
            <h2 className="font-serif text-xl tracking-tight">
              {translations.customers.title}
            </h2>

            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              {translations.customers.description}
            </p>
          </div>

          <div className="rounded-3xl border border-border bg-background">
            {filteredCustomers.length === 0 ? (
              <div className="px-6 py-10 text-sm text-muted-foreground">
                {normalizedQuery
                  ? translations.customers.noMatches
                  : translations.customers.empty}
              </div>
            ) : (
              <div className="divide-y divide-border">
                {filteredCustomers.map((user) => (
                  <UserCard
                    key={user.customerId}
                    user={user}
                    translations={translations}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
