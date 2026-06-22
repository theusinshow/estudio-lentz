/**
 * Utilitários de math do projeto. `remap` é o mais usado: traduz o `progress` global
 * (ou o progresso de um ato) numa faixa de saída qualquer, com clamp. Ver SCROLL_MECHANICS.md.
 */

export function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

/** Remapeia `value` de [inMin,inMax] para [outMin,outMax], com clamp na entrada. */
export function remap(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
): number {
  const t = clamp((value - inMin) / (inMax - inMin), 0, 1);
  return outMin + t * (outMax - outMin);
}
