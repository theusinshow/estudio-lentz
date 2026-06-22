import { useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { useUiStore } from "../store/useUiStore";

const LINKS = [
  { to: "/projetos", label: "Projetos" },
  { to: "/contato", label: "Contato" },
];

export default function Header() {
  const { menuOpen, setMenuOpen, toggleMenu } = useUiStore();

  // Fix 6: Escape key closes the mobile drawer
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [menuOpen, setMenuOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-[68px] border-b border-line bg-bg/55 backdrop-blur">
      <div className="wrap flex h-full items-center justify-between">
        <Link to="/" className="font-display text-[15px] font-extrabold uppercase tracking-tight">Estúdio Lentz</Link>
        <nav className="hidden gap-8 font-mono text-[11px] uppercase tracking-[0.18em] md:flex">
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} className={({ isActive }) => (isActive ? "text-fg" : "text-mut transition-colors hover:text-fg")}>{l.label}</NavLink>
          ))}
        </nav>
        <Link to="/contato" className="hidden rounded-full border border-fg px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors hover:bg-fg hover:text-bg md:inline-block">Iniciar projeto</Link>
        {/* Fix 5: use toggleMenu to avoid stale-closure bug */}
        <button className="font-mono text-[11px] uppercase tracking-widest md:hidden" onClick={toggleMenu} aria-label="Menu" aria-expanded={menuOpen}>{menuOpen ? "Fechar" : "Menu"}</button>
      </div>
      {menuOpen && (
        // Fix 6: drawer semantics for screen readers
        <div role="dialog" aria-modal="true" aria-label="Menu de navegação" className="border-b border-line bg-bg px-6 py-6 md:hidden">
          {[...LINKS, { to: "/", label: "Início" }].map((l) => (
            <NavLink key={l.to} to={l.to} onClick={() => setMenuOpen(false)} className="block py-2 font-display text-3xl uppercase">{l.label}</NavLink>
          ))}
        </div>
      )}
    </header>
  );
}
