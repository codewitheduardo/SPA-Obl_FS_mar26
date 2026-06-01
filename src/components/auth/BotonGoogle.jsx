import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import Boton from "../Boton.jsx";

const GOOGLE_SCRIPT_ID = "google-identity-services";

const cargarScriptGoogle = () =>
  new Promise((resolve, reject) => {
    if (window.google?.accounts?.id) {
      resolve();
      return;
    }

    const existente = document.getElementById(GOOGLE_SCRIPT_ID);
    if (existente) {
      existente.addEventListener("load", resolve, { once: true });
      existente.addEventListener("error", reject, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = GOOGLE_SCRIPT_ID;
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });

export default function BotonGoogle({ onCredential, disabled }) {
  const contenedorRef = useRef(null);
  const [listo, setListo] = useState(false);
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!googleClientId) return;

    const iniciarGoogle = async () => {
      try {
        await cargarScriptGoogle();
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: (respuesta) => onCredential?.(respuesta.credential),
        });
        if (contenedorRef.current) {
          contenedorRef.current.innerHTML = "";
          window.google.accounts.id.renderButton(contenedorRef.current, {
            theme: "outline",
            size: "large",
            text: "continue_with",
            shape: "pill",
            width: contenedorRef.current.offsetWidth || 320,
          });
        }
        setListo(true);
      } catch {
        toast.error("No se pudo cargar Google Identity Services");
      }
    };

    iniciarGoogle();
  }, [googleClientId, onCredential]);

  if (!googleClientId) {
    return (
      <Boton type="button" variante="outline" className="w-full" disabled={disabled} onClick={() => toast.info("Configura VITE_GOOGLE_CLIENT_ID para activar Google")}>
        Continuar con Google
      </Boton>
    );
  }

  return (
    <div className={disabled ? "pointer-events-none opacity-60" : ""}>
      <div ref={contenedorRef} className="flex min-h-11 w-full justify-center" />
      {!listo && <p className="mt-2 text-center text-xs font-semibold text-stone-500">Cargando Google...</p>}
    </div>
  );
}
