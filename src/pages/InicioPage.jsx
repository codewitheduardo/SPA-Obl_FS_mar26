import { ChefHat, Sparkles, BookOpen, Clock, Users } from "lucide-react";
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
        <div className="relative overflow-hidden rounded-3xl shadow-[0_32px_80px_-12px_rgba(0,0,0,0.24),0_8px_24px_-4px_rgba(0,0,0,0.12)]">
          <img
            className="h-72 w-full object-cover sm:h-96 lg:h-[540px]"
            src="https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=900&q=80"
            alt="Mesa con ingredientes frescos"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-stone-950/20 to-transparent" />

          {/* Badge superior */}
          <div className="absolute left-4 top-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-500/90 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-sm">
              <Sparkles size={11} />
              Receta destacada
            </span>
          </div>

          {/* Card inferior */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="rounded-2xl border border-white/10 bg-stone-950/50 p-4 backdrop-blur-md">
              <p className="text-base font-black leading-tight text-white">
                Farfalle al pesto con tomates cherry
              </p>
              <p className="mt-1 text-xs leading-5 text-white/60">
                Moñitos con pesto de albahaca, tomates cherry frescos y hojas verdes.
              </p>
              <div className="mt-3 flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-[11px] font-semibold text-white/70">
                  <Clock size={12} className="text-orange-400" />
                  15 min
                </span>
                <span className="flex items-center gap-1.5 text-[11px] font-semibold text-white/70">
                  <Users size={12} className="text-orange-400" />
                  2 porciones
                </span>
                <span className="flex items-center gap-1.5 text-[11px] font-semibold text-white/70">
                  <ChefHat size={12} className="text-orange-400" />
                  Fácil
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
