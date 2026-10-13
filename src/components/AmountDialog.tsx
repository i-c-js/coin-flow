"use client";

import { useState } from "react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { parseLeiInput } from "@/lib/money";
import Modal from "./Modal";

// Asks for an amount in lei, e.g. "How many lei to add to this goal?"
export default function AmountDialog({
  title,
  onSave,
  onClose,
}: {
  title: string;
  onSave: (bani: number) => Promise<void>;
  onClose: () => void;
}) {
  const { t } = useLanguage();
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const bani = parseLeiInput(amount);
    if (bani === null) return setError(t("common.amountError"));
    await onSave(bani);
    onClose();
  }

  return (
    <Modal title={title} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="input big-number text-3xl"
          inputMode="decimal"
          placeholder="0"
          autoFocus
          aria-label={title}
          value={amount}
          onChange={(e) => setAmount(e.target.value.replace(/[^0-9.,]/g, ""))}
        />
        {error && <p role="alert" className="text-sm font-medium text-coral">{error}</p>}
        <button className="btn-primary w-full">{t("common.save")}</button>
      </form>
    </Modal>
  );
}
