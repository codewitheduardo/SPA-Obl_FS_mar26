import { Link } from "react-router-dom";
import FormularioLogin from "../components/auth/FormularioLogin.jsx";

export default function Login() {
  return (
    <section className="mx-auto grid min-h-[90vh] max-w-5xl items-center gap-8 py-4 lg:grid-cols-[1fr_420px]">
      <div className="min-w-0">
        <h1 className="text-4xl font-black text-stone-900 sm:text-5xl">Volver a la cocina</h1>
        <p className="mt-4 text-base text-stone-600 sm:text-lg">Ingresa para administrar recetas, favoritos, comentarios y tu plan.</p>
      </div>
      <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-suave sm:p-6">
        <FormularioLogin />
        <p className="mt-4 text-center text-sm text-stone-500">No tenes cuenta? <Link className="font-bold text-orange-700" to="/registro">Registrate</Link></p>
      </div>
    </section>
  );
}
