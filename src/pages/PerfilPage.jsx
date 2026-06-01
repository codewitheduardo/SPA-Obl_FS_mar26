import { useSelector } from "react-redux";
import TarjetaPerfil from "../components/perfil/TarjetaPerfil.jsx";
import TarjetaPlan from "../components/perfil/TarjetaPlan.jsx";
import EncabezadoPagina from "../components/EncabezadoPagina.jsx";

export default function Perfil() {
  const usuario = useSelector((state) => state.auth.usuario);
  const plan = usuario?.plan || "plus";
  return (
    <div>
      <EncabezadoPagina titulo="Mi perfil" descripcion="Administra tu foto, revisa tus permisos y consulta el estado de tu plan." />
      <div className="grid gap-6 xl:grid-cols-[1fr_24rem]"><TarjetaPerfil usuario={{ ...usuario, plan }} /><TarjetaPlan plan={plan} /></div>
    </div>
  );
}

