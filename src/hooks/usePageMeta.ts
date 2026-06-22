import { useEffect } from "react";

const SITE = "https://estudiolentz.com.br";
const DEFAULT_OG = `${SITE}/projects/casa-patio/cover.jpg`;

type Meta = {
  title: string;
  description?: string;
  /** Caminho absoluto da rota, ex.: "/projetos". Vira canonical + og:url. */
  path?: string;
  /** Imagem de compartilhamento (caminho relativo ou URL absoluta). */
  image?: string;
};

function setMeta(selector: string, attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

const abs = (src: string) => (src.startsWith("http") ? src : `${SITE}${src}`);

/**
 * Atualiza title + meta (description, Open Graph, Twitter, canonical) por rota.
 * Imperativo de propósito: o site é SPA e não há SSR, então cada rota reescreve
 * as tags no <head> ao montar. Sem dependência extra de helmet.
 */
export function usePageMeta({ title, description, path = "/", image }: Meta) {
  useEffect(() => {
    document.title = title;
    const url = `${SITE}${path}`;
    const ogImage = abs(image ?? DEFAULT_OG);

    if (description) {
      setMeta('meta[name="description"]', "name", "description", description);
      setMeta('meta[property="og:description"]', "property", "og:description", description);
      setMeta('meta[name="twitter:description"]', "name", "twitter:description", description);
    }
    setMeta('meta[property="og:title"]', "property", "og:title", title);
    setMeta('meta[name="twitter:title"]', "name", "twitter:title", title);
    setMeta('meta[property="og:url"]', "property", "og:url", url);
    setMeta('meta[property="og:image"]', "property", "og:image", ogImage);
    setMeta('meta[name="twitter:image"]', "name", "twitter:image", ogImage);

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", url);
  }, [title, description, path, image]);
}
