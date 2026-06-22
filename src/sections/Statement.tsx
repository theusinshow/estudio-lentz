// src/sections/Statement.tsx
import ScrubText from "../motion/ScrubText";

export default function Statement() {
  return (
    <section className="border-t border-line py-32">
      <div className="wrap">
        <div className="mb-8 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-mut">
          <span className="h-px w-9 bg-acc" />Estúdio
        </div>
        <ScrubText
          className="max-w-[18ch] font-display text-[clamp(28px,5vw,72px)] font-medium uppercase leading-[1.05] tracking-tight"
          text="Tratamos concreto, luz e vazio como matéria-prima do pensamento."
        />
      </div>
    </section>
  );
}
