import { ChefHat } from "lucide-react";
import { Link } from "react-router-dom";
import Boton from "../components/Boton.jsx";

export default function Inicio() {
  return (
    <section className="mx-auto grid min-h-[90vh] max-w-6xl items-center gap-8 py-4 lg:grid-cols-[1fr_460px] lg:gap-10">
      <div className="min-w-0">
        <p className="mb-4 inline-flex rounded-full bg-orange-100 px-4 py-2 text-sm font-bold text-orange-700">Cook Book - Obligatorio 2 Fullstack</p>
        <h1 className="text-4xl font-black leading-tight text-stone-950 sm:text-5xl md:text-7xl">Cook Book</h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-stone-700 sm:text-xl sm:leading-8">Una aplicacion de recetas moderna para gestionar recetas propias, explorar TheMealDB, guardar favoritos, comentar y crear ideas con IA conectada al backend real.</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link to="/login"><Boton className="w-full sm:w-auto"><ChefHat size={18} /> Entrar</Boton></Link>
          <Link to="/registro"><Boton variante="outline" className="w-full sm:w-auto">Crear cuenta</Boton></Link>
        </div>
      </div>
      <img className="h-72 w-full rounded-2xl object-cover shadow-suave sm:h-96 lg:h-[520px]" src="https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=900&q=80" alt="Mesa con ingredientes frescos" />
    </section>
  );
}
