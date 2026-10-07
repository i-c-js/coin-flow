// A savings goal drawn as a container that fills up with water.
export default function GoalJar({ percent, size = 96 }: { percent: number; size?: number }) {
  const level = Math.max(0, Math.min(100, percent));
  return (
    <div
      className="relative shrink-0 overflow-hidden rounded-b-[28px] rounded-t-xl border-[3px] border-flow bg-foam"
      style={{ width: size * 0.75, height: size }}
      role="img"
      aria-label={`${level}%`}
    >
      <div className="absolute inset-x-0 bottom-0 bg-wave transition-all duration-700" style={{ height: `${level}%` }}>
        {level > 0 && level < 100 && (
          <svg className="absolute -top-2 left-0 h-2.5 w-full" viewBox="0 0 100 10" preserveAspectRatio="none" aria-hidden>
            <path d="M0 5 Q 12.5 0 25 5 T 50 5 T 75 5 T 100 5 V10 H0 Z" fill="#3cc3b0" />
          </svg>
        )}
      </div>
      <span className="absolute inset-0 flex items-center justify-center font-display text-sm font-extrabold text-ink">
        {level}%
      </span>
    </div>
  );
}
