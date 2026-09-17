import Link from "next/link";
import { NavLinks, AccountLinks } from "@/components/NavLinks";

export function Sidebar({
  userEmail,
  isAdmin,
}: {
  userEmail: string | null;
  isAdmin: boolean;
}) {
  return (
    <aside className="sticky top-0 hidden h-screen w-56 shrink-0 flex-col gap-6 overflow-y-auto border-r px-4 py-6 md:flex">
      <Link href="/" className="px-2 text-lg font-bold">
        Block Dog Society
      </Link>
      <NavLinks signedIn={userEmail !== null} isAdmin={isAdmin} />
      <div className="mt-auto">
        <AccountLinks userEmail={userEmail} />
      </div>
    </aside>
  );
}
