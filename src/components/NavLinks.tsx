"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS, MY_DOGS_NAV_ITEM, ADMIN_NAV_ITEM } from "@/components/nav-items";
import { signOut } from "@/features/auth/actions";

export function navItemsFor(signedIn: boolean, isAdmin: boolean) {
  return [
    ...NAV_ITEMS,
    ...(signedIn ? [MY_DOGS_NAV_ITEM] : []),
    ...(isAdmin ? [ADMIN_NAV_ITEM] : []),
  ];
}

export function NavLinks({
  signedIn,
  isAdmin,
  onNavigate,
}: {
  signedIn: boolean;
  isAdmin: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const items = navItemsFor(signedIn, isAdmin);

  return (
    <nav className="flex flex-col gap-1">
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`rounded-md px-3 py-2 text-sm font-medium ${
              active ? "bg-black text-white" : "hover:bg-gray-100"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AccountLinks({
  userEmail,
  onNavigate,
}: {
  userEmail: string | null;
  onNavigate?: () => void;
}) {
  if (userEmail) {
    return (
      <div className="flex flex-col gap-2 px-2">
        <span className="truncate text-xs text-gray-500">{userEmail}</span>
        <form action={signOut}>
          <button type="submit" className="w-full rounded-md border px-3 py-1.5 text-sm">
            Sign out
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 px-2">
      <Link
        href="/login"
        onClick={onNavigate}
        className="rounded-md border px-3 py-1.5 text-center text-sm"
      >
        Log in
      </Link>
      <Link
        href="/signup"
        onClick={onNavigate}
        className="rounded-md bg-black px-3 py-1.5 text-center text-sm text-white"
      >
        Sign up
      </Link>
    </div>
  );
}
