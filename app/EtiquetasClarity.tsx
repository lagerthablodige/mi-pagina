"use client";

// Etiquetas de sesión en Clarity (M22), para filtrar grabaciones por lo que la persona vio.
// Se monta una vez en layout.tsx, después de <Aparicion />. Sin datos personales: solo la página, la prenda,
// la fibra y las secciones del inicio. En localhost y en los previews Clarity no carga y esto no hace nada.
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { clarity, paginaDe } from "./medicion";

// Secciones del inicio, en orden. Clarity acumula los valores de una misma clave en la sesión.
const SECCIONES = ["coleccion", "origen", "fibras", "showroom"];

export default function EtiquetasClarity() {
  const ruta = usePathname();

  useEffect(() => {
    const { pagina, prenda, fibra } = paginaDe(ruta);
    clarity("set", "pagina", pagina); // inicio | ficha | 404
    if (pagina === "ficha") {
      clarity("set", "prenda_vista", prenda); // khulan, zaya, ...
      clarity("set", "fibra_vista", fibra); // yak | cashmere | baby-camel (clave de fibersData)
    }
    if (pagina !== "inicio") return;

    const observador = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (!e.isIntersecting) continue;
          clarity("set", "seccion_vista", e.target.id);
          observador.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -40% 0px", threshold: 0 } // cuenta cuando el borde superior pasa el 60 % de la pantalla
    );
    for (const id of SECCIONES) {
      const el = document.getElementById(id);
      if (el) observador.observe(el);
    }
    return () => observador.disconnect();
  }, [ruta]);

  return null;
}
