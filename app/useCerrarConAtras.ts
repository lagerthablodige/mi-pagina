"use client";

import { useEffect, useRef } from "react";

// Capa que se cierra con el botón «Atrás» del celular (menú, visor de fotos).
// Al abrirse agrega una entrada al historial; «Atrás» la saca y cierra la capa sin salir de la página.
// Si la capa se cierra de otra forma (X, Escape), se quita esa entrada para no dejar sobrantes.
// - Depende solo de `abierto`: `cerrar` se lee desde una ref, así un `cerrar` que cambia (el visor guarda la última
//   foto) no vuelve a empujar ni a sacar entradas.
// - El history.back() del cierre espera un tick y se salta si la capa se volvió a abrir: así el doble montaje de
//   StrictMode (next dev) no cierra el menú apenas se abre.
// Devuelve una ref: si quien la usa ya reemplazó la entrada (por ejemplo, al saltar a una sección), pone
// `empujado.current = false` y el cierre no llama a history.back().
// Probarlo con next build && next start: en desarrollo StrictMode corre los efectos dos veces.
export function useCerrarConAtras(abierto: boolean, cerrar: () => void) {
  const cerrarRef = useRef(cerrar);
  useEffect(() => {
    cerrarRef.current = cerrar;
  });
  const empujado = useRef(false);
  const vuelta = useRef(0);

  useEffect(() => {
    if (!abierto) return;
    // Se lee el contador vivo a propósito (no una copia): así se sabe si la capa se volvió a abrir.
    const contador = vuelta;
    const mia = ++contador.current;
    if (!empujado.current) {
      history.pushState({ nirunCapa: true }, "");
      empujado.current = true;
    }
    const alVolver = () => {
      empujado.current = false;
      cerrarRef.current();
    };
    window.addEventListener("popstate", alVolver);
    return () => {
      window.removeEventListener("popstate", alVolver);
      setTimeout(() => {
        if (contador.current === mia && empujado.current) {
          empujado.current = false;
          history.back();
        }
      }, 0);
    };
  }, [abierto]);

  return empujado;
}
