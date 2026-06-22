import type { ReactNode } from "react";

// Rótulo de seção: índice numerado (paginação editorial) + hairline vermelho + texto.
// O índice é opcional — páginas avulsas usam só o hairline.
export default function SectionLabel({
  index, className = "", children,
}: { index?: string; className?: string; children: ReactNode }) {
  return (
    <div className={`flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-mut ${className}`}>
      {index && <span className="text-fg">{index}</span>}
      <span className="h-px w-9 bg-acc" aria-hidden />
      <span>{children}</span>
    </div>
  );
}
