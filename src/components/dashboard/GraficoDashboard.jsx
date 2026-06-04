import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import Tarjeta from "../Tarjeta.jsx";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Filler, Tooltip, Legend);

const colores = ["#fb923c", "#10b981", "#f59e0b", "#fb7185", "#84cc16", "#38bdf8", "#a78bfa"];

const opcionesBase = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: "#1c1917",
      titleColor: "#fff7ed",
      bodyColor: "#fff7ed",
      padding: 12,
      cornerRadius: 12,
      displayColors: false,
    },
  },
};

export default function GraficoDashboard({ titulo, datos, tipo = "bar" }) {
  const datosVisibles = datos.filter((item) => Number(item.valor) > 0);
  const datosGrafico = datosVisibles.length ? datosVisibles : [{ nombre: "Sin datos", valor: 1 }];
  const total = datosVisibles.reduce((suma, item) => suma + Number(item.valor), 0);
  const maximo = Math.max(...datosGrafico.map((item) => Number(item.valor)), 1);
  const coloresGrafico = datosGrafico.map((_, indice) => colores[indice % colores.length]);

  const datosChartJs = {
    labels: datosGrafico.map((item) => item.nombre),
    datasets: [{
      label: titulo,
      data: datosGrafico.map((item) => item.valor),
      backgroundColor: tipo === "line" ? "rgba(251, 146, 60, 0.16)" : coloresGrafico,
      borderColor: tipo === "line" ? "#fb923c" : "#ffffff",
      borderWidth: tipo === "doughnut" ? 4 : 2,
      borderRadius: tipo === "bar" ? 12 : 0,
      cutout: tipo === "doughnut" ? "68%" : undefined,
      fill: tipo === "line",
      tension: 0.4,
      pointBackgroundColor: "#fb923c",
      pointBorderColor: "#fff7ed",
      pointBorderWidth: 3,
      pointRadius: 4,
    }],
  };

  const opciones = {
    ...opcionesBase,
    scales: tipo === "doughnut" ? undefined : {
      x: { grid: { display: false }, ticks: { color: "#78716c", font: { weight: "700" } } },
      y: { beginAtZero: true, suggestedMax: maximo + 1, grid: { color: "#f1f5f9" }, ticks: { color: "#78716c", precision: 0 } },
    },
  };

  return (
    <Tarjeta className="overflow-hidden">
      <div className="mb-5 flex flex-col justify-between gap-3 border-b border-stone-100 pb-4 sm:flex-row sm:items-start">
        <div>
          <p className="text-xs font-black uppercase tracking-wider text-orange-600">Grafico</p>
          <h3 className="mt-1 text-xl font-black text-stone-900">{titulo}</h3>
          <p className="mt-1 text-sm font-semibold text-stone-500">
            {datosVisibles.length === 0 ? "Todavia no hay datos para mostrar." : `${total} recetas registradas`}
          </p>
        </div>
        {datosVisibles.length > 0 && <span className="rounded-full border border-orange-100 bg-orange-50 px-3 py-1 text-xs font-black text-orange-700">{datosVisibles.length} grupos</span>}
      </div>

      {tipo === "doughnut" ? (
        <div className="grid gap-5 md:grid-cols-[minmax(190px,240px)_1fr] md:items-center">
          <div className="relative mx-auto h-56 w-56 sm:h-64 sm:w-64">
            <Doughnut data={datosChartJs} options={opciones} />
            <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
              <div>
                <p className="text-3xl font-black text-stone-900">{total}</p>
                <p className="text-xs font-bold uppercase text-stone-400">recetas</p>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            {datosVisibles.length === 0 && <p className="rounded-2xl bg-stone-50 p-4 text-sm font-semibold text-stone-500">Cuando tengas recetas con categoria, el grafico se completa automaticamente.</p>}
            {datosGrafico.map((item, indice) => {
              const porcentaje = total ? Math.round((item.valor / total) * 100) : 0;
              return (
                <div key={item.nombre} className="rounded-2xl border border-stone-100 bg-stone-50 p-3">
                  <div className="flex items-center justify-between gap-3 text-sm font-bold text-stone-700">
                    <span className="flex min-w-0 items-center gap-2">
                      <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: colores[indice % colores.length] }} />
                      <span className="truncate">{item.nombre}</span>
                    </span>
                    <span>{item.valor} ({porcentaje}%)</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-white">
                    <div className="h-full rounded-full" style={{ width: `${porcentaje}%`, backgroundColor: colores[indice % colores.length] }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div>
          <div className="rounded-2xl border border-stone-100 bg-stone-50/60 p-3">
            <div className="h-72 sm:h-80">
            {tipo === "line" && <Line data={datosChartJs} options={opciones} />}
            {tipo === "bar" && <Bar data={datosChartJs} options={opciones} />}
            </div>
          </div>
          {datosVisibles.length === 0 && <p className="mt-3 rounded-2xl bg-stone-50 p-4 text-sm font-semibold text-stone-500">La actividad reciente se va a completar cuando agregues recetas.</p>}
        </div>
      )}
    </Tarjeta>
  );
}
