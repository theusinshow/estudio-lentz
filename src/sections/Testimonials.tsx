// src/sections/Testimonials.tsx
import { useState } from "react";
import SectionLabel from "../components/SectionLabel";

const ITEMS = [
  { q: "Transformaram um terreno difícil na casa que a gente não sabia que queria.", by: "Marina A.", role: "Casa Pátio" },
  { q: "Rigor técnico e sensibilidade na mesma medida. Raro.", by: "Eduardo M.", role: "Refúgio Serra" },
  { q: "Entenderam como vivemos antes de desenhar uma linha.", by: "Clara V.", role: "Casa Jardim" },
];

const initials = (name: string) =>
  name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();

export default function Testimonials() {
  const [i, setI] = useState(0);
  const it = ITEMS[i];
  return (
    <section className="border-t border-line py-32">
      <div className="wrap">
        <div className="mb-10 flex items-center justify-between gap-3">
          <SectionLabel index="04">Depoimentos</SectionLabel>
          <span className="flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.18em] text-mut">
            <button aria-label="Depoimento anterior" onClick={() => setI((i - 1 + ITEMS.length) % ITEMS.length)} className="flex h-11 w-11 items-center justify-center transition-colors hover:text-fg">←</button>
            <span className="tabular-nums">{String(i + 1).padStart(2, "0")} / {String(ITEMS.length).padStart(2, "0")}</span>
            <button aria-label="Próximo depoimento" onClick={() => setI((i + 1) % ITEMS.length)} className="flex h-11 w-11 items-center justify-center transition-colors hover:text-fg">→</button>
          </span>
        </div>
        {/* Fix 7: aria-live so screen readers announce quote changes */}
        <div aria-live="polite" aria-atomic="true" className="grid grid-cols-1 items-center gap-6 sm:grid-cols-[120px_1fr] sm:gap-8">
          <div className="flex h-20 w-20 items-center justify-center rounded-full border border-line font-display text-2xl font-black tracking-tight text-fg sm:h-[120px] sm:w-[120px] sm:text-4xl" aria-hidden>{initials(it.by)}</div>
          <div>
            <blockquote className="max-w-[20ch] font-display text-[clamp(22px,2.8vw,36px)] font-medium leading-[1.25] tracking-tight">"{it.q}"</blockquote>
            <div className="mt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-mut">{it.by} · Cliente, {it.role}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
