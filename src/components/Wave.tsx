// Decorative wave used at the bottom of big "flow" cards.
export default function Wave({ color = "#3cc3b0", className = "" }: { color?: string; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 400 40" preserveAspectRatio="none" aria-hidden>
      <path d="M0 20 C 50 0, 100 40, 150 20 S 250 0, 300 20 S 380 40, 400 20 V40 H0 Z" fill={color} />
    </svg>
  );
}
