import { Link } from "react-router-dom";
import { EMAIL, MAILTO, WHATSAPP_URL, WHATSAPP_DISPLAY } from "../content/contact";

const SOCIAL = [
  { href: "https://instagram.com/estudio.lentz", label: "Instagram", handle: "@estudio.lentz" },
  { href: "https://linkedin.com", label: "LinkedIn", handle: "" },
  { href: "https://behance.net", label: "Behance", handle: "" },
];

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="wrap grid grid-cols-1 gap-12 py-16 sm:grid-cols-2 md:grid-cols-12 md:py-20">
        {/* Marca + posicionamento */}
        <div className="sm:col-span-2 md:col-span-4">
          <Link to="/" className="font-display text-3xl font-black uppercase leading-none tracking-tight md:text-4xl">
            Estúdio Lentz
          </Link>
          <p className="mt-5 max-w-[34ch] text-sm leading-relaxed text-mut">
            Arquitetura em Florianópolis. Projetamos de dentro para fora: estrutura, luz e
            material em linguagem direta.
          </p>
        </div>

        {/* Contato */}
        <div className="md:col-span-3">
          <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-mut">Contato</h3>
          <ul className="mt-5 space-y-3 text-sm">
            <li><a href={MAILTO} className="transition-colors hover:text-acc">{EMAIL}</a></li>
            <li><a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="transition-colors hover:text-acc">WhatsApp {WHATSAPP_DISPLAY}</a></li>
          </ul>
        </div>

        {/* Ateliê */}
        <div className="md:col-span-3">
          <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-mut">Ateliê</h3>
          <address className="mt-5 space-y-1 text-sm not-italic text-fg/80">
            <p>Rua Bocaiúva, 2125 — sala 304</p>
            <p>Centro · Florianópolis — SC</p>
            <p className="text-mut">Seg–sex, 9h às 18h</p>
          </address>
        </div>

        {/* Social */}
        <div className="md:col-span-2">
          <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-mut">Social</h3>
          <ul className="mt-5 space-y-3 text-sm">
            {SOCIAL.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noreferrer" className="flex flex-wrap items-baseline gap-x-2 transition-colors hover:text-acc">
                  <span>{s.label}</span>
                  {s.handle && <span className="text-[11px] text-mut">{s.handle}</span>}
                  <span aria-hidden>↗</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Barra inferior */}
      <div className="border-t border-line">
        <div className="wrap flex flex-col gap-2 py-6 font-mono text-[11px] uppercase tracking-[0.16em] text-mut lg:flex-row lg:items-center lg:justify-between">
          <span>©2026 Estúdio Lentz · CAU/BR 000000-0 · Desde 2018</span>
          <span className="opacity-70">Projeto fictício · portfólio demonstrativo</span>
          <span>Coded by M</span>
        </div>
      </div>
    </footer>
  );
}
