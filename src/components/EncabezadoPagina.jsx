export default function EncabezadoPagina({ titulo, descripcion, accion }) {
  return (
    <div className="mb-8 flex min-w-0 flex-col justify-between gap-4 md:flex-row md:items-end">
      <div className="min-w-0">
        <span className="inline-flex items-center rounded-full bg-orange-50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-orange-600 ring-1 ring-orange-100/80">
          Cook Book
        </span>
        <h1 className="mt-2.5 text-2xl font-black leading-tight tracking-tight text-stone-900 sm:text-3xl">
          {titulo}
        </h1>
        {descripcion && (
          <p className="mt-1.5 max-w-2xl text-sm leading-6 text-stone-500">{descripcion}</p>
        )}
      </div>
      {accion && <div className="w-full shrink-0 md:w-auto">{accion}</div>}
    </div>
  );
}
