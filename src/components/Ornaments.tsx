export function Hairline({ className = "" }: { className?: string }) {
  return <span aria-hidden className={`block h-px w-14 mx-auto bg-silver/70 ${className}`} />;
}
export function FlapDivider() {
  return (
    <svg aria-hidden viewBox="0 0 400 40" preserveAspectRatio="none" className="w-full h-10 my-6 opacity-40">
      <path d="M0 0 L200 38 L400 0" fill="none" stroke="#b9bcc0" strokeWidth="0.6" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
export function Botanical({ className = "", flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg aria-hidden viewBox="0 0 220 60" className={`w-48 h-auto mx-auto ${flip ? "-scale-x-100" : ""} ${className}`} fill="none" stroke="#b9bcc0" strokeWidth="0.7" strokeLinecap="round">
      <path d="M10 50 C 60 48, 110 30, 210 10" />
      {[40, 70, 100, 130, 160, 185].map((x, i) => {
        const y = 50 - (x - 10) * 0.2;
        return (
          <g key={x}>
            <path d={`M${x} ${y} q ${-6} ${-14} ${4} ${-20} q 4 12 -4 20`} />
            {i % 2 === 0 && <path d={`M${x + 6} ${y - 1} q 10 6 16 0 q -8 -6 -16 0`} />}
          </g>
        );
      })}
      <circle cx="210" cy="10" r="2" />
    </svg>
  );
}
