"use client";

import { useEffect, useId } from "react";
import { X } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";

// A pop-up window. Closes with the X button, the Escape key, or a click outside.
// On phones it slides up from the bottom, on bigger screens it sits in the middle.
export default function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const { t } = useLanguage();
  const titleId = useId();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 sm:items-center" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-card bg-surface p-6 sm:rounded-card"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 id={titleId} className="h2">{title}</h2>
          <button type="button" onClick={onClose} className="rounded-full p-1 text-ink-soft hover:bg-foam" aria-label={t("common.cancel")}>
            <X />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
