import Link from "next/link";
import { navItemsFor } from "@/components/NavLinks";
import { signOut } from "@/features/auth/actions";

export function TopNav({
  userEmail,
  isAdmin,
}: {
  userEmail: string | null;
  isAdmin: boolean;
}) {
  const items = navItemsFor(userEmail !== null, isAdmin);

  return (
    <header className="sticky top-0 z-10 hidden flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b bg-white px-6 py-3 text-black md:flex">
      <nav className="flex flex-wrap items-center gap-x-6 gap-y-2">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-sm font-medium whitespace-nowrap text-black"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {userEmail ? (
        <form action={signOut} className="flex shrink-0 items-center gap-3">
          <span className="text-sm whitespace-nowrap text-black">{userEmail}</span>
          <button
            type="submit"
            className="shrink-0 rounded-md border px-3 py-1.5 text-sm whitespace-nowrap text-black"
          >
            Sign out
          </button>
        </form>
      ) : (
        <div className="flex shrink-0 items-center gap-3">
          <Link href="/login" className="text-sm font-medium whitespace-nowrap text-black">
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
