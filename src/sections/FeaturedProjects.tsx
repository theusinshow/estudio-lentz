// src/sections/FeaturedProjects.tsx
import { Link } from "react-router-dom";
import { FEATURED } from "../content/data/projects";
import ProjectCard from "../components/ProjectCard";
import ClipReveal from "../motion/ClipReveal";
import SectionLabel from "../components/SectionLabel";

export default function FeaturedProjects() {
  const [lead, ...rest] = FEATURED;
  return (
    <section className="border-t border-line py-32">
      <div className="wrap">
        <div className="mb-8 flex items-center justify-between gap-3">
          <SectionLabel index="02">Projetos selecionados</SectionLabel>
          <Link to="/projetos" className="whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.18em] text-mut transition-colors hover:text-fg">Ver todos →</Link>
        </div>
        <div className="grid gap-[18px]">
          {lead && <ClipReveal><ProjectCard project={lead} hero /></ClipReveal>}
          {rest.length > 0 && (
            <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((p) => (
                <ClipReveal key={p.slug}><ProjectCard project={p} /></ClipReveal>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
