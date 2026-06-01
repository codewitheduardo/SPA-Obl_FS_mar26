import { Provider } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import LayoutDashboard from "./components/LayoutDashboard.jsx";
import LayoutPublico from "./components/LayoutPublico.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import CategoriasPage from "./pages/CategoriasPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import DetalleRecetaPage from "./pages/DetalleRecetaPage.jsx";
import DetalleRecetaExternaPage from "./pages/DetalleRecetaExternaPage.jsx";
import FavoritosPage from "./pages/FavoritosPage.jsx";
import IAPage from "./pages/IAPage.jsx";
import InicioPage from "./pages/InicioPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import MisRecetasPage from "./pages/MisRecetasPage.jsx";
import NoEncontradoPage from "./pages/NoEncontradoPage.jsx";
import PerfilPage from "./pages/PerfilPage.jsx";
import RecetasPage from "./pages/RecetasPage.jsx";
import RecetasExternasPage from "./pages/RecetasExternasPage.jsx";
import RegistroPage from "./pages/RegistroPage.jsx";
import { store } from "./store/store.js";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route element={<LayoutPublico />}>
            <Route path="/" element={<InicioPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/registro" element={<RegistroPage />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route element={<LayoutDashboard />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/recetas" element={<RecetasPage />} />
              <Route path="/mis-recetas" element={<MisRecetasPage />} />
              <Route path="/recetas/:id" element={<DetalleRecetaPage />} />
              <Route path="/categorias" element={<CategoriasPage />} />
              <Route path="/recetas-externas" element={<RecetasExternasPage />} />
              <Route path="/recetas-externas/:id" element={<DetalleRecetaExternaPage />} />
              <Route path="/favoritos" element={<FavoritosPage />} />
              <Route path="/perfil" element={<PerfilPage />} />
              <Route path="/ia" element={<IAPage />} />
            </Route>
          </Route>

          <Route path="/inicio" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NoEncontradoPage />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer
        position="bottom-left"
        autoClose={1800}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        theme="colored"
      />
    </Provider>
  );
}

