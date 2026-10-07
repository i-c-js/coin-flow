"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Trash2 } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";
import { LANGS, useLanguage, type Lang } from "@/i18n/LanguageProvider";
import { supabase } from "@/lib/supabase";

const LANGUAGE_NAMES: Record<Lang, string> = { ro: "Română", ru: "Русский", en: "English" };

export default function SettingsPage() {
  return <AuthGuard>{(user) => <Settings userId={user.id} email={user.email ?? ""} />}</AuthGuard>;
}

function Settings({ userId, email }: { userId: string; email: string }) {
  const { t, lang, setLang } = useLanguage();
  const router = useRouter();
  const [message, setMessage] = useState("");

  async function changeLanguage(newLang: Lang) {
    setLang(newLang);
    await supabase.from("profiles").update({ language: newLang }).eq("id", userId);
  }

  async function deleteAllData() {
    if (!confirm(t("settings.deleteConfirm"))) return;
    // Row Level Security makes sure these only touch the current user's rows.
    const results = await Promise.all([
      supabase.from("transactions").delete().eq("user_id", userId),
      supabase.from("savings_goals").delete().eq("user_id", userId),
      supabase.from("lesson_progress").delete().eq("user_id", userId),
    ]);
    setMessage(results.some((r) => r.error) ? t("common.error") : t("settings.deleted"));
  }

  async function logOut() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="h1">{t("settings.title")}</h1>

      <section className="card space-y-3">
        <h2 className="h2">{t("settings.language")}</h2>
        <div className="grid grid-cols-3 gap-2">
          {LANGS.map((code) => (
            <button
              key={code}
              onClick={() => changeLanguage(code)}
              className={`rounded-2xl border-2 py-3 font-semibold ${lang === code ? "border-flow bg-foam" : "border-line"}`}
            >
              {LANGUAGE_NAMES[code]}
            </button>
          ))}
        </div>
      </section>

      <section className="card space-y-3">
        <h2 className="h2">{t("settings.account")}</h2>
        <p className="text-ink-soft">{t("settings.loggedAs", { email })}</p>
        <button className="btn-ghost" onClick={logOut}>
          <LogOut size={18} /> {t("auth.logout")}
        </button>
      </section>

      <section className="card space-y-3 border-coral/40">
        <h2 className="h2 text-coral">{t("settings.deleteData")}</h2>
        <p className="text-ink-soft">{t("settings.deleteText")}</p>
        <button className="btn bg-coral text-white" onClick={deleteAllData}>
          <Trash2 size={18} /> {t("settings.deleteData")}
        </button>
        {message && <p className="font-semibold">{message}</p>}
      </section>
    </div>
  );
}
