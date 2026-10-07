"use client";

import { LANGS, useLanguage } from "@/i18n/LanguageProvider";

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();
  return (
    <div className="flex rounded-pill border border-line bg-surface p-1" role="group" aria-label="Language">
      {LANGS.map((code) => (
        <button
          key={code}
          onClick={() => setLang(code)}
          className={`rounded-pill px-2.5 py-1 text-xs font-bold uppercase transition ${
            lang === code ? "bg-flow text-white" : "text-ink-soft hover:text-ink"
          }`}
        >
          {code}
        </button>
      ))}
    </div>
  );
}
