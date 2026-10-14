/* eslint-disable @next/next/no-img-element */
export default function Seal({ size = 160, className = "" }: { size?: number; className?: string }) {
  return <img src="/seal.svg" width={size} height={size} alt="MP wax seal" className={className} />;
}
export function SealBullet() {
  return <img src="/seal.svg" width={18} height={18} alt="" aria-hidden className="inline-block shrink-0" />;
}
