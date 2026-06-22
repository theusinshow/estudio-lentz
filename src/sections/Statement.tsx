// src/sections/Statement.tsx
import ScrubText from "../motion/ScrubText";
import ClipReveal from "../motion/ClipReveal";
import SectionLabel from "../components/SectionLabel";
import { getProject } from "../content/data/projects";

const FEATURE = getProject("casa-costa");

export default function Statement() {
  return (
    <section className="border-t border-line py-32">
      <div className="wrap">
        <SectionLabel index="01" className="mb-10">Estúdio</SectionLabel>
        <div className="grid gap-10 md:grid-cols-12 md:items-center md:gap-12">
          <div className="md:col-span-7">
            <ScrubText
              className="font-display text-[clamp(28px,5vw,72px)] font-medium uppercase leading-[1.05] tracking-tight"
              text="Tratamos concreto, luz e vazio como matéria-prima do pensamento."
            />
          </div>
          {FEATURE && (
            <ClipReveal className="aspect-[4/5] overflow-hidden md:col-span-5">
              <img
                src={FEATURE.cover}
                alt="Casa Costa: volume metálico suspenso sobre a encosta vegetada"
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </ClipReveal>
          )}
        </div>
      </div>
    </section>
  );
}
