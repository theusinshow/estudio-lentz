# Performance, mobile & acessibilidade

Site 3D + scroll mata aparelho fraco se feito errado. Estas regras são parte da arquitetura,
não um "depois".

---

## Regras de performance

1. **Cena única e persistente.** Nunca destruir/recriar objetos por ato — só animar props
   (scale, opacity, position). Tudo instanciado uma vez no mount.
2. **Instancing** para repetição (pilares, ripas, qualquer elemento repetido) via
   `<Instances>` / `<Instance>` do drei.
3. **`useFrame` enxuto.** Leitura via `useScrollStore.getState()` — zero `setState` por frame.
4. **`damp` em vez de set direto** (`THREE.MathUtils.damp`) para suavizar e absorver jank.
5. **DPR limitado:** `<Canvas dpr={[1, 1.5]}>`. Não renderizar em 3x em telas retina.
6. **`frameloop`:** `"always"` durante scroll ativo, `"demand"` quando o usuário para
   (detectar scroll-idle e alternar). Economiza GPU e bateria.
7. **Lazy load do Canvas:** `React.lazy(() => import("./scene/Experience"))`, fora do
   bundle crítico, com `<Suspense>`.
8. **Texturas comprimidas** (KTX2/basis), tamanho modesto. Preferir materiais procedurais.
9. **Geometria procedural** (footprint extrudado) em vez de glTF pesado no hero. glTF só
   para detalhes do portfólio, com Draco/Meshopt e sob demanda.

---

## Detecção de low-perf

```ts
// src/hooks/useLowPerf.ts (esboço)
function detectLowPerf(): boolean {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return true;
  const cores = navigator.hardwareConcurrency ?? 4;
  const mem = (navigator as any).deviceMemory ?? 4;
  const isMobile = matchMedia("(max-width: 768px)").matches;
  const noWebGL = !document.createElement("canvas").getContext("webgl2");
  return noWebGL || (isMobile && (cores <= 4 || mem <= 4));
}
```

Resultado grava `isLowPerf` no store. `Experience.tsx` só monta o `<Canvas>` se NÃO for
low-perf.

---

## Fallback (modo estático/2D)

Quando `isLowPerf === true`: **não esconder, traduzir.** As mesmas 6 fases, mas em
SVG/CSS em vez de WebGL:

- Planta baixa em SVG (mesmo footprint, renderizado como paths).
- Camadas (estrutura, paredes, materiais) aparecem via scroll com Framer Motion +
  IntersectionObserver.
- Mais leve, mantém o conceito, não trava.

Como o conteúdo já vive em DOM real (ver ARCHITECTURE §2), o fallback é trivial: é só não
montar o canvas e ativar a versão 2D das seções.

---

## Acessibilidade

- `prefers-reduced-motion: reduce` → modo estático sempre.
- `<Canvas>` recebe `aria-hidden="true"` (decorativo).
- Navegação por links HTML reais; cada ato tem uma `<section id="...">` correspondente.
- Foco visível, ordem de tab lógica na camada de conteúdo.
- Contraste AA (ver DESIGN_SYSTEM).

---

## SEO

- Todo texto vendável é HTML real (não dentro do WebGL).
- Meta tags, Open Graph, sitemap.xml, robots.txt.
- Headings semânticos (`h1` único, hierarquia coerente).
- Imagens do portfólio com `alt` descritivo.

---

## Orçamento alvo

- Desktop: 60fps durante o scroll.
- Mobile: modo 2D, LCP < 2.5s, sem travas de scroll.
- Bundle crítico inicial leve (canvas e three lazy-loaded).
