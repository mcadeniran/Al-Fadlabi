import {ForgotPasswordForm} from "@/components/account/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-[calc(100svh-0rem)] items-center justify-center px-4 py-12 sm:px-6">
      <div className="w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-sm sm:p-10">
        <ForgotPasswordForm />
      </div>
    </main>
  );
}