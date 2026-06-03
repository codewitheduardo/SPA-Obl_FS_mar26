import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import api from "../api/api.js";
import FormularioIA from "../components/ia/FormularioIA.jsx";
import ResultadoIA from "../components/ia/ResultadoIA.jsx";
import EncabezadoPagina from "../components/EncabezadoPagina.jsx";
import { agregarReceta } from "../features/recetasSlice.js";

const limpiarTextoIA = (texto = "") =>
  String(texto)
    .replace(/[#*_`]/g, "")
    .replace(/\s---\s/g, "\n\n")
    .replace(/\s-\s/g, "\n- ")
    .replace(/\s(?=\d+\.\s)/g, "\n")
    .trim();

const obtenerSeccion = (texto, etiqueta) => {
  const patron = new RegExp(`${etiqueta}:\\s*([\\s\\S]*?)(?=\\n(?:Titulo|Descripcion|Tiempo|Porciones|Dificultad|Ingredientes|Pasos):|$)`, "i");
  return limpiarTextoIA(texto.match(patron)?.[1] || "");
};

const obtenerLista = (texto, etiqueta) =>
  obtenerSeccion(texto, etiqueta)
    .split("\n")
    .map(limpiarTextoIA)
    .filter((item) => item.length > 2);

const armarResultadoIA = (respuestaIA, prompt) => {
  const textoRespuesta = typeof respuestaIA === "string"
    ? respuestaIA
    : respuestaIA?.texto || respuestaIA?.respuesta || respuestaIA?.message || respuestaIA?.resultado || respuestaIA?.contenido || respuestaIA?.descripcion || "";
  const contenido = limpiarTextoIA(textoRespuesta);
  if (!contenido || contenido.toLowerCase().includes("no se pudo generar")) return null;

  return {
    titulo: respuestaIA?.titulo || obtenerSeccion(contenido, "Titulo") || "Receta generada por IA",
    descripcion: respuestaIA?.descripcion || obtenerSeccion(contenido, "Descripcion") || `Idea generada desde: ${prompt}`,
    tiempoEstimado: respuestaIA?.tiempoEstimado || respuestaIA?.tiempoPreparacion || obtenerSeccion(contenido, "Tiempo"),
    porciones: respuestaIA?.porciones || obtenerSeccion(contenido, "Porciones"),
    dificultad: respuestaIA?.dificultad || obtenerSeccion(contenido, "Dificultad"),
    ingredientes: Array.isArray(respuestaIA?.ingredientes) && respuestaIA.ingredientes.length ? respuestaIA.ingredientes : obtenerLista(contenido, "Ingredientes"),
    pasos: Array.isArray(respuestaIA?.pasos) && respuestaIA.pasos.length ? respuestaIA.pasos : obtenerLista(contenido, "Pasos"),
    contenido,
  };
};

const armarPrompt = (datos) => `
Actua como asistente de cocina para una app llamada Cook Book.

Objetivo:
Generar UNA receta posible usando principalmente estos ingredientes: ${datos.ingredientes}.

Condiciones:
- Idioma: espanol.
- Tipo de comida: ${datos.tipoComida || "libre"}.
- Tiempo maximo: ${datos.tiempoMaximo || 30} minutos.
- Dificultad requerida: ${datos.dificultad}.
- Preferencias o restricciones: ${datos.preferencias || "ninguna"}.

Reglas estrictas:
- No uses Markdown.
- No uses tablas.
- No uses emojis.
- No incluyas informacion nutricional.
- No incluyas consejos extra.
- No agregues introducciones como "claro" o "aqui tienes".
- No expliques el formato.
- Si falta algun ingrediente comun, podes mencionarlo como opcional.
- La receta debe ser corta, practica y completa.

Responde exactamente con estas etiquetas y en este orden:
Titulo:
Descripcion:
Tiempo:
Porciones:
Dificultad:
Ingredientes:
- ingrediente 1
- ingrediente 2
- ingrediente 3
Pasos:
1. paso 1
2. paso 2
3. paso 3
4. paso 4
5. paso 5
`.trim();

const normalizarDificultad = (valor = "") => {
  const texto = String(valor).toLowerCase();
  if (texto.includes("dific")) return "dificil";
  if (texto.includes("media")) return "media";
  return "facil";
};

export default function IA() {
  const dispatch = useDispatch();
  const categorias = useSelector((state) => state.categorias.items);
  const usuario = useSelector((state) => state.auth.usuario);
  const [resultado, setResultado] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [ultimoFormulario, setUltimoFormulario] = useState(null);

  const generarRecetaConIA = async (datos) => {
    setCargando(true);
    setUltimoFormulario(datos);
    const prompt = armarPrompt(datos);

    try {
      const respuesta = await api.post("/ia/generar", { prompt });
      const cuerpoRespuesta = respuesta.data?.data || respuesta.data;
      const resultadoGenerado = armarResultadoIA(cuerpoRespuesta, prompt);

      if (!resultadoGenerado) {
        setResultado(null);
        toast.error("La IA no devolvio una receta valida. Proba regenerar.");
        return;
      }

      setResultado(resultadoGenerado);
      toast.success("Receta generada");
    } catch (error) {
      setResultado(null);
      toast.error(error.message || "No se pudo generar la receta");
    } finally {
      setCargando(false);
    }
  };

  const guardarResultadoComoBorrador = async () => {
    if (usuario?.rol !== "chef") {
      toast.info("Tu rol lector no permite guardar recetas nuevas");
      return;
    }
    if (!resultado) return;
    if (!categorias[0]?.id && !categorias[0]?._id) {
      toast.error("Necesitas tener una categoria cargada para guardar la receta");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("titulo", resultado.titulo);
      formData.append("descripcion", resultado.descripcion || resultado.contenido);
      (resultado.ingredientes.length ? resultado.ingredientes : ["Revisar receta generada por IA"]).forEach((item) => formData.append("ingredientes", item));
      (resultado.pasos.length ? resultado.pasos : [resultado.contenido]).forEach((item) => formData.append("pasos", item));
      formData.append("tiempoPreparacion", Number(String(resultado.tiempoEstimado).match(/\d+/)?.[0] || 30));
      formData.append("porciones", Number(String(resultado.porciones).match(/\d+/)?.[0] || 1));
      formData.append("dificultad", normalizarDificultad(resultado.dificultad));
      formData.append("categoriaId", categorias[0]?.id || categorias[0]?._id);
      formData.append("estado", "borrador");

      const respuesta = await api.post("/recetas", formData);
      const cuerpoRespuesta = respuesta.data?.data || respuesta.data;
      dispatch(agregarReceta({ ...(cuerpoRespuesta?.receta || cuerpoRespuesta), estado: "borrador" }));
      toast.success("Receta agregada como borrador");
    } catch (error) {
      toast.error(error.message || "No se pudo guardar la receta");
    }
  };

  return (
    <div>
      <EncabezadoPagina
        titulo="Creá una receta con lo que tenés"
        descripcion={usuario?.rol === "chef"
          ? "Generá una idea de cocina y guardala como borrador para terminarla desde Mis recetas."
          : "Como lector podés generar ideas, pero guardar recetas queda reservado para usuarios chef."}
      />

      {usuario?.rol !== "chef" && (
        <p className="mb-5 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">
          Modo lector: podés probar la IA y leer el resultado, pero no guardar una nueva receta.
        </p>
      )}

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <FormularioIA onGenerar={generarRecetaConIA} cargando={cargando} />
        <ResultadoIA
          resultado={resultado}
          onUsar={guardarResultadoComoBorrador}
          onRegenerar={() => ultimoFormulario && generarRecetaConIA(ultimoFormulario)}
          puedeGuardar={usuario?.rol === "chef"}
        />
      </div>
    </div>
  );
}
