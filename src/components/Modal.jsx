import { X } from "lucide-react";

export default function Modal({ abierto, titulo, children, alCerrar, tamano = "grande" }) {
  if (!abierto) return null;
  const tamanos = {
    compacto: "max-w-md",
    grande: "max-w-5xl",
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-stone-950/60 p-3 backdrop-blur-sm sm:p-5">
      <div
        className={`flex max-h-[92vh] w-full ${tamanos[tamano]} flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-modal`}
      >
        <div className="flex items-center justify-between gap-4 border-b border-stone-100 px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-widest text-orange-500">Cook Book</p>
            <h2 className="truncate text-xl font-black text-stone-900">{titulo}</h2>
          </div>
          <button
            type="button"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-500 transition hover:border-stone-300 hover:bg-stone-50 hover:text-stone-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300"
            onClick={alCerrar}
            aria-label="Cerrar modal"
          >
            <X size={16} />
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-5 sm:px-6">{children}</div>
      </div>
    </div>
  );
}
