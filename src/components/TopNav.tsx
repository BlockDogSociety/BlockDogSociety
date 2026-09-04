import Link from "next/link";
import { NAV_ITEMS, ADMIN_NAV_ITEM } from "@/components/nav-items";
import { signOut } from "@/features/auth/actions";

export function TopNav({
  userEmail,
  isAdmin,
}: {
  userEmail: string | null;
  isAdmin: boolean;
}) {
  const items = isAdmin ? [...NAV_ITEMS, ADMIN_NAV_ITEM] : NAV_ITEMS;

  return (
    <header className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b bg-white px-6 py-3">
      <Link href="/" className="shrink-0 text-lg font-bold whitespace-nowrap">
        🐶 Block Dog Society
      </Link>

      <nav className="flex flex-wrap items-center gap-x-6 gap-y-2">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-sm font-medium whitespace-nowrap"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {userEmail ? (
        <form action={signOut} className="flex shrink-0 items-center gap-3">
          <span className="truncate text-sm text-gray-500 max-w-[16ch]">{userEmail}</span>
          <button
            type="submit"
            className="shrink-0 rounded-md border px-3 py-1.5 text-sm whitespace-nowrap"
          >
            Sign out
          </button>
        </form>
      ) : (
        <div className="flex shrink-0 items-center gap-3">
          <Link href="/login" className="text-sm font-medium whitespace-nowrap">
            Log in
          </Link>
          <Link
            href="/signup"
            className="rounded-md bg-black px-3 py-1.5 text-sm whitespace-nowrap text-white"
          >
            Sign up
          </Link>
        </div>
      )}
    </header>
  );
}
