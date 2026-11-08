"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Aparición suave al hacer scroll. Sin JS todo se ve: el estado oculto solo existe cuando
// este componente marca el <html> con la clase "con-js". Con "reducir movimiento" no hace nada.
export default function Aparicion() {
  const ruta = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const elementos = Array.from(document.querySelectorAll<HTMLElement>(".aparece"));

    // Lo que ya está en pantalla se muestra de una vez, sin animación ni parpadeo.
    for (const el of elementos) {
      const caja = el.getBoundingClientRect();
      if (caja.top < window.innerHeight && caja.bottom > 0) el.classList.add("visible");
    }
    document.documentElement.classList.add("con-js");

    const observador = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (!entrada.isIntersecting) continue;
          entrada.target.classList.add("visible");
          observador.unobserve(entrada.target);
        }
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.01 }
    );
    for (const el of elementos) {
      if (!el.classList.contains("visible")) observador.observe(el);
    }

    return () => observador.disconnect();
  }, [ruta]);

  return null;
}
