"use client";

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/i18n/LanguageProvider";

export default function NotFound() {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col items-center py-12 text-center">
      <Image src="/illustrations/calm-water.svg" alt="" width={220} height={150} className="h-40 w-auto" />
      <h1 className="h1 mt-6">{t("notFound.title")}</h1>
      <p className="mt-2 text-ink-soft">{t("notFound.text")}</p>
      <Link href="/" className="btn-primary mt-6">{t("notFound.home")}</Link>
    </div>
  );
}
