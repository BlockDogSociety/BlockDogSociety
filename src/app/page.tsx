import Link from "next/link";

export default function Home() {
  return (
    // Placeholder hero background — swap this gradient for a real photo
    // (e.g. an <Image fill /> here) once one's picked.
    <main className="relative flex flex-1 items-end overflow-hidden bg-gradient-to-b from-neutral-700 via-neutral-900 to-black">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.08),transparent_60%)]" />

      <div className="relative z-10 px-6 pb-16 sm:px-10">
        <p className="text-sm font-semibold tracking-wide text-white/70 uppercase">
          Dogs of the Cutblock
        </p>
        <h1 className="mt-2 max-w-2xl text-5xl font-bold text-white sm:text-6xl">
          Block Dog Society
        </h1>
        <p className="mt-4 max-w-xl text-lg text-white/80">
          Upload your dog, vote for the cutest, and help build the annual
          Block Dog Society calendar.
        </p>
        <Link
          href="/vote"
          className="mt-8 inline-block rounded-md bg-white px-6 py-3 font-medium text-black"
        >
          View the dogs
        </Link>
      </div>
    </main>
  );
}
