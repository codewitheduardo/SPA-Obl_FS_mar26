import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import api from "../api/api.js";
import FormularioIA from "../components/ia/FormularioIA.jsx";
import ResultadoIA from "../components/ia/ResultadoIA.jsx";
import EncabezadoPagina from "../components/EncabezadoPagina.jsx";
import { agregarReceta } from "../features/recetasSlice.js";

// ─── Normalización ────────────────────────────────────────────────────────────

const normalizarDificultad = (valor = "") => {
  const t = String(valor).toLowerCase().trim();
  if (t.includes("dific") || t === "hard" || t === "alta") return "dificil";
  if (t.includes("med") || t === "medium" || t === "intermedia") return "media";
  return "facil";
};

const extraerNumero = (valor, fallback = 0) =>
  Number(String(valor ?? "").match(/\d+/)?.[0] ?? fallback) || fallback;

// ─── Extracción del texto crudo de la respuesta ──────────────────────────────
const extraerTextoCrudo = (respuestaIA) => {
  if (typeof respuestaIA === "string") return respuestaIA;
  // Recorre los campos más comunes que usan los backends de IA
  const campos = [
    "texto", "respuesta", "message", "resultado", "contenido",
    "descripcion", "text", "response", "output", "completion",
    "choices", "content",
  ];
  for (const campo of campos) {
    const val = respuestaIA?.[campo];
    if (!val) continue;
    if (typeof val === "string" && val.trim()) return val;
    // OpenAI-style: choices[0].message.content
    if (Array.isArray(val) && val[0]?.message?.content) return val[0].message.content;
    if (Array.isArray(val) && typeof val[0]?.text === "string") return val[0].text;
  }
  // Último recurso: serializar todo
  try { return JSON.stringify(respuestaIA); } catch { return ""; }
};

// ─── Parser de respuesta IA ───────────────────────────────────────────────────
const parsearRespuestaIA = (respuestaIA, datosFormulario) => {
  // Log en desarrollo para diagnóstico
  if (import.meta.env.DEV) {
    console.group("[IA] Respuesta cruda del backend:");
    console.log(respuestaIA);
    console.groupEnd();
  }

  let datos = null;

  // Estrategia 1: objeto directo con campo titulo
  if (respuestaIA && typeof respuestaIA === "object" && respuestaIA.titulo) {
    datos = respuestaIA;
  }

  // Estrategia 2: extraer texto crudo y buscar JSON
  if (!datos) {
    const textoCrudo = extraerTextoCrudo(respuestaIA);

    if (import.meta.env.DEV) {
      console.log("[IA] Texto extraído:", textoCrudo?.slice(0, 400));
    }

    // Detectar fallback del backend (IA no disponible)
    if (textoCrudo?.toLowerCase().includes("no se pudo generar")) {
      return null;
    }

    if (textoCrudo) {
      // Limpiar bloques markdown ```json ... ``` que algunos modelos agregan
      const textoLimpio = textoCrudo
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```\s*$/i, "")
        .trim();

      // 2a: JSON puro
      try { datos = JSON.parse(textoLimpio); } catch { /* continuar */ }

      // 2b: buscar el bloque JSON más grande (greedy — captura objetos anidados)
      if (!datos?.titulo) {
        const match = textoLimpio.match(/\{[\s\S]*\}/);
        if (match) {
          try {
            const parsed = JSON.parse(match[0]);
            if (parsed?.titulo) datos = parsed;
          } catch { /* continuar */ }
        }
      }

      // 2c: fallback etiquetas de texto (Titulo:, Ingredientes:, etc.)
      if (!datos?.titulo) {
        const limpiar = (s = "") => String(s).replace(/[#*_`]/g, "").trim();
        const seccion = (etiqueta) => {
          const m = textoLimpio.match(new RegExp(`${etiqueta}:[ \\t]*([\\s\\S]*?)(?=\\n(?:Titulo|Descripcion|Tiempo|Porciones|Dificultad|Ingredientes|Pasos):|$)`, "i"));
          return limpiar(m?.[1] || "");
        };
        const lista = (etiqueta) =>
          seccion(etiqueta)
            .split("\n")
            .map(limpiar)
            .map((l) => l.replace(/^[-•\d.]+\s*/, ""))
            .filter((l) => l.length > 2);

        const tituloFallback = seccion("Titulo");
        if (tituloFallback) {
          datos = {
            titulo: tituloFallback,
            descripcion: seccion("Descripcion"),
            tiempoPreparacion: seccion("Tiempo"),
            porciones: seccion("Porciones"),
            dificultad: seccion("Dificultad"),
            ingredientes: lista("Ingredientes"),
            pasos: lista("Pasos"),
          };
        }
      }
    }
  }

  if (!datos?.titulo) {
    if (import.meta.env.DEV) console.warn("[IA] No se pudo extraer datos estructurados.");
    return null;
  }

  const ingredientes = Array.isArray(datos.ingredientes)
    ? datos.ingredientes.map(String).filter((i) => i.trim().length > 0)
    : [];

  const pasos = Array.isArray(datos.pasos)
    ? datos.pasos.map(String).filter((p) => p.trim().length > 0)
    : [];

  if (ingredientes.length === 0 || pasos.length === 0) {
    if (import.meta.env.DEV) console.warn("[IA] Ingredientes o pasos vacíos.");
    return null;
  }

  return {
    titulo: String(datos.titulo).trim(),
    descripcion: String(datos.descripcion ?? "").trim(),
    tiempoPreparacion: extraerNumero(
      datos.tiempoPreparacion ?? datos.tiempoEstimado,
      datosFormulario?.tiempoMaximo ?? 30,
    ),
    porciones: extraerNumero(datos.porciones, datosFormulario?.porciones ?? 2),
    dificultad: normalizarDificultad(datos.dificultad ?? datosFormulario?.dificultad),
    ingredientes,
    pasos,
  };
};

// ─── Construcción del prompt ──────────────────────────────────────────────────
// Compacto para respetar el límite de 1000 caracteres del backend.
const armarPrompt = (datos) => {
  const porciones = Number(datos.porciones) || 2;
  const tiempoMax = Number(datos.tiempoMaximo) || 30;
  const tipo = datos.tipoComida || "libre";
  const restricciones = datos.preferencias?.trim() || "ninguna";

  const ingredientesTruncados = datos.ingredientes.slice(0, 400);
  const restriccionesTruncadas = restricciones.slice(0, 100);

  return `Generá una receta con estos datos:
Ingredientes disponibles: ${ingredientesTruncados}
Tipo de comida: ${tipo}
Tiempo máximo: ${tiempoMax} minutos
Dificultad: ${datos.dificultad}
Porciones: ${porciones}
Restricciones: ${restriccionesTruncadas}`.trim();
};

// ─── Componente principal ─────────────────────────────────────────────────────

export default function IA() {
  const dispatch = useDispatch();
  const categorias = useSelector((state) => state.categorias.items);
  const usuario = useSelector((state) => state.auth.usuario);
  const [resultado, setResultado] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [ultimoFormulario, setUltimoFormulario] = useState(null);

  const generarRecetaConIA = async (datos) => {
    setCargando(true);
    setResultado(null);
    setUltimoFormulario(datos);

    try {
      const respuesta = await api.post("/ia/generar", { prompt: armarPrompt(datos) });
      const cuerpoRespuesta = respuesta.data?.data || respuesta.data;
      const resultadoGenerado = parsearRespuestaIA(cuerpoRespuesta, datos);

      if (!resultadoGenerado) {
        toast.error("La IA no devolvió una respuesta válida. Intentá regenerar.");
        return;
      }

      setResultado(resultadoGenerado);
      toast.success("Receta generada correctamente");
    } catch (error) {
      toast.error(error.message || "No se pudo conectar con la IA");
    } finally {
      setCargando(false);
    }
  };

  const guardarResultadoComoBorrador = async (categoriaId) => {
    if (usuario?.rol !== "chef") {
      toast.info("Tu rol lector no permite guardar recetas nuevas");
      return;
    }
    if (!resultado) return;

    const idCategoria = categoriaId || categorias[0]?.id || categorias[0]?._id;
    if (!idCategoria) {
      toast.error("Necesitás tener al menos una categoría cargada para guardar");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("titulo", resultado.titulo);
      formData.append("descripcion", resultado.descripcion || resultado.titulo);
      resultado.ingredientes.forEach((i) => formData.append("ingredientes", i));
      resultado.pasos.forEach((p) => formData.append("pasos", p));
      formData.append("tiempoPreparacion", resultado.tiempoPreparacion);
      formData.append("porciones", resultado.porciones);
      formData.append("dificultad", resultado.dificultad);
      formData.append("categoriaId", idCategoria);
      formData.append("estado", "borrador");

      const respuesta = await api.post("/recetas", formData);
      const cuerpoRespuesta = respuesta.data?.data || respuesta.data;
      dispatch(agregarReceta({ ...(cuerpoRespuesta?.receta || cuerpoRespuesta), estado: "borrador" }));
      toast.success("Receta guardada como borrador en Mis recetas");
    } catch (error) {
      toast.error(error.message || "No se pudo guardar la receta");
    }
  };

  return (
    <div>
      <EncabezadoPagina
        titulo="Creá una receta con lo que tenés"
        descripcion={
          usuario?.rol === "chef"
            ? "Completá los campos, generá la receta con IA y guardala como borrador para terminarla en Mis recetas."
            : "Como lector podés generar ideas de recetas con IA, pero guardar queda reservado para usuarios chef."
        }
      />

      {usuario?.rol !== "chef" && (
        <div className="mb-5 flex items-start gap-3 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3">
          <span className="mt-0.5 text-amber-500">⚠</span>
          <p className="text-sm font-medium text-amber-700">
            Modo lector — podés generar y ver recetas con IA, pero no guardarlas.
          </p>
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1fr_1.15fr]">
        <FormularioIA onGenerar={generarRecetaConIA} cargando={cargando} />
        <ResultadoIA
          resultado={resultado}
          categorias={categorias}
          onUsar={guardarResultadoComoBorrador}
          onRegenerar={() => ultimoFormulario && generarRecetaConIA(ultimoFormulario)}
          puedeGuardar={usuario?.rol === "chef"}
        />
      </div>
    </div>
  );
}
