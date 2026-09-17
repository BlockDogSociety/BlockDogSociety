"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { TopNav } from "@/components/TopNav";
import { MobileNav } from "@/components/MobileNav";

const NO_CHROME_PREFIXES = ["/login", "/signup"];

export function AppChrome({
  children,
  userEmail,
  isAdmin,
}: {
  children: React.ReactNode;
  userEmail: string | null;
  isAdmin: boolean;
}) {
  const pathname = usePathname();

  if (NO_CHROME_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return <>{children}</>;
  }

  if (pathname === "/") {
    return (
      <>
        <MobileNav userEmail={userEmail} isAdmin={isAdmin} />
        <TopNav userEmail={userEmail} isAdmin={isAdmin} />
        {children}
      </>
    );
  }

  return (
    <>
      <MobileNav userEmail={userEmail} isAdmin={isAdmin} />
      <div className="flex min-h-screen">
        <Sidebar userEmail={userEmail} isAdmin={isAdmin} />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </>
  );
}
