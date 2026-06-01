import { ChefHat } from "lucide-react";

export default function EstadoVacio({ titulo, texto }) {
  return (
    <div className="rounded-2xl border border-dashed border-stone-200 bg-white p-8 text-center shadow-sm">
      <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-orange-50 text-orange-600 shadow-sm">
        <ChefHat size={24} />
      </div>
      <h3 className="text-xl font-bold text-stone-900">{titulo}</h3>
      <p className="mt-2 text-stone-600">{texto}</p>
    </div>
  );
}

