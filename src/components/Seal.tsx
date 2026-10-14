/* eslint-disable @next/next/no-img-element */
// Real wax seal cropped from the approved save-the-date (public/art/save-the-date.jpg). Do not recolour.
export default function Seal({ className = "", hero = false, size }: { className?: string; hero?: boolean; size?: number }) {
  if (hero)
    return (
      <picture>
        <source srcSet="/seal@2x.webp" type="image/webp" />
        <img src="/seal.png" width={387} height={405} alt="MP wax seal" className={className} fetchPriority="high" />
      </picture>
    );
  return <img src="/seal.png" width={size ?? 80} height={Math.round((size ?? 80) * 405 / 387)} alt="MP wax seal" className={className} />;
}
export function SealBullet() {
  return <img src="/seal.png" width={18} height={19} alt="" aria-hidden className="inline-block shrink-0" />;
}
