import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainAdmin } from "./layouts/MainLayout/MainAdmin";
import { MainLayout } from "./layouts";
import {
    LineamientosPage, FilosofiaPage, InicioPage, SugerenciasMaterial,
    Renovacion, AyudaPage, ServiciosBiblioteca, Catalogo, AdminPanel, Login,
    CategoriaPage
} from "./pages";

export const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<MainLayout />} >
                    <Route index element={<InicioPage />} />
                    <Route path="/filosofia" element={<FilosofiaPage />} />
                    <Route path="/lineamientos" element={<LineamientosPage />} />
                    <Route path="/ayuda" element={<AyudaPage />} />
                    <Route path="/catalogo" element={< Catalogo />} />
                    <Route path="/servicios" element={<ServiciosBiblioteca />} />
                    <Route path="/renovacion" element={<Renovacion />} />
                    <Route path="/solicitud-compra" element={<SugerenciasMaterial />} />
                    <Route path="/recursos-electronicos/:id_categoria" element={<CategoriaPage />} />
                </Route>
                <Route element={<MainAdmin />} >
                    <Route path="/admin/login" element={<Login/>} />
                    <Route path="/admin/dash" element={<AdminPanel />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}
