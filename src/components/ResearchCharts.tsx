"use client";

import { Bar, BarChart, CartesianGrid, Cell, LabelList, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useLanguage } from "@/i18n/LanguageProvider";

// Colours checked with a colour-blindness validator (all pairs distinguishable).
export const METHOD_COLORS = { SMA: "#008f88", HOLT: "#e5563a", DAMPED: "#4a72d6" } as const;
const MUTED = "#b9c8cc";
const AXIS = { fill: "#4a5d6b", fontSize: 12 };

// Average error per method; the best (lowest) bar is highlighted.
export function ErrorByMethodChart({ data, best }: { data: { method: string; mae: number }[]; best: string }) {
  const { t } = useLanguage();
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 24, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="#e3ecea" />
          <XAxis dataKey="method" tick={AXIS} tickLine={false} axisLine={{ stroke: "#d6e4e2" }} />
          <YAxis tick={AXIS} tickLine={false} axisLine={false} width={44} />
          <Tooltip cursor={{ fill: "#eef5f4" }} formatter={(value) => [`${Number(value).toFixed(1)} ${t("research.leiPerWeek")}`, "MAE"]} />
          <Bar dataKey="mae" radius={[4, 4, 0, 0]} barSize={44} isAnimationActive={false}>
            {data.map((row) => (
              <Cell key={row.method} fill={row.method === best ? METHOD_COLORS.SMA : MUTED} />
            ))}
            <LabelList dataKey="mae" position="top" formatter={(value) => Number(value).toFixed(0)} style={{ fill: "#0f2233", fontSize: 12, fontWeight: 700 }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// How the error changes when spending gets less noisy (rising ledgers).
export function SensitivityChart({ data }: { data: { noise: number; SMA: number; HOLT: number; DAMPED: number }[] }) {
  const { t } = useLanguage();
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
          <CartesianGrid vertical={false} stroke="#e3ecea" />
          <XAxis dataKey="noise" tick={AXIS} tickLine={false} axisLine={{ stroke: "#d6e4e2" }} label={{ value: t("research.noiseAxis"), position: "insideBottom", offset: -4, fill: "#4a5d6b", fontSize: 12 }} height={40} />
          <YAxis tick={AXIS} tickLine={false} axisLine={false} width={44} />
          <Tooltip formatter={(value, name) => [`${Number(value).toFixed(1)} ${t("research.leiPerWeek")}`, name]} labelFormatter={(noise) => `σ = ${noise}`} />
          <Legend verticalAlign="top" height={28} iconType="plainline" />
          {(Object.keys(METHOD_COLORS) as (keyof typeof METHOD_COLORS)[]).map((method) => (
            <Line key={method} dataKey={method} stroke={METHOD_COLORS[method]} strokeWidth={2} dot={{ r: 4, strokeWidth: 2, fill: "#fff" }} activeDot={{ r: 6 }} isAnimationActive={false} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
