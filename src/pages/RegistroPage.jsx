import { Link } from "react-router-dom";
import FormularioRegistro from "../components/auth/FormularioRegistro.jsx";

export default function Registro() {
  return (
    <section className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-5xl items-center gap-8 py-4 lg:grid-cols-[minmax(0,1fr)_minmax(320px,460px)]">
      <div className="min-w-0 text-center lg:text-left">
        <h1 className="text-4xl font-black text-stone-900 sm:text-5xl">Crea tu recetario</h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-stone-600 sm:text-lg lg:mx-0">Registro local con plan inicial plus y rol chef o lector.</p>
      </div>
      <div className="mx-auto w-full max-w-[460px] rounded-2xl border border-stone-200 bg-white p-4 shadow-suave sm:p-6">
        <FormularioRegistro />
        <p className="mt-4 text-center text-sm text-stone-500">Ya tenes cuenta? <Link className="font-bold text-orange-700" to="/login">Inicia sesion</Link></p>
      </div>
    </section>
  );
}
