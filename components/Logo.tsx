import Link from "next/link";
import { site } from "@/data/site";

/**
 * Text wordmark for now. To use an image logo later, save it as
 * /public/logo.svg and replace the <span> below with:
 *   <Image src="/logo.svg" alt="Daymark" width={140} height={32} priority />
 */
export function Logo({ className = "inline-flex" }: { className?: string }) {
  return (
    <Link href="/" className={`items-center ${className}`} aria-label={`${site.name} home`}>
      <span className="text-xl sm:text-2xl font-semibold tracking-[0.12em] sm:tracking-[0.18em] uppercase leading-none">{site.name}</span>
    </Link>
  );
}
