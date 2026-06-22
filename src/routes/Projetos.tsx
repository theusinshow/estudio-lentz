// src/routes/Projetos.tsx
import { useState } from "react";
import { PROJECTS } from "../content/data/projects";
import ProjectListRow from "../components/ProjectListRow";
import CursorImage from "../components/CursorImage";
import SectionLabel from "../components/SectionLabel";
import { useIsDesktop } from "../hooks/useIsDesktop";

export default function Projetos() {
  const desktop = useIsDesktop();
  const [hover, setHover] = useState<string | null>(null);
  const active = PROJECTS.find((p) => p.slug === hover);
  return (
    <div className="pt-[68px]">
      <section className="py-24">
        <div className="wrap">
          <SectionLabel className="mb-12">Projetos</SectionLabel>
          <div className="border-t border-line">
            {PROJECTS.map((p) => (
              <ProjectListRow key={p.slug} project={p}
                onEnter={() => desktop && setHover(p.slug)} onLeave={() => setHover(null)} />
            ))}
          </div>
        </div>
      </section>
      {desktop && <CursorImage src={active?.cover ?? ""} active={!!active} />}
    </div>
  );
}
