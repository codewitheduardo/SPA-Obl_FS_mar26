import { ChefHat, Sparkles, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import Boton from "../components/Boton.jsx";

export default function Inicio() {
  return (
    <section className="relative mx-auto flex min-h-[95vh] max-w-6xl flex-col items-center justify-center gap-10 py-12 text-center lg:flex-row lg:text-left">
      {/* Fondo decorativo */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-orange-100/60 blur-3xl" />
        <div className="absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-amber-100/50 blur-3xl" />
      </div>

      {/* Texto */}
      <div className="relative z-10 flex-1">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700">
          <Sparkles size={14} />
          Cook Book — Obligatorio Fullstack
        </div>
        <h1 className="text-5xl font-black leading-[1.08] tracking-tight text-stone-950 sm:text-6xl md:text-7xl lg:text-[5rem]">
          Tu recetario<br />
          <span className="text-orange-500">digital</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-8 text-stone-600 lg:mx-0">
          Gestioná tus recetas, explorá TheMealDB, guardá favoritos, comentá y
          creá ideas con IA — todo conectado en una misma plataforma.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:justify-start">
          <Link to="/login">
            <Boton className="w-full gap-2 px-7 py-3 text-base sm:w-auto">
              <ChefHat size={18} />
              Entrar a la app
            </Boton>
          </Link>
          <Link to="/registro">
            <Boton variante="outline" className="w-full px-7 py-3 text-base sm:w-auto">
              Crear cuenta gratis
            </Boton>
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-10 flex flex-wrap justify-center gap-6 lg:justify-start">
          {[
            { icon: BookOpen, label: "Recetas de comunidad", value: "Ilimitadas" },
            { icon: ChefHat, label: "Roles disponibles", value: "Chef & Lector" },
            { icon: Sparkles, label: "IA integrada", value: "Incluida" },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                <Icon size={18} />
              </span>
              <div className="text-left">
                <p className="text-xs text-stone-500">{label}</p>
                <p className="text-sm font-bold text-stone-900">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Imagen */}
      <div className="relative z-10 w-full max-w-md shrink-0 lg:max-w-[480px]">
        <div className="relative overflow-hidden rounded-3xl shadow-[0_24px_60px_-10px_rgba(0,0,0,0.18)]">
          <img
            className="h-72 w-full object-cover sm:h-96 lg:h-[540px]"
            src="https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=900&q=80"
            alt="Mesa con ingredientes frescos"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/30 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <div className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-md">
              <p className="text-xs font-semibold text-white/80">Receta destacada</p>
              <p className="text-sm font-bold text-white">Pasta al pesto con albahaca</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
