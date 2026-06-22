// src/routes/ProjetoDetalhe.tsx
import { useParams, Link, Navigate } from "react-router-dom";
import { PROJECTS, getProject } from "../content/data/projects";
import ClipReveal from "../motion/ClipReveal";
import RevealText from "../motion/RevealText";
import { usePageMeta } from "../hooks/usePageMeta";

export default function ProjetoDetalhe() {
  const { slug } = useParams();
  const project = slug ? getProject(slug) : undefined;
  // Hooks devem rodar sempre na mesma ordem; por isso o usePageMeta vem antes do
  // early-return, com um fallback neutro quando o slug é inválido.
  usePageMeta({
    title: project ? `${project.name} — Estúdio Lentz` : "Projeto — Estúdio Lentz",
    description: project?.blurb,
    path: project ? `/projetos/${project.slug}` : "/projetos",
    image: project?.cover,
  });
  if (!project) return <Navigate to="/projetos" replace />;

  const idx = PROJECTS.findIndex((p) => p.slug === project.slug);
  const next = PROJECTS[(idx + 1) % PROJECTS.length];
  const [lead, a, b, full, inset] = project.gallery;

  return (
    <div className="pt-[68px]">
      {/* Cabeçalho */}
      <section className="py-20">
        <div className="wrap">
          <div className="mb-8 font-mono text-[11px] uppercase tracking-[0.18em] text-mut">
            {project.type} · {project.year}
          </div>
          <RevealText
            as="h1"
            className="font-display text-[clamp(44px,9vw,140px)] font-black uppercase leading-[0.86] tracking-tight"
            lines={[project.name]}
          />
          <dl className="mt-10 grid grid-cols-2 gap-6 border-t border-line pt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-mut md:grid-cols-4">
            <div><dt className="text-fg">Local</dt><dd>{project.local}</dd></div>
            <div><dt className="text-fg">Área</dt><dd>{project.area}</dd></div>
            <div><dt className="text-fg">Tipo</dt><dd>{project.type}</dd></div>
            <div><dt className="text-fg">Ano</dt><dd>{project.year}</dd></div>
          </dl>
        </div>
      </section>

      {/* Imagem de abertura, largura cheia */}
      <section className="pb-20">
        <div className="wrap">
          <ClipReveal className="aspect-[16/9] overflow-hidden">
            <img src={lead} alt={`${project.name} — vista principal`} className="h-full w-full object-cover" />
          </ClipReveal>
        </div>
      </section>

      {/* Partido / briefing */}
      <section className="pb-24">
        <div className="wrap max-w-[64ch] text-xl leading-relaxed text-fg/90">{project.description}</div>
      </section>

      {/* Par de imagens */}
      <section className="pb-24">
        <div className="wrap grid gap-5 md:grid-cols-2">
          <ClipReveal className="aspect-[4/5] overflow-hidden">
            <img src={a} alt={`${project.name} — detalhe 1`} loading="lazy" className="h-full w-full object-cover" />
          </ClipReveal>
          <ClipReveal className="aspect-[4/5] overflow-hidden">
            <img src={b} alt={`${project.name} — detalhe 2`} loading="lazy" className="h-full w-full object-cover" />
          </ClipReveal>
        </div>
      </section>

      {/* Citação de destaque */}
      <section className="border-y border-line py-24">
        <div className="wrap">
          <RevealText
            as="blockquote"
            lines={[`“${project.quote}”`]}
            className="max-w-[24ch] font-display text-[clamp(28px,4.5vw,56px)] font-black uppercase leading-[0.98] tracking-tight"
          />
        </div>
      </section>

      {/* Processo / materialidade */}
      <section className="py-24">
        <div className="wrap max-w-[64ch] text-lg leading-relaxed text-fg/85">{project.concept}</div>
      </section>

      {/* Imagem cheia */}
      <section className="pb-24">
        <div className="wrap">
          <ClipReveal className="aspect-[16/9] overflow-hidden">
            <img src={full} alt={`${project.name} — conjunto`} loading="lazy" className="h-full w-full object-cover" />
          </ClipReveal>
        </div>
      </section>

      {/* Ficha técnica + imagem recolhida */}
      <section className="border-t border-line py-20">
        <div className="wrap grid gap-12 md:grid-cols-[0.8fr_1.2fr] md:items-start">
          <dl className="grid grid-cols-2 gap-y-6 font-mono text-[11px] uppercase tracking-[0.14em] text-mut">
            {project.credits.map((c) => (
              <div key={c.role}>
                <dt className="text-mut">{c.role}</dt>
                <dd className="mt-1 text-fg">{c.name}</dd>
              </div>
            ))}
          </dl>
          <ClipReveal className="aspect-[4/3] overflow-hidden">
            <img src={inset} alt={`${project.name} — detalhe final`} loading="lazy" className="h-full w-full object-cover" />
          </ClipReveal>
        </div>
      </section>

      {/* Próximo projeto */}
      <section className="border-t border-line py-20">
        <div className="wrap flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-mut">Próximo projeto</span>
          <Link
            to={`/projetos/${next.slug}`}
            className="font-display text-[clamp(28px,5vw,64px)] font-black uppercase leading-[0.9] tracking-tight transition-colors hover:text-acc sm:text-right"
          >
            {next.name} →
          </Link>
        </div>
      </section>
    </div>
  );
}
