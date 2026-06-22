import Hero from "../sections/Hero";
import Statement from "../sections/Statement";
import FeaturedProjects from "../sections/FeaturedProjects";
import Approach from "../sections/Approach";
import Testimonials from "../sections/Testimonials";
import CtaBig from "../sections/CtaBig";
import { usePageMeta } from "../hooks/usePageMeta";

export default function Home() {
  usePageMeta({
    title: "Estúdio Lentz — Arquitetura em Florianópolis",
    description: "Escritório de arquitetura em Florianópolis. Concreto, luz e vazio como matéria-prima do pensamento.",
    path: "/",
  });
  return (
    <>
      <Hero />
      <Statement />
      <FeaturedProjects />
      <Approach />
      <Testimonials />
      <CtaBig />
    </>
  );
}
