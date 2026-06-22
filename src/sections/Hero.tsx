// src/sections/Hero.tsx
import RevealText from "../motion/RevealText";
import ParallaxImage from "../motion/ParallaxImage";

const HERO_IMG = "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1800&q=80&auto=format&fit=crop";

export default function Hero() {
  return (
    <section className="relative flex min-h-[100svh] items-end overflow-hidden">
      <div className="absolute inset-0">
        <ParallaxImage src={HERO_IMG} amount={16} className="opacity-85" />
        <div className="absolute inset-0 bg-gradient-to-b from-bg/45 via-bg/25 to-bg" />
      </div>
      <div className="wrap relative z-10 pb-14">
        <div className="mb-6 flex gap-5 font-mono text-[11px] uppercase tracking-[0.18em]">
          <span>Arquitetura</span><span>Florianópolis — SC</span><span>Desde 2018</span>
        </div>
        <RevealText as="h1" className="font-display text-[clamp(56px,11vw,160px)] font-black uppercase leading-[0.86] tracking-tight"
          lines={["Construir", 'é <span class="text-acc">pensar</span>']} />
        <div className="mt-7 flex flex-wrap items-end justify-between gap-6">
          <p className="max-w-[440px] text-lg leading-relaxed text-fg/85">Projetamos de dentro para fora — estrutura, luz e material em linguagem direta. A obra é a consequência de um pensamento claro.</p>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-mut">↓ Role para ver</span>
        </div>
      </div>
    </section>
  );
}
