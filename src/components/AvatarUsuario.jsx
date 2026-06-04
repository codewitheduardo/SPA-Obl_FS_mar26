import { useEffect, useState } from "react";

// Construye lista ordenada de URLs candidatas sin duplicados ni vacíos
export const obtenerCandidatosFoto = (comentario, usuarioStore, esPropio) => {
  const u = comentario?.usuario || {};
  const candidatos = [
    u.foto,
    u.fotoUrl,
    comentario?.usuarioFoto,
    comentario?.fotoUsuario,
    // Si es el propio usuario, agrega las fotos del store como último fallback
    ...(esPropio ? [usuarioStore?.foto, usuarioStore?.fotoUrl] : []),
  ];
  return [...new Set(candidatos.filter(Boolean))];
};

// Avatar con fallback automático por índice cuando una URL falla
export default function AvatarUsuario({ candidatos = [], nombre = "", className = "h-10 w-10", ringClass = "ring-2 ring-stone-100" }) {
  const [indice, setIndice] = useState(0);
  const inicial = nombre?.charAt(0)?.toUpperCase() || "U";
  const foto = candidatos[indice];

  // Reinicia el índice si cambian los candidatos (ej. cambio de usuario)
  useEffect(() => { setIndice(0); }, [candidatos.join("|")]);

  if (foto) {
    return (
      <img
        src={foto}
        alt={nombre}
        referrerPolicy="no-referrer"
        className={`shrink-0 rounded-full object-cover ${className} ${ringClass}`}
        onError={() => setIndice((i) => i + 1)}
      />
    );
  }

  return (
    <span className={`flex shrink-0 items-center justify-center rounded-full bg-orange-100 font-bold text-orange-700 ${className}`}>
      {inicial}
    </span>
  );
}
