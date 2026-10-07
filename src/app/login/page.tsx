"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/i18n/LanguageProvider";
import Wave from "@/components/Wave";

export default function LoginPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return setError(t("auth.missingEnv"));
    if (password.length < 6) return setError(t("auth.minPassword"));

    setBusy(true);
    const result =
      mode === "login"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password, options: { data: { display_name: name } } });
    setBusy(false);

    if (result.error) return setError(result.error.message);
    router.push("/");
  }

  return (
    <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2 md:items-center">
      {/* Welcome panel */}
      <div className="relative overflow-hidden rounded-card bg-flow p-8 pb-20 text-white">
        <p className="font-display text-3xl font-extrabold leading-tight sm:text-4xl">{t("auth.welcome")}</p>
        <p className="mt-4 text-lg text-foam">{t("auth.tagline")}</p>
        <Wave className="absolute inset-x-0 bottom-0 h-16 w-full" />
      </div>

      <form onSubmit={handleSubmit} className="card space-y-4">
        <h1 className="h1">{mode === "login" ? t("auth.login") : t("auth.signup")}</h1>

        {mode === "signup" && (
          <div>
            <label className="label" htmlFor="name">{t("auth.name")}</label>
            <input id="name" className="input" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
        )}
        <div>
          <label className="label" htmlFor="email">{t("auth.email")}</label>
          <input id="email" type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label className="label" htmlFor="password">{t("auth.password")}</label>
          <input id="password" type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>

        {error && <p className="rounded-2xl bg-coral/10 px-4 py-3 text-sm font-medium text-coral">{error}</p>}

        <button className="btn-primary w-full" disabled={busy}>
          {mode === "login" ? t("auth.login") : t("auth.signup")}
        </button>

        <p className="text-center text-sm text-ink-soft">
          {mode === "login" ? t("auth.noAccount") : t("auth.haveAccount")}{" "}
          <button type="button" className="font-semibold text-flow underline" onClick={() => setMode(mode === "login" ? "signup" : "login")}>
            {mode === "login" ? t("auth.signup") : t("auth.login")}
          </button>
        </p>
      </form>
    </div>
  );
}
