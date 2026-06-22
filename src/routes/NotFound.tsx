import { Link } from "react-router-dom";
import RevealText from "../motion/RevealText";
import SectionLabel from "../components/SectionLabel";
import { usePageMeta } from "../hooks/usePageMeta";

export default function NotFound() {
  usePageMeta({
    title: "Página não encontrada — Estúdio Lentz",
    description: "O endereço que você procurou não existe. Veja os projetos do Estúdio Lentz.",
    path: "/404",
  });

  return (
    <div className="pt-[68px]">
      <section className="flex min-h-[80vh] flex-col justify-center py-24">
        <div className="wrap">
          <SectionLabel className="mb-8">Erro 404</SectionLabel>
          <RevealText
            as="h1"
            className="font-display text-[clamp(40px,8vw,120px)] font-black uppercase leading-[0.88] tracking-tight"
            lines={["Endereço", 'sem <span class="text-acc">obra</span>']}
          />
          <p className="mt-8 max-w-[48ch] text-lg leading-relaxed text-fg/85">
            A página que você procurou não existe ou foi movida. Acontece com os melhores terrenos.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
            <Link
              to="/projetos"
              className="group inline-flex w-fit items-center gap-3 rounded-full bg-acc px-7 py-4 font-mono text-xs uppercase tracking-[0.18em] text-bg transition-colors hover:bg-fg"
            >
              Ver os projetos
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
            <Link to="/" className="font-mono text-sm uppercase tracking-wide text-fg underline-offset-8 transition-colors hover:text-acc hover:underline">
              Voltar ao início
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
