// src/components/ProjectCard.tsx
import { Link } from "react-router-dom";
import type { Project } from "../content/data/projects";

export default function ProjectCard({ project, hero = false }: { project: Project; hero?: boolean }) {
  return (
    <Link
      to={`/projetos/${project.slug}`}
      className={`group relative block overflow-hidden ${hero ? "aspect-[16/10] md:aspect-[21/9]" : "aspect-[16/11]"}`}
    >
      <img src={project.cover} alt={project.name} loading="lazy"
        className="h-full w-full object-cover brightness-[0.8] grayscale-[0.4] transition-[transform,filter] duration-700 ease-out group-hover:scale-[1.07] group-hover:grayscale-0 group-hover:brightness-100" />
      <div className={`absolute inset-0 flex flex-col justify-end bg-gradient-to-b from-bg/10 to-bg/70 ${hero ? "p-8 md:p-10" : "p-6"}`}>
        <h3 className={`font-display font-black uppercase leading-none tracking-tight transition-transform duration-500 ease-out [@media(hover:hover)]:translate-y-9 [@media(hover:hover)]:group-hover:translate-y-0 ${hero ? "text-[clamp(34px,5.5vw,84px)]" : "text-[clamp(26px,3vw,44px)]"}`}>{project.name}</h3>
        <div className="mt-3.5 flex items-center justify-between gap-3 font-mono text-[11px] uppercase tracking-[0.16em] transition-[opacity,transform] duration-500 ease-out [@media(hover:hover)]:translate-y-4 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-hover:opacity-100">
          <span>{project.local} · {project.area}</span>
          <span className="rounded-full border border-fg px-3 py-1.5">Ver projeto →</span>
        </div>
      </div>
    </Link>
  );
}
