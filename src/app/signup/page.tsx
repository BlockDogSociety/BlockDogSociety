import { SignUpForm } from "@/features/auth/components/SignUpForm";

export default function SignUpPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-4">
      <h1 className="mb-6 text-2xl font-semibold">Create an account</h1>
      <SignUpForm />
    </main>
  );
}
