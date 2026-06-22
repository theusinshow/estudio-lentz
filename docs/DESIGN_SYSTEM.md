# Design System — brutalista-técnico

Direção: concreto, tipografia crua, labels de prancha de arquiteto. Nunca usar cores
hardcoded — sempre os tokens abaixo.

---

## Tokens de cor

```css
/* src/styles/tokens.css */
:root {
  --concrete-900: #1a1a18;   /* quase preto — concreto molhado */
  --concrete-700: #3d3d39;
  --concrete-400: #8a8a82;
  --concrete-100: #e8e6e0;   /* off-white — cimento seco */
  --paper:        #f5f2ed;   /* fundo prancha */
  --accent:       #fb3640;   /* vermelho técnico — cotas, destaques */
  --blueprint:    #2b54ff;   /* azul de planta — usado no Ato 0 */
}
```

Mapear no Tailwind via `theme.extend.colors` lendo as CSS vars, ex:

```js
// tailwind.config.js
colors: {
  concrete: {
    900: "var(--concrete-900)",
    700: "var(--concrete-700)",
    400: "var(--concrete-400)",
    100: "var(--concrete-100)",
  },
  paper: "var(--paper)",
  accent: "var(--accent)",
  blueprint: "var(--blueprint)",
}
```

## Tipografia (Google Fonts — grátis)

| Uso | Fonte | Alternativa |
|---|---|---|
| Display (títulos crus) | Archivo Expanded | Space Grotesk |
| Mono (labels técnicos) | Space Mono | JetBrains Mono |
| Corpo | Inter | Satoshi |

Display pesado e condensado; mono pra tudo que imita prancha técnica.

## Labels técnicos (assinatura visual)

Espalhar pequenos labels mono que imitam carimbo/cotas de prancha. Dão a personalidade:

```
PROJ. 001 / 2026        ESC. 1:100        FLORIANÓPOLIS — SC
REV. A                  ÁREA 248 M²        N ↑
ESTÚDIO LENTZ           ARQUITETURA        N ↑
```

Componente `src/ui/TechLabel.tsx` para padronizar (mono, uppercase, tracking largo,
cor concrete-400 ou accent).

## Princípios de layout

- Grid exposto; quebra proposital de grid em pontos de destaque.
- Bordas duras (sem border-radius, ou mínimo).
- Bastante respiro (negative space) entre blocos grandes de tipografia.
- Contraste forte: paper/concrete-900 com accent pontual.
- Cotas e setas como elementos decorativos reais (não só enfeite).

## Acessibilidade de cor

Garantir contraste AA: texto concrete-900 sobre paper/concrete-100 ✓. Accent só em
elementos grandes ou com peso; nunca texto pequeno accent sobre paper.
