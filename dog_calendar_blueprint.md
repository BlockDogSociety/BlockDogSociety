# Tech Stack Recommendations

* **Frontend Framework:** Next.js (App Router)
* **Styling & UI:** Tailwind CSS + shadcn/ui
* **Database & Auth:** Supabase (PostgreSQL)
* **File Storage:** Supabase Storage (S3-compatible)
* **Payments:** Stripe Checkout
* **Transactional Email:** Resend

---

# Phase-by-Phase Execution Blueprint

## Phase 1: Authentication & Database Setup (Day 1)
* **Step 1:** Initialize a Next.js project using `npx create-next-app@latest`.
* **Step 2:** Run `npx supabase init` to link your local workspace to a free Supabase project instance.
* **Step 3:** Enable **Supabase Auth** with email/password login to handle user creation out of the box.
* **Step 4:** Execute the database schema to build the relational tables for users, profiles, dogs, and votes.

## Phase 2: Image Storage & Voting Backend (Day 2)
* **Step 1:** Provision a public bucket in **Supabase Storage** named `dog-photos` to host user assets.
* **Step 2:** Write a React frontend component utilizing `supabase.storage.from()` to allow direct multi-part uploads.
* **Step 3:** Implement an API route handling user upvotes, tracking user IDs against target photos to prevent duplicate votes.

## Phase 3: Leaderboard, Checkout & Email (Day 3)
* **Step 1:** Create an aggregated SQL query filtering the top 12 dog photos based on descending vote counts.
* **Step 2:** Configure a **Stripe Checkout** session route passing a fixed-price item for physical calendar preorders.
* **Step 3:** Code a secure webhook endpoint to capture `checkout.session.completed` events from Stripe.
* **Step 4:** Use the **Resend API** to programmatically trigger broadcast notifications to your user database when the calendar launches.
