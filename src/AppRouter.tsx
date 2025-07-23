import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainAdmin } from "./layouts/MainLayout/MainAdmin";
import { MainLayout } from "./layouts";
import { LineamientosPage, BaseDeDatosPage, BibliotecasDigitalesPage, DiccionariosPage, EbooksPage, 
         FilosofiaPage, InicioPage, SugerenciasMaterial,
         Renovacion, NormasPage, RevistasElectronicasPage, AyudaPage, ServiciosBiblioteca, Catalogo, AdminPanel,  } from "./pages";

export const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<MainLayout />} >
                    <Route index element={<InicioPage />} />
                    <Route path="/filosofia" element={<FilosofiaPage />} />
                    <Route path="/lineamientos" element={<LineamientosPage />} />
                    <Route path="/base-de-datos" element={<BaseDeDatosPage />} />
                    <Route path="/bibliotecas-digitales" element={<BibliotecasDigitalesPage />} />
                    <Route path="/diccionarios" element={<DiccionariosPage />} />
                    <Route path="/ebooks" element={<EbooksPage />} />
                    <Route path="/normas" element={<NormasPage />} />
                    <Route path="/revistas-electronicas" element={<RevistasElectronicasPage />} />
                    <Route path="/ayuda" element={<AyudaPage />} />
                    <Route path="/catalogo" element={< Catalogo />} />
                    <Route path="/servicios" element={<ServiciosBiblioteca />} />
                    <Route path="/renovacion" element={<Renovacion />} />
                    <Route path="/solicitud-compra" element={<SugerenciasMaterial />} />
                </Route>
                <Route element={<MainAdmin />} >
                    <Route path="/admin" element={<AdminPanel />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}
