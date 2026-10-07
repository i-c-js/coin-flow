import Link from "next/link";
import Image from "next/image";

// The CoinFlow mark: the same image as the browser icon (src/app/icon.svg).
export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <Image src="/logo.svg" alt="" width={34} height={34} priority />
      <span className="font-display text-lg font-extrabold text-ink">CoinFlow</span>
    </Link>
  );
}
