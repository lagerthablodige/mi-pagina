import type { MetadataRoute } from "next";
import { fotosDe, productos, SITE } from "./products";

// Las tres fotos del hero del inicio. Si cambian de nombre o de carpeta, cambiarlas también aquí.
const FOTOS_INICIO = ["/hero/columnas.jpg", "/hero/cardigan.jpg", "/hero/rocas.jpg"];

// Cada página con sus fotos, para que Google las encuentre.
// Sin lastModified (una fecha que nadie actualiza engaña a Google), sin changeFrequency ni priority (Google los ignora).
// Cuando existan /privacidad y /compras, agregarlas aquí.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE, images: FOTOS_INICIO.map((f) => SITE + f) },
    // Una página por prenda.
    ...productos.map((p) => ({
      url: `${SITE}/prenda/${p.slug}`,
      images: fotosDe(p).map((f) => SITE + f),
    })),
  ];
}
