import { ChefHat } from "lucide-react";
import { Link } from "react-router-dom";
import Boton from "../components/Boton.jsx";

export default function NoEncontrado() {
  return (
    <main className="grid min-h-screen place-items-center bg-stone-50 px-4">
      <section className="max-w-md text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-orange-100 text-orange-500">
          <ChefHat size={36} />
        </div>
        <p className="text-sm font-bold uppercase tracking-widest text-orange-500">Error 404</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-stone-900">Página no encontrada</h1>
        <p className="mt-3 text-base text-stone-500">La ruta no existe dentro de Cook Book.</p>
        <Link to="/dashboard" className="mt-8 inline-block">
          <Boton className="px-8">Volver al dashboard</Boton>
        </Link>
      </section>
    </main>
  );
}
