import { readdirSync } from "node:fs";
import path from "node:path";
import type { NextConfig } from "next";

// Caché de 7 días en el navegador para las fotos (y 30 días más mientras se revalidan).
// OJO: solo es seguro si una foto que cambia lleva SIEMPRE un nombre de archivo nuevo
// (regla «foto nueva = nombre de archivo nuevo», ver docs/COMO-EDITAR-PRENDAS.md).
// Publicar estas cabeceras junto con las fotos nuevas (M21 y M26) o después, nunca antes:
// si no, quien vuelva podría ver las fotos viejas hasta 7 días.
// La lista incluye fibras y portada, los nombres de carpeta que propone M21, por si algún día se renombran.
const CACHE_FOTOS = "public, max-age=604800, stale-while-revalidate=2592000";

// Imágenes para compartir que existen en public/og (las arma scripts/generar_og.py), separadas por coma.
// Se leen aquí, al construir el sitio, y app/compartir.ts solo consulta la lista: si la ficha leyera el disco,
// Next metería las 34 MB de fotos de public en cada función del servidor de Vercel.
function imagenesParaCompartir(carpeta = path.join(process.cwd(), "public", "og"), url = "/og"): string[] {
  try {
    return readdirSync(carpeta, { withFileTypes: true }).flatMap((f) =>
      f.isDirectory()
        ? imagenesParaCompartir(path.join(carpeta, f.name), `${url}/${f.name}`)
        : /\.(jpe?g|png)$/i.test(f.name)
          ? [`${url}/${f.name}`]
          : []
    );
  } catch {
    return [];
  }
}

const nextConfig: NextConfig = {
  env: {
    NIRUN_IMAGENES_OG: imagenesParaCompartir().join(","),
  },
  images: {
    // Las fotos no cambian de nombre: se pueden cachear 30 días (menos transformaciones y carga más rápida).
    minimumCacheTTL: 60 * 60 * 24 * 30,
    // Los anchos de siempre más 1320, para los iPhone Pro, Plus y Air (402 a 440 pt a 3x), que antes saltaban a 1920.
    deviceSizes: [640, 750, 828, 1080, 1200, 1320, 1920, 2048, 3840],
    // AVIF pesa entre 33 y 50% menos que WebP. El navegador que no lo acepta recibe WebP.
    formats: ["image/avif", "image/webp"],
    // Solo estas dos calidades (las que usa el sitio): limita las transformaciones del plan gratis de Vercel.
    // Una foto con otra quality da error: agregar el valor aquí antes de usarlo.
    qualities: [70, 75],
  },
  async headers() {
    return [
      {
        source: "/:carpeta(hero|portada|origen|fibers|fibras|og)/:ruta*",
        headers: [{ key: "Cache-Control", value: CACHE_FOTOS }],
      },
      {
        source: "/logo-mark.png",
        headers: [{ key: "Cache-Control", value: CACHE_FOTOS }],
      },
    ];
  },
  async rewrites() {
    // iOS y algunos lectores piden /apple-touch-icon.png directo (hoy da 404). Se sirve el mismo ícono de app/apple-icon.png.
    return [
      { source: "/apple-touch-icon.png", destination: "/apple-icon.png" },
      { source: "/apple-touch-icon-precomposed.png", destination: "/apple-icon.png" },
    ];
  },
};

export default nextConfig;
