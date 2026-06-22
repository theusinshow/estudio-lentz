// src/components/ProjectCard.tsx
import { Link } from "react-router-dom";
import type { Project } from "../content/data/projects";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link to={`/projetos/${project.slug}`} className="group relative block aspect-[16/11] overflow-hidden">
      <img src={project.cover} alt={project.name} loading="lazy"
        className="h-full w-full object-cover brightness-[0.8] grayscale-[0.4] transition-[transform,filter] duration-700 ease-out group-hover:scale-[1.07] group-hover:grayscale-0 group-hover:brightness-100" />
      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-b from-bg/10 to-bg/70 p-6">
        <h3 className="translate-y-9 font-display text-[clamp(26px,3vw,44px)] font-black uppercase leading-none tracking-tight transition-transform duration-500 ease-out group-hover:translate-y-0">{project.name}</h3>
        <div className="mt-3.5 flex translate-y-4 items-center justify-between font-mono text-[11px] uppercase tracking-[0.16em] opacity-0 transition-[opacity,transform] duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100">
          <span>{project.local} · {project.area}</span>
          <span className="rounded-full border border-fg px-3 py-1.5">Ver projeto →</span>
        </div>
      </div>
    </Link>
  );
}
