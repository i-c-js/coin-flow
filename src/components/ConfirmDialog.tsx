"use client";

import { useState } from "react";
import { useLanguage } from "@/i18n/LanguageProvider";
import Modal from "./Modal";

// "Are you sure?" pop-up used before deleting something.
export default function ConfirmDialog({
  title,
  text,
  confirmLabel,
  onConfirm,
  onClose,
}: {
  title: string;
  text?: string;
  confirmLabel: string;
  onConfirm: () => Promise<void> | void;
  onClose: () => void;
}) {
  const { t } = useLanguage();
  const [busy, setBusy] = useState(false);

  async function confirm() {
    setBusy(true);
    await onConfirm();
    setBusy(false);
    onClose();
  }

  return (
    <Modal title={title} onClose={onClose}>
      {text && <p className="mb-5 text-ink-soft">{text}</p>}
      <div className="grid grid-cols-2 gap-3">
        <button className="btn-ghost" onClick={onClose}>{t("common.cancel")}</button>
        <button className="btn bg-coral text-white" onClick={confirm} disabled={busy}>{confirmLabel}</button>
      </div>
    </Modal>
  );
}
