# Scroll Mechanics — o coração do projeto

> ⚠️ **Parcialmente desatualizado.** A ponte GSAP→store (seções 3.1–3.2) continua exatamente
> igual. O que mudou: não há mais R3F/`useFrame`; o `progress` agora dirige um SVG (planta 2D)
> via `useScrollStore.subscribe`, atualizando atributos por ref. Fonte atual: `CLAUDE.md`.

Como o scroll dirige a construção da cena.

---

## Visão geral do fluxo

```
scroll do usuário
      │
      ▼
GSAP ScrollTrigger (scrub)   ──escreve──►   useScrollStore.progress (0→1)
                                                     │
                                                     ▼
                                  componentes R3F leem no useFrame
                                  e interpolam props (damp)
```

Princípio: **uma única fonte de verdade** (`progress`) e **um único responsável pela
suavização** (o `damp` no R3F). GSAP não toca em nada do Three.js diretamente.

---

## 1. Store (Zustand)

```ts
// src/store/useScrollStore.ts
import { create } from "zustand";

interface ScrollState {
  progress: number;      // 0 → 1
  isLowPerf: boolean;
  setProgress: (p: number) => void;
  setLowPerf: (v: boolean) => void;
}

export const useScrollStore = create<ScrollState>((set) => ({
  progress: 0,
  isLowPerf: false,
  setProgress: (progress) => set({ progress }),
  setLowPerf: (isLowPerf) => set({ isLowPerf }),
}));
```

## 2. Ponte GSAP → store

```ts
// src/hooks/useScrollBridge.ts
import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useScrollStore } from "../store/useScrollStore";

gsap.registerPlugin(ScrollTrigger);

export function useScrollBridge() {
  useLayoutEffect(() => {
    const proxy = { value: 0 };
    const tween = gsap.to(proxy, {
      value: 1,
      ease: "none",
      scrollTrigger: {
        trigger: "#content-layer",
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        onUpdate: (self) => useScrollStore.getState().setProgress(self.progress),
      },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);
}
```

## 3. Leitura no R3F (padrão obrigatório)

```ts
// dentro de qualquer componente de cena
useFrame((_, delta) => {
  const p = useScrollStore.getState().progress;       // SEM hook reativo
  const target = remap(p, 0.30, 0.50, 0, 1);           // janela do ato
  ref.current.scale.y = THREE.MathUtils.damp(
    ref.current.scale.y, target, 4, delta              // suavização
  );
});
```

**Nunca** faça `const progress = useScrollStore(s => s.progress)` num componente 3D — isso
re-renderiza a cada frame e mata a performance. Use `getState()` dentro do `useFrame`.

## 4. Utilitário central

```ts
// src/utils/math.ts
export const clamp = (v: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, v));

/** mapeia value de [inMin,inMax] para [outMin,outMax] com clamp */
export const remap = (
  value: number, inMin: number, inMax: number, outMin = 0, outMax = 1
) => {
  const t = clamp((value - inMin) / (inMax - inMin));
  return outMin + t * (outMax - outMin);
};
```

---

## 5. Os 6 atos

Cada ato é uma janela do `progress`. Mantenha como constantes para ajustar fácil.

```ts
// src/scene/acts.ts
export const ACTS = {
  TERRAIN:   [0.00, 0.12],  // planta baixa 2D se desenha
  STRUCTURE: [0.12, 0.30],  // pilares e lajes sobem
  WALLS:     [0.30, 0.50],  // paredes extrudam
  MATERIALS: [0.50, 0.68],  // texturas entram (opacidade 0→1)
  LIGHT:     [0.68, 0.85],  // luz preenche, sombras nascem
  INHABITED: [0.85, 1.00],  // render final, espaço habitado
} as const;
```

| Ato | O que acontece na cena | Conteúdo HTML sincronizado |
|---|---|---|
| Terreno | grid + planta 2D desenhando (linhas, cotas) | Hero |
| Estrutura | pilares/lajes sobem; wireframe visível | "todo projeto começa pela lógica" |
| Vedação | paredes extrudam do footprint | manifesto |
| Materiais | concreto, vidro, madeira aparecem | início do portfólio |
| Luz | iluminação preenche, sombras | cases em destaque |
| Habitado | câmera assenta no render final | CTA contato |

A câmera percorre TODOS os atos numa trajetória única (spline). `progress` controla a
posição no caminho. Ver `src/scene/cameraPath.ts`.

---

## 6. Armadilhas conhecidas

- **GSAP scrub + damp brigando:** não suavizar nos dois. GSAP escreve o valor cru; o damp
  do R3F faz a suavização. Se ficar "elástico demais", ajuste só o fator do damp.
- **ScrollTrigger e StrictMode:** em dev o `useLayoutEffect` roda 2x; sempre faça cleanup
  (`kill()`) no return, como no exemplo.
- **Altura da página:** o `#content-layer` precisa ter altura real (ex: ~600vh) pra haver
  scroll suficiente. Comece com 600vh e ajuste o ritmo dos atos.
