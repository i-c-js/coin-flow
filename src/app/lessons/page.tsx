"use client";

import { useCallback, useEffect, useState } from "react";
import { BookOpen, CircleCheck, ChevronLeft, Clock, PiggyBank, ShieldAlert, Wallet } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";
import { useLanguage } from "@/i18n/LanguageProvider";
import { supabase } from "@/lib/supabase";
import { LESSONS, type Lesson } from "@/content/lessons";

const ICONS = { budgeting: Wallet, saving: PiggyBank, scams: ShieldAlert } as Record<string, typeof BookOpen>;
const PASS_SCORE = 2; // at least 2 of 3 correct answers finishes the lesson

export default function LessonsPage() {
  return <AuthGuard>{() => <Lessons />}</AuthGuard>;
}

function Lessons() {
  const { t, lang } = useLanguage();
  const [finished, setFinished] = useState<string[]>([]);
  const [open, setOpen] = useState<Lesson | null>(null);

  const load = useCallback(async () => {
    const { data } = await supabase.from("lesson_progress").select("lesson_id");
    setFinished((data ?? []).map((row) => row.lesson_id));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (open) {
    return <LessonView lesson={open} onBack={() => setOpen(null)} onFinished={load} />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="h1">{t("lessons.title")}</h1>
        <p className="mt-1 text-ink-soft">{t("lessons.intro")}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {LESSONS.map((lesson) => {
          const Icon = ICONS[lesson.id] ?? BookOpen;
          const done = finished.includes(lesson.id);
          return (
            <button key={lesson.id} onClick={() => setOpen(lesson)} className="card flex flex-col text-left hover:border-flow">
              <div className="flex items-center justify-between">
                <span className="rounded-2xl bg-foam p-3 text-flow">
                  <Icon size={26} />
                </span>
                {done && (
                  <span className="flex items-center gap-1 rounded-pill bg-leaf/15 px-3 py-1 text-sm font-bold text-leaf">
                    <CircleCheck size={16} /> {t("lessons.done")}
                  </span>
                )}
              </div>
              <p className="h2 mt-4">{lesson.text[lang].title}</p>
              <p className="mt-1 flex-1 text-ink-soft">{lesson.text[lang].summary}</p>
              <p className="mt-4 flex items-center gap-1 text-sm text-ink-soft">
                <Clock size={14} /> {t("lessons.minutes", { n: lesson.minutes })}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function LessonView({ lesson, onBack, onFinished }: { lesson: Lesson; onBack: () => void; onFinished: () => void }) {
  const { t, lang } = useLanguage();
  const text = lesson.text[lang];
  const [answers, setAnswers] = useState<(number | null)[]>([null, null, null]);
  const [checked, setChecked] = useState(false);
  const [message, setMessage] = useState("");

  const score = text.quiz.filter((q, i) => answers[i] === q.answer).length;

  async function check() {
    if (answers.includes(null)) return setMessage(t("lessons.notAll"));
    setChecked(true);
    setMessage("");
    if (score >= PASS_SCORE) {
      await supabase.from("lesson_progress").upsert({ lesson_id: lesson.id, score });
      onFinished();
    }
  }

  function retry() {
    setAnswers([null, null, null]);
    setChecked(false);
  }

  return (
    <article className="mx-auto max-w-2xl space-y-6">
      <button onClick={onBack} className="flex items-center gap-1 font-semibold text-flow">
        <ChevronLeft size={18} /> {t("lessons.back")}
      </button>
      <h1 className="h1">{text.title}</h1>
      <div className="card space-y-4 text-lg leading-relaxed">
        {text.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      <h2 className="h2">{t("lessons.quiz")}</h2>
      {text.quiz.map((q, qi) => (
        <fieldset key={q.question} className="card space-y-2">
          <legend className="sr-only">{q.question}</legend>
          <p className="font-bold">{qi + 1}. {q.question}</p>
          {q.options.map((option, oi) => {
            const selected = answers[qi] === oi;
            let style = selected ? "border-flow bg-foam" : "border-line";
            if (checked && oi === q.answer) style = "border-leaf bg-leaf/10";
            else if (checked && selected) style = "border-coral bg-coral/10";
            return (
              <button
                key={option}
                disabled={checked}
                onClick={() => setAnswers((prev) => prev.map((a, i) => (i === qi ? oi : a)))}
                className={`block w-full rounded-2xl border-2 px-4 py-3 text-left ${style}`}
              >
                {option}
              </button>
            );
          })}
          {checked && (
            <p className={`font-semibold ${answers[qi] === q.answer ? "text-leaf" : "text-coral"}`}>
              {answers[qi] === q.answer ? t("lessons.correct") : t("lessons.wrong")}
            </p>
          )}
        </fieldset>
      ))}

      {message && <p className="font-semibold text-coral">{message}</p>}

      {!checked ? (
        <button className="btn-primary w-full" onClick={check}>{t("lessons.check")}</button>
      ) : (
        <div className="card space-y-3 text-center">
          <p className="big-number text-4xl text-flow">{score}/{text.quiz.length}</p>
          <p>{t("lessons.score", { score, total: text.quiz.length })}</p>
          {score >= PASS_SCORE && <p className="font-bold text-leaf">{t("lessons.passed")}</p>}
          <button className="btn-ghost" onClick={retry}>{t("lessons.tryAgain")}</button>
        </div>
      )}
    </article>
  );
}
