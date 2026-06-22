export default function Footer() {
  return (
    <footer className="border-t border-line py-10">
      <div className="wrap flex flex-wrap items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.18em] text-mut">
        <span>©2026 Estúdio Lentz</span>
        <span className="flex gap-5">
          <a href="#" className="transition-colors hover:text-fg">Instagram</a>
          <a href="#" className="transition-colors hover:text-fg">LinkedIn</a>
          <a href="#" className="transition-colors hover:text-fg">Behance</a>
        </span>
        <span>Coded by M</span>
      </div>
    </footer>
  );
}
