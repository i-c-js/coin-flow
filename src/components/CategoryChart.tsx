"use client";

import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useLanguage } from "@/i18n/LanguageProvider";
import { formatBani } from "@/lib/money";

// Horizontal bars: one per category, biggest at the top.
export default function CategoryChart({ data }: { data: { id: string; color: string; totalBani: number }[] }) {
  const { t } = useLanguage();
  const rows = data.map((row) => ({ ...row, name: t(`categories.${row.id}`), lei: row.totalBani / 100 }));

  return (
    <div style={{ height: Math.max(160, rows.length * 48) }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={rows} layout="vertical" margin={{ left: 0, right: 16 }}>
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="name" width={120} tickLine={false} axisLine={false} tick={{ fill: "#0f2233", fontSize: 13 }} />
          <Tooltip
            cursor={{ fill: "#eef5f4" }}
            formatter={(value) => [`${formatBani(Number(value) * 100)} ${t("common.lei")}`, ""]}
          />
          <Bar dataKey="lei" radius={[0, 12, 12, 0]} barSize={24}>
            {rows.map((row) => (
              <Cell key={row.id} fill={row.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
