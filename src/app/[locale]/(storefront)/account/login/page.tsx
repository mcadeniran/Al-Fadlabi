import {LoginForm} from "@/components/account/login-form";

type LoginPageProps = {
  searchParams: Promise<{
    redirect?: string;
  }>;
};

export default async function LoginPage({
  searchParams,
}: LoginPageProps) {
  const {redirect} = await searchParams;

  const redirectTo =
    redirect === "/checkout" ? redirect : undefined;

  return (
    <main className="flex min-h-[calc(100svh-0rem)] items-center justify-center px-4 py-12 sm:px-6">
      <div className="w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-sm sm:p-10">
        <LoginForm redirectTo={redirectTo} />
      </div>
    </main>
  );
}