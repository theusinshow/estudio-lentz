// src/sections/Hero.tsx
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import RevealText from "../motion/RevealText";
import { FEATURED } from "../content/data/projects";
import { useReducedMotion } from "../hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

const SLIDES = FEATURED.map((p) => p.cover); // capas curadas (destaques)
const INTERVAL = 5500; // ms entre trocas de capa

export default function Hero() {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [manualPaused, setManualPaused] = useState(false);
  const [interacting, setInteracting] = useState(false); // hover/foco dentro do hero
  const bgRef = useRef<HTMLDivElement>(null);

  const multi = SLIDES.length > 1;
  const playing = !reduced && !manualPaused && !interacting && multi;

  // Autoplay — só roda quando "playing"; pausa em reduced-motion, hover/foco ou pausa manual.
  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), INTERVAL);
    return () => window.clearInterval(id);
  }, [playing]);

  // Parallax do fundo (aplicado ao wrapper que contém todas as capas).
  useLayoutEffect(() => {
    if (reduced || !bgRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        bgRef.current!,
        { yPercent: -7, scale: 1.16 },
        { yPercent: 7, scale: 1.16, ease: "none",
          scrollTrigger: { trigger: bgRef.current!, start: "top top", end: "bottom top", scrub: true } },
      );
    }, bgRef);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      className="relative flex min-h-[88svh] items-end overflow-hidden"
      onMouseEnter={() => setInteracting(true)}
      onMouseLeave={() => setInteracting(false)}
      onFocusCapture={() => setInteracting(true)}
      onBlurCapture={() => setInteracting(false)}
    >
      <div className="absolute inset-0">
        {/* Capas em crossfade */}
        <div ref={bgRef} className="absolute inset-0" style={reduced ? { transform: "scale(1.16)" } : undefined}>
          {SLIDES.map((src, i) => (
            <img
              key={src + i}
              src={src}
              alt=""
              aria-hidden
              className="absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ease-out"
              style={{ opacity: i === index ? 1 : 0 }}
            />
          ))}
        </div>
        {/* Vinheta inferior: funde a base da imagem na cor do site */}
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/25 to-transparent" />
      </div>

      <div className="wrap relative z-10 pb-14">
        <div className="relative">
          {/* Placa tintada: contraste garantido sobre qualquer capa (eco do blur da navbar,
              mas com tinta pesada e bordas retas — chapa técnica, não card de vidro). */}
          <div className="absolute -inset-x-6 -inset-y-7 -z-10 bg-bg/70 backdrop-blur-md md:-inset-x-9" aria-hidden />

          <div className="mb-6 flex flex-wrap gap-5 font-mono text-[11px] uppercase tracking-[0.18em] text-fg">
            <span>Arquitetura</span><span>Florianópolis — SC</span><span>Desde 2018</span>
          </div>
          <RevealText
            as="h1"
            className="font-display text-[clamp(56px,11vw,160px)] font-black uppercase leading-[0.86] tracking-tight text-fg"
            lines={["Construir", 'é <span class="text-acc">pensar</span>']}
          />
          <div className="mt-7 flex flex-wrap items-end justify-between gap-6">
            <p className="max-w-[440px] text-lg leading-relaxed text-fg/85">
              Projetamos de dentro para fora: estrutura, luz e material em linguagem direta. A obra é a consequência de um pensamento claro.
            </p>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-fg/70">↓ Role para ver</span>
          </div>

          {multi && (
            <div className="mt-9 flex items-center gap-4">
              <div className="flex gap-1" role="tablist" aria-label="Capas em destaque">
                {SLIDES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setIndex(i)}
                    aria-label={`Capa ${i + 1}`}
                    aria-selected={i === index}
                    role="tab"
                    className="group flex h-8 items-center px-1.5"
                  >
                    <span
                      className={`block h-1 rounded-full transition-all duration-500 ${i === index ? "w-8 bg-acc" : "w-4 bg-fg/30 group-hover:bg-fg/60"}`}
                    />
                  </button>
                ))}
              </div>
              {/* Pausa/play — só faz sentido quando há autoplay (some em reduced-motion) */}
              {!reduced && (
                <button
                  onClick={() => setManualPaused((p) => !p)}
                  aria-label={manualPaused ? "Reproduzir slideshow" : "Pausar slideshow"}
                  aria-pressed={manualPaused}
                  className="flex h-8 items-center font-mono text-[10px] uppercase tracking-[0.18em] text-fg/55 transition-colors hover:text-fg"
                >
                  {manualPaused ? "▶ Play" : "❚❚ Pausar"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
