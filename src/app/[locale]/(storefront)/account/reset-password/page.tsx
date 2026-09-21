import {ResetPasswordForm} from "@/components/account/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-[calc(100svh-0rem)] items-center justify-center px-4 py-12 sm:px-6">
      <div className="w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-sm sm:p-10">
        <ResetPasswordForm />
      </div>
    </main>
  );
}