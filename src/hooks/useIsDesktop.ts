import { useEffect, useState } from "react";

export function useIsDesktop(minWidth = 1024): boolean {
  const q = `(min-width:${minWidth}px) and (pointer:fine)`;
  const [ok, setOk] = useState(() => typeof window !== "undefined" && window.matchMedia(q).matches);
  useEffect(() => {
    const mq = window.matchMedia(q);
    const on = () => setOk(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [q]);
  return ok;
}
