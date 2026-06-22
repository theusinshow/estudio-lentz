// src/routes/ProjetoDetalhe.tsx
import { useParams, Link, Navigate } from "react-router-dom";
import { PROJECTS, getProject } from "../content/data/projects";
import ClipReveal from "../motion/ClipReveal";
import RevealText from "../motion/RevealText";

export default function ProjetoDetalhe() {
  const { slug } = useParams();
  const project = slug ? getProject(slug) : undefined;
  if (!project) return <Navigate to="/projetos" replace />;
  const idx = PROJECTS.findIndex((p) => p.slug === project.slug);
  const next = PROJECTS[(idx + 1) % PROJECTS.length];

  return (
    <div className="pt-[68px]">
      <section className="py-20">
        <div className="wrap">
          <div className="mb-8 font-mono text-[11px] uppercase tracking-[0.18em] text-mut">{project.type} · {project.year}</div>
          <RevealText as="h1" className="font-display text-[clamp(44px,9vw,140px)] font-black uppercase leading-[0.86] tracking-tight" lines={[project.name]} />
          <div className="mt-10 grid grid-cols-2 gap-6 border-t border-line pt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-mut md:grid-cols-4">
            <div><div className="text-fg">Local</div>{project.local}</div>
            <div><div className="text-fg">Área</div>{project.area}</div>
            <div><div className="text-fg">Tipo</div>{project.type}</div>
            <div><div className="text-fg">Ano</div>{project.year}</div>
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="wrap grid gap-5">
          {project.gallery.map((src, i) => (
            <ClipReveal key={i} className="aspect-[16/10] overflow-hidden">
              <img src={src} alt={`${project.name} ${i + 1}`} loading="lazy" className="h-full w-full object-cover" />
            </ClipReveal>
          ))}
        </div>
      </section>

      <section className="border-t border-line py-24">
        <div className="wrap max-w-[60ch] text-lg leading-relaxed text-fg/85">{project.description}</div>
      </section>

      <section className="border-t border-line py-20">
        <div className="wrap flex items-center justify-between">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-mut">Próximo projeto</span>
          <Link to={`/projetos/${next.slug}`} className="font-display text-[clamp(28px,5vw,64px)] font-black uppercase tracking-tight transition-colors hover:text-acc">{next.name} →</Link>
        </div>
      </section>
    </div>
  );
}
