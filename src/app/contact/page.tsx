import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ContactForm } from "@/features/contact/components/ContactForm";

export default async function ContactPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-6 px-4 py-10">
      <div>
        <h1 className="text-2xl font-semibold">Get in touch</h1>
        <p className="text-sm text-gray-500">
          Know a shelter or rescue we should support? Have a question, comment,
          or concern? Let us know below.
        </p>
      </div>
      <ContactForm />
    </main>
  );
}
