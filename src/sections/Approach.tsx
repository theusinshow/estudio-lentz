// src/sections/Approach.tsx
import SectionLabel from "../components/SectionLabel";

const STEPS = [
  { n: "01", t: "Lógica", d: "Todo projeto começa por um partido claro: estrutura e implantação antes da forma." },
  { n: "02", t: "Matéria", d: "Concreto, madeira e vidro em estado bruto — sem ornamento, com intenção." },
  { n: "03", t: "Luz", d: "A luz natural é desenhada: orientação, vazios e aberturas como projeto." },
  { n: "04", t: "Habitar", d: "O espaço só termina quando é vivido. Entregamos obra, não render." },
];

export default function Approach() {
  return (
    <section className="border-t border-line py-32">
      <div className="wrap">
        <SectionLabel index="03" className="mb-8">Abordagem</SectionLabel>
        <div className="grid grid-cols-1 gap-px border border-line bg-line md:grid-cols-4">
          {STEPS.map((s) => (
            <div key={s.n} className="flex min-h-[230px] flex-col justify-between bg-bg p-7 pb-10">
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-acc">{s.n}</span>
              <div>
                <h4 className="font-display text-xl font-extrabold uppercase tracking-tight">{s.t}</h4>
                <p className="mt-3 text-sm leading-relaxed text-mut">{s.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
