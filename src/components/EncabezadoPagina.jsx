export default function EncabezadoPagina({ titulo, descripcion, accion }) {
  return (
    <div className="mb-6 flex min-w-0 flex-col justify-between gap-4 md:flex-row md:items-end">
      <div className="min-w-0">
        <p className="inline-flex rounded-full bg-orange-100/80 px-3 py-1 text-xs font-black uppercase tracking-wider text-orange-700">Cook Book</p>
        <h1 className="mt-2 text-2xl font-black leading-tight text-stone-900 sm:text-3xl md:text-4xl">{titulo}</h1>
        {descripcion && <p className="mt-2 max-w-2xl text-stone-600">{descripcion}</p>}
      </div>
      {accion && <div className="w-full shrink-0 md:w-auto">{accion}</div>}
    </div>
  );
}

