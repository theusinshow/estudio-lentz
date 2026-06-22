// src/routes/Contato.tsx
import RevealText from "../motion/RevealText";
import SectionLabel from "../components/SectionLabel";
import { EMAIL, MAILTO, WHATSAPP_URL } from "../content/contact";
import { usePageMeta } from "../hooks/usePageMeta";

export default function Contato() {
  usePageMeta({
    title: "Contato — Estúdio Lentz",
    description: "Comece seu projeto com o Estúdio Lentz. Atendimento em Florianópolis e em todo o Brasil.",
    path: "/contato",
  });
  return (
    <div className="pt-[68px]">
      <section className="flex min-h-[80vh] flex-col justify-center py-24">
        <div className="wrap">
          <SectionLabel className="mb-8">Contato</SectionLabel>
          <RevealText as="h1" className="font-display text-[clamp(40px,8vw,120px)] font-black uppercase leading-[0.88] tracking-tight" lines={["Toda obra", 'começa <span class="text-acc">aqui</span>']} />
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex w-fit items-center gap-3 whitespace-nowrap rounded-full bg-acc px-7 py-4 font-mono text-xs uppercase tracking-[0.18em] text-bg transition-colors hover:bg-fg"
            >
              Falar no WhatsApp
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </a>
            <a href={MAILTO} className="font-mono text-sm lowercase tracking-wide text-fg underline-offset-8 transition-colors hover:text-acc hover:underline">{EMAIL}</a>
          </div>
          <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.18em] text-mut">Florianópolis — SC · Atendimento em todo o Brasil · Seg–sex, 9h às 18h</p>
        </div>
      </section>
    </div>
  );
}
