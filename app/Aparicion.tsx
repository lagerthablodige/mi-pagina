"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Aparición suave al hacer scroll. Todo se ve por defecto (también sin JS): este componente solo esconde,
// con la clase "por-aparecer", los bloques .aparece que están más abajo de la pantalla, y los revela al llegar.
// Lo que ya está a la vista (o más arriba) nunca se esconde. Con "reducir movimiento" no hace nada.
export default function Aparicion() {
  const ruta = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const obs = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (!e.isIntersecting) continue;
          e.target.classList.remove("por-aparecer");
          obs.unobserve(e.target);
        }
      },
      { rootMargin: "0px", threshold: 0 }
    );
    for (const el of document.querySelectorAll<HTMLElement>(".aparece")) {
      if (el.getBoundingClientRect().top > window.innerHeight) {
        el.classList.add("por-aparecer");
        obs.observe(el);
      }
    }
    return () => {
      obs.disconnect();
      // Si React reutiliza un bloque en la ruta siguiente, no queda escondido: se vuelve a decidir con la página nueva.
      for (const el of document.querySelectorAll(".por-aparecer")) el.classList.remove("por-aparecer");
    };
  }, [ruta]);

  return null;
}
