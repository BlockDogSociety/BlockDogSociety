import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppChrome } from "@/components/AppChrome";
import { isAdminEmail } from "@/lib/admin";
import { getCurrentUser } from "@/lib/supabase/current-user";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Block Dog Society",
  description: "Upload your dog, vote for the cutest, and get them in the calendar.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const user = await getCurrentUser();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AppChrome userEmail={user?.email ?? null} isAdmin={isAdminEmail(user?.email)}>
          {children}
        </AppChrome>
      </body>
    </html>
  );
}
