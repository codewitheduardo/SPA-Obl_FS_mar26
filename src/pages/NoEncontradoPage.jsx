import { Link } from "react-router-dom";
import Boton from "../components/ui/Boton.jsx";

export default function NoEncontrado() {
  return (
    <main className="grid min-h-screen place-items-center px-4">
      <section className="max-w-xl rounded-2xl border border-stone-200 bg-white p-8 text-center shadow-suave">
        <p className="text-sm font-bold uppercase tracking-wider text-orange-600">404</p>
        <h1 className="mt-2 text-4xl font-black text-stone-900">Pagina no encontrada</h1>
        <p className="mt-3 text-stone-600">La ruta no existe dentro de Cook Book.</p>
        <Link to="/dashboard"><Boton className="mt-6">Volver al dashboard</Boton></Link>
      </section>
    </main>
  );
}

