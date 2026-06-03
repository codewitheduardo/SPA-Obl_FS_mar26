import { ChefHat } from "lucide-react";

export default function EstadoVacio({ titulo, texto }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-200 bg-stone-50/60 px-6 py-14 text-center">
      <div className="mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-white shadow-card ring-1 ring-stone-100">
        <ChefHat size={28} className="text-orange-400" />
      </div>
      <h3 className="text-lg font-bold text-stone-800">{titulo}</h3>
      <p className="mt-2 max-w-sm text-sm leading-6 text-stone-500">{texto}</p>
    </div>
  );
}
