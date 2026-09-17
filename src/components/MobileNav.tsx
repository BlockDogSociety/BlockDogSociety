"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavLinks, AccountLinks } from "@/components/NavLinks";

export function MobileNav(props: { userEmail: string | null; isAdmin: boolean }) {
  // Remount on every route change so the drawer always starts closed.
  return <MobileNavInner key={usePathname()} {...props} />;
}

function MobileNavInner({
  userEmail,
  isAdmin,
}: {
  userEmail: string | null;
  isAdmin: boolean;
}) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="sticky top-0 z-20 md:hidden">
      <header className="flex items-center justify-between border-b bg-white px-4 py-3">
        <Link href="/" className="text-lg font-bold">
          Block Dog Society
        </Link>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          aria-expanded={open}
          className="rounded-md border px-3 py-1.5 text-sm"
        >
          Menu
        </button>
      </header>

      {open && (
        <div className="fixed inset-0 z-30">
          <button
            type="button"
            aria-label="Close menu"
            onClick={close}
            className="absolute inset-0 bg-black/40"
          />
          <aside className="absolute inset-y-0 right-0 flex w-72 max-w-[85vw] flex-col gap-6 overflow-y-auto bg-white px-4 py-6 shadow-xl">
            <div className="flex items-center justify-between px-2">
              <span className="text-lg font-bold">Menu</span>
              <button
                type="button"
                onClick={close}
                aria-label="Close menu"
                className="rounded-md border px-3 py-1 text-sm"
              >
                Close
              </button>
            </div>
            <NavLinks signedIn={userEmail !== null} isAdmin={isAdmin} onNavigate={close} />
            <div className="mt-auto">
              <AccountLinks userEmail={userEmail} onNavigate={close} />
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
