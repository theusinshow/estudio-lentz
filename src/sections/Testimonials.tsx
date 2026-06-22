// src/sections/Testimonials.tsx
import { useState } from "react";

const ITEMS = [
  { q: "Transformaram um terreno difícil na casa que a gente não sabia que queria.", by: "Marina A.", role: "Casa Pátio", ph: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&q=80&auto=format&fit=crop" },
  { q: "Rigor técnico e sensibilidade na mesma medida. Raro.", by: "Eduardo M.", role: "Galpão Cru", ph: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80&auto=format&fit=crop" },
  { q: "Entenderam a empresa antes de desenhar uma linha.", by: "Clara V.", role: "Edifício Lâmina", ph: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&q=80&auto=format&fit=crop" },
];

export default function Testimonials() {
  const [i, setI] = useState(0);
  const it = ITEMS[i];
  return (
    <section className="border-t border-line py-32">
      <div className="wrap">
        <div className="mb-10 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.18em] text-mut">
          <span className="flex items-center gap-3"><span className="h-px w-9 bg-acc" />Depoimentos</span>
          <span className="flex items-center gap-4">
            <button aria-label="Anterior" onClick={() => setI((i - 1 + ITEMS.length) % ITEMS.length)} className="transition-colors hover:text-fg">←</button>
            <span>{String(i + 1).padStart(2, "0")} / {String(ITEMS.length).padStart(2, "0")}</span>
            <button aria-label="Próximo" onClick={() => setI((i + 1) % ITEMS.length)} className="transition-colors hover:text-fg">→</button>
          </span>
        </div>
        {/* Fix 7: aria-live so screen readers announce quote changes */}
        <div aria-live="polite" aria-atomic="true" className="grid grid-cols-[120px_1fr] items-center gap-8">
          <div className="h-[120px] w-[120px] overflow-hidden rounded-full"><img src={it.ph} alt="" className="h-full w-full object-cover" /></div>
          <div>
            <blockquote className="max-w-[20ch] font-display text-[clamp(22px,2.8vw,36px)] font-medium leading-[1.25] tracking-tight">"{it.q}"</blockquote>
            <div className="mt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-mut">{it.by} · Cliente, {it.role}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
