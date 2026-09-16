import {RegisterForm} from "@/components/account/register-form";

export default function RegisterPage() {
  return (
    <main className="min-h-[calc(100vh-8rem)] px-6 py-16 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-md">
        <RegisterForm />
      </div>
    </main>
  );
}