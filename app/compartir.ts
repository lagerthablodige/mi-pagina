import fs from "node:fs";
import path from "node:path";
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

// Imagen de una prenda: un tríptico con sus fotos, en public/og/prenda/<slug>.jpg (lo arma scripts/generar_og.py).
// Si el archivo no existe al construir el sitio (por ejemplo, una prenda nueva), se usa la imagen general:
// así agregar o cambiar una prenda nunca rompe la vista previa.
export function imagenCompartir(p: Producto) {
  const url = imagenCompartirDe(p);
  const existe = !url.startsWith("/") || fs.existsSync(path.join(process.cwd(), "public", ...url.split("/")));
  if (!existe) return IMAGEN_GENERAL;
  const deQue = p.piezas.length > 1 ? "las piezas" : "la prenda";
  return { url, width: 1200, height: 630, alt: `${tituloSeoDe(p)}, tres fotos de ${deQue}`, type: "image/jpeg" };
}
