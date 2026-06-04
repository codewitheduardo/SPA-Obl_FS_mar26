import { ChefHat } from "lucide-react";

export default function EstadoVacio({ titulo, texto }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-200 bg-white px-6 py-14 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-50">
        <ChefHat size={24} className="text-stone-400" />
      </div>
      <h3 className="text-base font-bold text-stone-700">{titulo}</h3>
      <p className="mt-1.5 max-w-sm text-sm leading-6 text-stone-400">{texto}</p>
    </div>
  );
}
