import { X } from "lucide-react";
import Boton from "./Boton.jsx";

export default function Modal({ abierto, titulo, children, alCerrar, tamano = "grande" }) {
  if (!abierto) return null;
  const tamanos = {
    compacto: "max-w-md",
    grande: "max-w-5xl",
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-stone-950/50 p-3 sm:p-5">
      <div className={`flex max-h-[92vh] w-full ${tamanos[tamano]} flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-suave`}>
        <div className="flex items-start justify-between gap-3 border-b border-stone-100 bg-white px-5 py-4 sm:px-6">
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-orange-600">Cook Book</p>
            <h2 className="mt-1 text-2xl font-black text-stone-900">{titulo}</h2>
          </div>
          <Boton variante="fantasma" className="shrink-0 px-3" onClick={alCerrar} aria-label="Cerrar modal">
            <X size={18} />
          </Boton>
        </div>
        <div className="overflow-y-auto px-5 py-5 sm:px-6">
          {children}
        </div>
      </div>
    </div>
  );
}

