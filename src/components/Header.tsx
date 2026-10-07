"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { House, Wallet, Target, GraduationCap, Calculator, Settings, LogOut } from "lucide-react";
import Logo from "./Logo";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLanguage } from "@/i18n/LanguageProvider";
import { useUser } from "@/lib/useUser";
import { supabase } from "@/lib/supabase";

const NAV = [
  { href: "/", key: "nav.home", icon: House },
  { href: "/transactions", key: "nav.money", icon: Wallet },
  { href: "/goals", key: "nav.goals", icon: Target },
  { href: "/lessons", key: "nav.learn", icon: GraduationCap },
  { href: "/tools", key: "nav.tools", icon: Calculator },
];

export default function Header() {
  const { t } = useLanguage();
  const { user } = useUser();
  const pathname = usePathname();
  const router = useRouter();

  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  async function logOut() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-line bg-mist/95">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
          <Logo />
          {user && (
            <nav className="hidden items-center gap-1 md:flex">
              {NAV.map(({ href, key, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-1.5 rounded-pill px-3 py-2 text-sm font-semibold ${
                    isActive(href) ? "bg-flow text-white" : "text-ink-soft hover:bg-foam hover:text-ink"
                  }`}
                >
                  <Icon size={16} />
                  {t(key)}
                </Link>
              ))}
            </nav>
          )}
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            {user && (
              <>
                <Link href="/settings" aria-label={t("nav.settings")} className="rounded-full p-2 text-ink-soft hover:bg-foam">
                  <Settings size={20} />
                </Link>
                <button onClick={logOut} aria-label={t("auth.logout")} className="hidden rounded-full p-2 text-ink-soft hover:bg-foam sm:block">
                  <LogOut size={20} />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Bottom navigation for phones */}
      {user && (
        <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface md:hidden">
          <div className="mx-auto grid max-w-md grid-cols-5">
            {NAV.map(({ href, key, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-semibold ${
                  isActive(href) ? "text-flow" : "text-ink-soft"
                }`}
              >
                <Icon size={22} strokeWidth={isActive(href) ? 2.5 : 2} />
                {t(key)}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </>
  );
}
