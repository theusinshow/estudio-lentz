import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Link, NavLink } from "react-router-dom";
import { useUiStore } from "../store/useUiStore";
import { EMAIL, MAILTO, WHATSAPP_URL } from "../content/contact";

const LINKS = [
  { to: "/", label: "Início", end: true },
  { to: "/projetos", label: "Projetos" },
  { to: "/contato", label: "Contato" },
];

export default function Header() {
  const { menuOpen, setMenuOpen, toggleMenu } = useUiStore();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Drawer aberto: move o foco pra dentro, prende o Tab (focus trap), Escape fecha,
  // e na saída devolve o foco ao botão que abriu.
  useEffect(() => {
    if (!menuOpen) return;
    const drawer = drawerRef.current;
    if (!drawer) return;
    const focusables = () => Array.from(drawer.querySelectorAll<HTMLElement>('a[href], button'));
    focusables()[0]?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setMenuOpen(false); return; }
      if (e.key !== "Tab") return;
      const list = focusables();
      if (list.length === 0) return;
      const first = list[0];
      const last = list[list.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      buttonRef.current?.focus();
    };
  }, [menuOpen, setMenuOpen]);

  // Trava o scroll de fundo enquanto o drawer está aberto
  useEffect(() => {
    const root = document.documentElement;
    if (menuOpen) root.style.overflow = "hidden";
    else root.style.overflow = "";
    return () => {
      root.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 h-[68px] border-b border-line bg-bg/55 backdrop-blur">
      <div className="wrap flex h-full items-center justify-between">
        <Link to="/" className="font-display text-[15px] font-extrabold uppercase tracking-tight">Estúdio Lentz</Link>
        <nav className="hidden gap-8 font-mono text-[11px] uppercase tracking-[0.18em] md:flex">
          {LINKS.filter((l) => l.to !== "/").map((l) => (
            <NavLink key={l.to} to={l.to} className={({ isActive }) => (isActive ? "text-fg" : "text-mut transition-colors hover:text-fg")}>{l.label}</NavLink>
          ))}
        </nav>
        <Link to="/contato" className="hidden rounded-full border border-fg px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors hover:bg-fg hover:text-bg md:inline-block">Iniciar projeto</Link>
        <button ref={buttonRef} className="font-mono text-[11px] uppercase tracking-widest md:hidden" onClick={toggleMenu} aria-label="Menu" aria-expanded={menuOpen}>{menuOpen ? "Fechar" : "Menu"}</button>
      </div>
      </header>

      {menuOpen && createPortal(
        <div
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-label="Menu de navegação"
          className="fixed inset-x-0 bottom-0 top-[68px] z-40 flex flex-col justify-between bg-bg px-6 pb-10 pt-8 md:hidden"
        >
          <nav className="flex flex-col">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `border-b border-line py-4 font-display text-4xl font-black uppercase tracking-tight transition-colors ${isActive ? "text-acc" : "text-fg"}`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-mut">
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" onClick={() => setMenuOpen(false)} className="inline-block rounded-full bg-acc px-4 py-2 text-bg transition-colors hover:bg-fg">Falar no WhatsApp →</a>
            <a href={MAILTO} className="mt-4 block text-fg transition-colors hover:text-acc">{EMAIL}</a>
            <p className="mt-2">Florianópolis — SC</p>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
