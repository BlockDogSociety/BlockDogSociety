"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS, ADMIN_NAV_ITEM } from "@/components/nav-items";
import { signOut } from "@/features/auth/actions";

export function Sidebar({
  userEmail,
  isAdmin,
}: {
  userEmail: string | null;
  isAdmin: boolean;
}) {
  const pathname = usePathname();
  const items = isAdmin ? [...NAV_ITEMS, ADMIN_NAV_ITEM] : NAV_ITEMS;

  return (
    <aside className="sticky top-0 flex h-screen w-56 shrink-0 flex-col gap-6 overflow-y-auto border-r px-4 py-6">
      <Link href="/" className="px-2 text-lg font-bold">
        🐶 Block Dog Society
      </Link>

      <nav className="flex flex-col gap-1">
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-md px-3 py-2 text-sm font-medium ${
                active ? "bg-black text-white" : "hover:bg-gray-100"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-2 px-2">
        {userEmail ? (
          <>
            <span className="truncate text-xs text-gray-500">{userEmail}</span>
            <form action={signOut}>
              <button type="submit" className="w-full rounded-md border px-3 py-1.5 text-sm">
                Sign out
              </button>
            </form>
          </>
        ) : (
          <>
            <Link href="/login" className="rounded-md border px-3 py-1.5 text-center text-sm">
              Log in
            </Link>
            <Link
              href="/signup"
              className="rounded-md bg-black px-3 py-1.5 text-center text-sm text-white"
            >
              Sign up
            </Link>
          </>
        )}
      </div>
    </aside>
  );
}
