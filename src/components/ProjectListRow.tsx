// src/components/ProjectListRow.tsx
import { Link } from "react-router-dom";
import type { Project } from "../content/data/projects";

export default function ProjectListRow({
  project, onEnter, onLeave,
}: { project: Project; onEnter: () => void; onLeave: () => void }) {
  return (
    <Link to={`/projetos/${project.slug}`} onMouseEnter={onEnter} onMouseLeave={onLeave}
      className="group relative flex items-baseline justify-between gap-5 border-b border-line py-7 pl-1.5 transition-[padding] duration-300 hover:pl-7">
      <span className="pointer-events-none absolute left-[-4px] top-1/2 -translate-y-1/2 translate-x-[-10px] text-2xl text-acc opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">→</span>
      <span className="font-display text-[clamp(30px,5.5vw,72px)] font-black uppercase leading-[0.9] tracking-tight transition-colors duration-300 group-hover:text-acc">{project.name}</span>
      <span className="whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.1em] text-mut transition-colors duration-300 group-hover:text-fg">{project.type} · {project.year}</span>
    </Link>
  );
}
