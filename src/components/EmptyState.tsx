import { Waves, type LucideIcon } from "lucide-react";

// Friendly message shown instead of an empty screen.
export default function EmptyState({
  title,
  text,
  icon: Icon = Waves,
  children,
}: {
  title: string;
  text: string;
  icon?: LucideIcon;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center rounded-card border-2 border-dashed border-line bg-surface px-6 py-10 text-center">
      <div className="mb-3 rounded-full bg-foam p-4 text-flow">
        <Icon size={28} />
      </div>
      <p className="h2">{title}</p>
      <p className="mt-1 max-w-sm text-ink-soft">{text}</p>
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}
