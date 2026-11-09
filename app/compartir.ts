import type { Metadata } from "next";
import { imagenCompartirDe, tituloSeoDe, type Producto } from "./products";

// Imágenes para compartir un enlace (WhatsApp, Instagram, iMessage): 1200x630 y livianas,
// porque WhatsApp e Instagram descartan las imágenes pesadas. Solo se usan en el servidor.

// Imagen general del sitio: tríptico del hero de PC.
// El texto no nombra las prendas hasta que el dueño confirme cuál es el abrigo negro de la foto grande.
export const IMAGEN_GENERAL = {
  url: "/og/nirun-og-v2.jpg",
  width: 1200,
  height: 630,
  alt: "Tres looks de Nirün en yak y cashmere",
  type: "image/jpeg",
};

// openGraph general del sitio, SIN url: el layout lo usa tal cual (así una página nueva no hereda la url del inicio)
// y el inicio le suma la suya. Next reemplaza openGraph entero, por eso el inicio repite todo con ...OPEN_GRAPH_GENERAL.
export const OPEN_GRAPH_GENERAL = {
  title: "Nirün | Cashmere, Yak y Baby Camel de Mongolia",
  description:
    "Abrigos y prendas en yak, cashmere y baby camel, fibras nobles de Mongolia. Pruébatelos con cita en Vitacura.",
  siteName: "Nirün",
  images: [IMAGEN_GENERAL],
  locale: "es_CL",
  type: "website",
} satisfies Metadata["openGraph"];

// Imágenes de public/og que existían al construir el sitio. La lista la arma next.config.ts (no se lee el disco aquí).
const EXISTENTES = new Set((process.env.NIRUN_IMAGENES_OG ?? "").split(",").filter(Boolean));

// Imagen de una prenda: un tríptico con sus fotos, en public/og/prenda/<slug>.jpg (lo arma scripts/generar_og.py).
// Si el archivo no existe al construir el sitio (por ejemplo, una prenda nueva), se usa la imagen general:
// así agregar o cambiar una prenda nunca rompe la vista previa.
export function imagenCompartir(p: Producto) {
  const url = imagenCompartirDe(p);
  const existe = !url.startsWith("/") || EXISTENTES.has(url);
  if (!existe) return IMAGEN_GENERAL;
  const deQue = p.piezas.length > 1 ? "las piezas" : "la prenda";
  return { url, width: 1200, height: 630, alt: `${tituloSeoDe(p)}, tres fotos de ${deQue}`, type: "image/jpeg" };
}
