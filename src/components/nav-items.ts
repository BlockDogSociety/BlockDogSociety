import { SUBMISSIONS_OPEN, VOTING_OPEN } from "@/lib/contest";

export const NAV_ITEMS = [
  ...(SUBMISSIONS_OPEN ? [{ href: "/upload", label: "Submit Photo" }] : []),
  { href: "/vote", label: VOTING_OPEN ? "Vote / View Dogs" : "View Dogs" },
  { href: "/calendar", label: "Calendar" },
  { href: "/contact", label: "Questions & Comments" },
];

export const MY_DOGS_NAV_ITEM = { href: "/my-dogs", label: "Your Submissions" } as const;

export const ADMIN_NAV_ITEM = { href: "/admin", label: "Admin" } as const;
