"use client";

import Link from "next/link";
import { TrendingUp, Receipt, ArrowLeftRight, ChartColumn, Settings, ChevronRight } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";

const TOOLS = [
  { href: "/what-if", key: "whatIf", icon: TrendingUp, color: "bg-sun" },
  { href: "/payslip", key: "payslip", icon: Receipt, color: "bg-wave" },
  { href: "/converter", key: "converter", icon: ArrowLeftRight, color: "bg-foam" },
  { href: "/summary", key: "summary", icon: ChartColumn, color: "bg-coral/20" },
  { href: "/settings", key: "settings", icon: Settings, color: "bg-mist" },
];

export default function ToolsPage() {
  const { t } = useLanguage();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="h1">{t("tools.title")}</h1>
        <p className="mt-1 text-ink-soft">{t("tools.subtitle")}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {TOOLS.map(({ href, key, icon: Icon, color }) => (
          <Link key={href} href={href} className="card flex items-center gap-4 hover:border-flow">
            <span className={`rounded-2xl p-3 text-ink ${color}`}>
              <Icon size={26} />
            </span>
            <div className="flex-1">
              <p className="h2">{t(`tools.${key}`)}</p>
              <p className="text-sm text-ink-soft">{t(`tools.${key}Text`)}</p>
            </div>
            <ChevronRight className="text-ink-soft" />
          </Link>
        ))}
      </div>
    </div>
  );
}
