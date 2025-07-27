import { Navigate, Outlet, useLocation } from "react-router-dom";

export const MainAdmin = () => {
  const token = localStorage.getItem("token");
  const location = useLocation();

  // Permitir acceso libre al login
  if (location.pathname === "/admin/login") {
    return <Outlet />;
  }

  // Redirigir si no hay token
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  // Renderizar ruta protegida
  return <Outlet />;
};
