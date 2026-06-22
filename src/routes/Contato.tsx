// src/routes/Contato.tsx
import RevealText from "../motion/RevealText";

export default function Contato() {
  return (
    <div className="pt-[68px]">
      <section className="flex min-h-[80vh] flex-col justify-center py-24">
        <div className="wrap">
          <div className="mb-8 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-mut"><span className="h-px w-9 bg-acc" />Contato</div>
          <RevealText as="h1" className="font-display text-[clamp(40px,8vw,120px)] font-black uppercase leading-[0.88] tracking-tight" lines={["Vamos construir", 'o <span class="text-acc">seu</span>']} />
          <div className="mt-10 flex flex-col gap-3">
            <a href="mailto:contato@estudiolentz.com.br" className="font-mono text-lg uppercase tracking-wide text-acc underline-offset-8 hover:underline">contato@estudiolentz.com.br</a>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-mut">Florianópolis — SC · Atendimento em todo o Brasil</p>
          </div>
        </div>
      </section>
    </div>
  );
}
