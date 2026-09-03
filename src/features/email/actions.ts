"use server";

import { Resend } from "resend";
import { requireAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/admin";

export type SendEmailState = { message: string | null };

function chunk<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

// useActionState requires this exact (state, formData) signature, unused here.
export async function sendLaunchEmail(
  _prevState: SendEmailState, // eslint-disable-line @typescript-eslint/no-unused-vars
  _formData: FormData, // eslint-disable-line @typescript-eslint/no-unused-vars
): Promise<SendEmailState> {
  await requireAdmin();

  const supabase = createAdminClient();
  const emails: string[] = [];
  let page = 1;
  const perPage = 1000;

  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });
    if (error) {
      return { message: `Failed to list users: ${error.message}` };
    }
    emails.push(...data.users.map((u) => u.email).filter((e): e is string => !!e));
    if (data.users.length < perPage) break;
    page += 1;
  }

  if (emails.length === 0) {
    return { message: "No registered users to email." };
  }

  const resend = new Resend(process.env.RESEND_API_KEY!);
  const from = process.env.RESEND_FROM_EMAIL || "Block Dog Society <onboarding@resend.dev>";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  for (const batch of chunk(emails, 100)) {
    const { error } = await resend.batch.send(
      batch.map((email) => ({
        from,
        to: email,
        subject: "The Block Dog Society calendar is here! 🐶",
        html: `<p>The votes are in — the top 12 cutest dogs made the cut.</p><p><a href="${siteUrl}/calendar">See the calendar and order yours</a>.</p>`,
      })),
    );
    if (error) {
      return { message: `Sent some, then failed: ${error.message}` };
    }
  }

  return { message: `Sent to ${emails.length} people.` };
}
