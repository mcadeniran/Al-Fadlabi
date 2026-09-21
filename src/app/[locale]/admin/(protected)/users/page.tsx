import {AdminUsersClient} from '@/components/admin/admin-users-client';
import {requireAdmin, requireAdminRole} from '@/lib/admin/auth/require-admin';
import {getManagedUsers} from '@/lib/admin/users';
import {getTranslations} from 'next-intl/server';

export default async function AdminUsersPage({
  params,
}: {
  params: Promise<{locale: string;}>;
}) {
  const {locale} = await params;
  await requireAdminRole(locale, ["owner"]);
  const t = await getTranslations("Admin.Users");

  const admin = await requireAdmin(locale);
  const users = await getManagedUsers();

  const translations = {
    accessLevels: {
      eyebrow: t("accessLevels.eyebrow"),
      title: t("accessLevels.title"),
      description: t("accessLevels.description"),

      owner: {
        title: t("accessLevels.owner.title"),
        badge: t("accessLevels.owner.badge"),
        description: t("accessLevels.owner.description"),
      },

      admin: {
        title: t("accessLevels.admin.title"),
        badge: t("accessLevels.admin.badge"),
        description: t("accessLevels.admin.description"),
      },

      manager: {
        title: t("accessLevels.manager.title"),
        badge: t("accessLevels.manager.badge"),
        description: t("accessLevels.manager.description"),
      },

      roleManagementLabel: t("accessLevels.roleManagementLabel"),
      roleManagementDescription: t(
        "accessLevels.roleManagementDescription"
      ),
    },

    search: {
      eyebrow: t("search.eyebrow"),
      title: t("search.title"),
      description: t("search.description"),
      label: t("search.label"),
      placeholder: t("search.placeholder"),
      showing: t("search.showing", {
        count: 0,
        query: "",
      }),
    },

    administration: {
      title: t("administration.title"),
      description: t("administration.description"),
      empty: t("administration.empty"),
      noMatches: t("administration.noMatches"),
    },

    customers: {
      title: t("customers.title"),
      description: t("customers.description"),
      empty: t("customers.empty"),
      noMatches: t("customers.noMatches"),
    },

    roles: {
      owner: t("roles.owner"),
      admin: t("roles.admin"),
      manager: t("roles.manager"),
      customer: t("roles.customer"),
      protected: t("roles.protected"),
      productsOrders: t("roles.productsOrders"),
      ordersOnly: t("roles.ordersOnly"),
      noAdminAccess: t("roles.noAdminAccess"),
    },

    common: {
      unnamedCustomer: t("common.unnamedCustomer"),
      noEmail: t("common.noEmail"),
    },
  };

  return (
    <div className="space-y-10">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
          {t("eyebrow")}
        </p>

        <h1 className="mt-2 font-serif text-3xl tracking-tight">
          {t("title")}
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
          {t("description")}
        </p>
      </div>

      <AdminUsersClient
        users={users}
        canManageRoles={admin.role === "owner"}
        translations={translations}
      />
    </div>
  );
  // return (
  //   <div className="space-y-10">
  //     <div>
  //       <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
  //         User Management
  //       </p>

  //       <h1 className="mt-2 font-serif text-3xl tracking-tight">
  //         Users
  //       </h1>

  //       <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
  //         Manage customer accounts and administration roles.
  //       </p>
  //     </div>

  //     <section className="space-y-4">
  //       <div>
  //         <h2 className="font-serif text-xl">
  //           Administration
  //         </h2>

  //         <p className="mt-1 text-sm text-muted-foreground">
  //           Users who currently have access to the admin area.
  //         </p>
  //       </div>

  //       <div className="border border-border">
  //         {managedUsers.length === 0 ? (
  //           <div className="px-6 py-10 text-sm text-muted-foreground">
  //             No admin users found.
  //           </div>
  //         ) : (
  //           <div className="divide-y divide-border">
  //             {managedUsers.map((user) => (
  //               <div
  //                 key={user.customerId}
  //                 className="flex flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center lg:justify-between"
  //               >
  //                 <div className="space-y-1">
  //                   <p className="font-medium">
  //                     {user.fullName || 'Unnamed customer'}
  //                   </p>

  //                   <p className="text-sm text-muted-foreground">
  //                     {user.email || 'No email'}
  //                   </p>

  //                   <p className="text-xs text-muted-foreground">
  //                     {user.phone || 'No phone'}
  //                   </p>
  //                 </div>

  //                 <div className="flex items-center gap-4">
  //                   <span className="border border-border px-3 py-1 text-xs uppercase tracking-[0.15em]">
  //                     {user.role}
  //                   </span>
  //                 </div>
  //               </div>
  //             ))}
  //           </div>
  //         )}
  //       </div>
  //     </section>

  //     {admin.role === 'owner' && (
  //       <section className="space-y-4">
  //         <div>
  //           <h2 className="font-serif text-xl">
  //             Customers
  //           </h2>

  //           <p className="mt-1 text-sm text-muted-foreground">
  //             Customers who do not currently have an administration role.
  //           </p>
  //         </div>

  //         <div className="border border-border">
  //           <UserRoleAssignment users={customers} />
  //           <AdminUserRoleControls users={managedUsers} />
  //         </div>
  //       </section>
  //     )}
  //   </div>
  // );
}