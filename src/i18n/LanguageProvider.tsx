"use client";

import { createContext, useContext, useEffect, useState } from "react";
import ro from "./ro.json";
import ru from "./ru.json";
import en from "./en.json";

export type Lang = "ro" | "ru" | "en";
export const LANGS: Lang[] = ["ro", "ru", "en"];

const dictionaries = { ro, ru, en };

type LanguageContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

// Looks up "home.title" inside the JSON object, falls back to Romanian, then to the key itself.
function lookup(dict: object, key: string): string | undefined {
  let value: unknown = dict;
  for (const part of key.split(".")) {
    if (typeof value !== "object" || value === null) return undefined;
    value = (value as Record<string, unknown>)[part];
  }
  return typeof value === "string" ? value : undefined;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ro");

  // Remember the chosen language in the browser.
  useEffect(() => {
    const saved = localStorage.getItem("lang") as Lang | null;
    if (saved && LANGS.includes(saved)) setLangState(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  function setLang(newLang: Lang) {
    setLangState(newLang);
    localStorage.setItem("lang", newLang);
  }

  function t(key: string, vars?: Record<string, string | number>) {
    let text = lookup(dictionaries[lang], key) ?? lookup(dictionaries.ro, key) ?? key;
    for (const [name, value] of Object.entries(vars ?? {})) {
      text = text.replaceAll(`{${name}}`, String(value));
    }
    return text;
  }

  return <LanguageContext.Provider value={{ lang, setLang, t }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
}
