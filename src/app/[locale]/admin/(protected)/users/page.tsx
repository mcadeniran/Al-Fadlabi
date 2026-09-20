
import {AdminUserRoleControls} from '@/components/admin/admin-user-role-controls';
import {UserRoleAssignment} from '@/components/admin/user-role-assignment';
import {requireAdmin} from '@/lib/admin/auth/require-admin';
import {getManagedUsers} from '@/lib/admin/users';

export default async function AdminUsersPage({
  params,
}: {
  params: Promise<{locale: string;}>;
}) {
  const {locale} = await params;

  const admin = await requireAdmin(locale);
  const users = await getManagedUsers();

  const managedUsers = users.filter((user) => user.role !== null);
  const customers = users.filter((user) => user.role === null);

  return (
    <div className="space-y-10">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
          User Management
        </p>

        <h1 className="mt-2 font-serif text-3xl tracking-tight">
          Users
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
          Manage customer accounts and administration roles.
        </p>
      </div>

      <section className="space-y-4">
        <div>
          <h2 className="font-serif text-xl">
            Administration
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Users who currently have access to the admin area.
          </p>
        </div>

        <div className="border border-border">
          {managedUsers.length === 0 ? (
            <div className="px-6 py-10 text-sm text-muted-foreground">
              No admin users found.
            </div>
          ) : (
            <div className="divide-y divide-border">
              {managedUsers.map((user) => (
                <div
                  key={user.customerId}
                  className="flex flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center lg:justify-between"
                >
                  <div className="space-y-1">
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

                  <div className="flex items-center gap-4">
                    <span className="border border-border px-3 py-1 text-xs uppercase tracking-[0.15em]">
                      {user.role}
                    </span>

                    {/* {admin.role === 'owner' && user.role !== 'owner' && (
                      <span className="text-xs text-muted-foreground">
                        Role controls coming next
                      </span>
                    )} */}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {admin.role === 'owner' && (
        <section className="space-y-4">
          <div>
            <h2 className="font-serif text-xl">
              Customers
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Customers who do not currently have an administration role.
            </p>
          </div>

          <div className="border border-border">
            <UserRoleAssignment users={customers} />
            <AdminUserRoleControls users={managedUsers} />
          </div>
        </section>
      )}
    </div>
  );
}