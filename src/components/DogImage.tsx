import Image from "next/image";

// Vercel's optimizer serves these as WebP/AVIF at the size actually rendered,
// from Vercel's CDN rather than Supabase's metered egress. It can't reach the
// dev server's sandboxed hostname, so local dev falls back to the raw file.
const UNOPTIMIZED = process.env.NODE_ENV === "development";

export function DogImage({
  src,
  alt,
  sizes,
  className = "object-cover",
}: {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      quality={75}
      unoptimized={UNOPTIMIZED}
      className={className}
    />
  );
}

// Two-column on phones, up to four in a 1024px container.
export const GRID_SIZES = "(min-width: 768px) 240px, (min-width: 640px) 30vw, 45vw";
