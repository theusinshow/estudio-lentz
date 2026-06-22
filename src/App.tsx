import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./routes/Layout";
import Home from "./routes/Home";
import Projetos from "./routes/Projetos";
import ProjetoDetalhe from "./routes/ProjetoDetalhe";
import Contato from "./routes/Contato";
import NotFound from "./routes/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="projetos" element={<Projetos />} />
          <Route path="projetos/:slug" element={<ProjetoDetalhe />} />
          <Route path="contato" element={<Contato />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
