import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";

// Componente arrow que actua como layout/proteccion de rutas
const ProtectedRoute = () => {
    const isAuth = useSelector((state) => state.auth.autenticado && state.auth.token);

    // Si no esta autenticado -> redirige a login
    if (!isAuth) return <Navigate to="/" replace />;

    // Si esta autenticado -> renderiza rutas hijas
    return <Outlet />;
};

export default ProtectedRoute;

