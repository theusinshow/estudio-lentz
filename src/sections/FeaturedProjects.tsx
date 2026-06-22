// src/sections/FeaturedProjects.tsx
import { PROJECTS } from "../content/data/projects";
import ProjectCard from "../components/ProjectCard";
import ClipReveal from "../motion/ClipReveal";

export default function FeaturedProjects() {
  return (
    <section className="border-t border-line py-32">
      <div className="wrap">
        <div className="mb-8 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-mut">
          <span className="h-px w-9 bg-acc" />Projetos selecionados
        </div>
        <div className="grid grid-cols-1 gap-[18px] md:grid-cols-2">
          {PROJECTS.map((p) => (
            <ClipReveal key={p.slug}><ProjectCard project={p} /></ClipReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
