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
        <SectionLabel index="03" className="mb-12">Abordagem</SectionLabel>
        {/* Índice editorial (não grid de cards): réguas, ordinal mono, título grande
            e descrição, em colunas assimétricas — eco da lista de projetos. */}
        <ul>
          {STEPS.map((s) => (
            <li
              key={s.n}
              className="grid grid-cols-1 gap-3 border-t border-line py-9 last:border-b md:grid-cols-12 md:items-baseline md:gap-8 md:py-11"
            >
              <span className="font-mono text-xs uppercase tracking-[0.18em] text-acc md:col-span-1">{s.n}</span>
              <h4 className="font-display text-2xl font-extrabold uppercase tracking-tight md:col-span-4 md:text-[28px]">{s.t}</h4>
              <p className="max-w-[52ch] text-[15px] leading-relaxed text-mut md:col-span-7">{s.d}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
