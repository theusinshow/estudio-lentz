import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "../hooks/useLenis";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useUiStore } from "../store/useUiStore";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Layout() {
  const reduced = useReducedMotion();
  const { pathname } = useLocation();
  const { scrollToTop } = useLenis(!reduced);

  useEffect(() => {
    // Fix 1: use Lenis-aware scrollToTop instead of window.scrollTo
    scrollToTop();
    // Fix 4: close mobile menu on route change
    useUiStore.getState().setMenuOpen(false);
    // Fix 9: defer refresh one frame so lazy images have laid out
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, [pathname, scrollToTop]);

  return (
    <>
      <a
        href="#conteudo"
        className="sr-only font-mono text-[11px] uppercase tracking-[0.18em] focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-acc focus:px-4 focus:py-2 focus:text-bg"
      >
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo"><Outlet /></main>
      <Footer />
    </>
  );
}
