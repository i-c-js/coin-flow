import Link from "next/link";

// A coin with a wave through it: the CoinFlow mark.
export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <svg width="34" height="34" viewBox="0 0 34 34" aria-hidden>
        <circle cx="17" cy="17" r="16" fill="#0b6e6e" />
        <path d="M5 19c3-3 6-3 9 0s6 3 9 0 5-3 6-2v6a12 12 0 0 1-24 0z" fill="#3cc3b0" />
        <circle cx="17" cy="17" r="16" fill="none" stroke="#ffc845" strokeWidth="2" />
      </svg>
      <span className="font-display text-lg font-extrabold text-ink">CoinFlow</span>
    </Link>
  );
}
