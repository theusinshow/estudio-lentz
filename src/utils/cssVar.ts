/**
 * Lê uma CSS custom property (token de tokens.css) em runtime. Permite que o Three.js
 * use as MESMAS cores do design system sem hardcode — tokens.css continua fonte única.
 * (O Three não lê `var(--x)`; precisa do valor resolvido.)
 */
export function cssVar(name: string, fallback = "#000000"): string {
  if (typeof document === "undefined") return fallback;
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return value || fallback;
}
