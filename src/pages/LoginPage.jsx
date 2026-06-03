import { ChefHat } from "lucide-react";
import { Link } from "react-router-dom";
import FormularioLogin from "../components/auth/FormularioLogin.jsx";

export default function Login() {
  return (
    <section className="relative mx-auto grid min-h-[95vh] max-w-5xl items-center gap-10 py-8 lg:grid-cols-[1fr_420px]">
      {/* Fondo decorativo */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-orange-100/50 blur-3xl" />
        <div className="absolute -left-20 bottom-20 h-72 w-72 rounded-full bg-amber-100/40 blur-3xl" />
      </div>

      {/* Lado izquierdo */}
      <div className="relative z-10 min-w-0 text-center lg:text-left">
        <div className="mb-4 inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-100 p-3 lg:justify-start">
          <ChefHat size={24} className="text-orange-700" />
        </div>
        <h1 className="text-4xl font-black leading-tight tracking-tight text-stone-900 sm:text-5xl">
          Bienvenido de<br />vuelta
        </h1>
        <p className="mt-4 text-base leading-7 text-stone-500 sm:text-lg">
          Ingresá para administrar tus recetas, favoritos, comentarios y tu plan.
        </p>
        <div className="mt-8 hidden space-y-3 lg:block">
          {[
            "Gestioná tus recetas propias",
            "Explorá recetas de la comunidad",
            "Guardá favoritos de TheMealDB",
            "Generá ideas con IA",
          ].map((item) => (
            <div key={item} className="flex items-center gap-3 text-sm text-stone-600">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5l2.5 2.5 3.5-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Formulario */}
      <div className="relative z-10 mx-auto w-full max-w-[420px]">
        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-card sm:p-8">
          <div className="mb-6">
            <h2 className="text-xl font-black text-stone-900">Iniciar sesion</h2>
            <p className="mt-1 text-sm text-stone-500">Ingresá tu email y contraseña</p>
          </div>
          <FormularioLogin />
          <p className="mt-5 text-center text-sm text-stone-500">
            ¿No tenés cuenta?{" "}
            <Link className="font-semibold text-orange-600 transition hover:text-orange-700" to="/registro">
              Registrate gratis
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
