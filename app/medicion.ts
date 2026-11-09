// Un solo lugar para medir el recorrido de compra.
// - Vercel Analytics: máximo 2 propiedades por evento -> { location, prenda }.
// - Clarity: el mismo evento y etiquetas de sesión, para filtrar grabaciones y mapas de calor.
// Sin datos personales: nunca correos, nombres ni teléfonos.
// No importa products.ts a propósito: este archivo va en todas las páginas y el catálogo no debe pesar en ellas.
import { track } from "@vercel/analytics";

type FnClarity = ((...args: unknown[]) => void) & { q?: unknown[][] };

// Clarity solo existe en *.nirun.cl (ver layout.tsx). En localhost y en los previews no hace nada.
// Su script se inserta después de la hidratación, así que las etiquetas de la primera página llegarían antes que él.
// Por eso, en nirun.cl, se deja la misma cola que crea su propio snippet (c[a]=c[a]||…): al cargar, Clarity la lee.
export function clarity(...args: unknown[]) {
  if (typeof window === "undefined") return;
  const w = window as unknown as { clarity?: FnClarity };
  if (typeof w.clarity !== "function") {
    if (!location.hostname.endsWith("nirun.cl")) return;
    const cola: FnClarity = (...a: unknown[]) => {
      (cola.q ??= []).push(a);
    };
    w.clarity = cola;
  }
  w.clarity(...args);
}

// Fibra de cada prenda, solo para las etiquetas de Clarity (clave de fibersData).
// Una prenda que no esté aquí se mide como 404: agrégala siempre al sumar una prenda.
const FIBRA: Record<string, string> = {
  khulan: "yak",
  "nomin-negro": "yak",
  "nomin-azul-oscuro": "yak",
  zaya: "cashmere",
  bolomaa: "baby-camel",
  erdene: "baby-camel",
  sernai: "baby-camel",
  "sernai-silk": "baby-camel",
};

export type Pagina = { pagina: "inicio" | "ficha" | "404"; prenda: string; fibra: string };

// Qué página es, a partir de la ruta.
export function paginaDe(ruta: string | null): Pagina {
  if (ruta === "/") return { pagina: "inicio", prenda: "-", fibra: "-" };
  const m = ruta?.match(/^\/prenda\/([a-z0-9-]+)\/?$/);
  const fibra = m ? FIBRA[m[1]] : undefined;
  if (m && typeof fibra === "string") return { pagina: "ficha", prenda: m[1], fibra };
  return { pagina: "404", prenda: "-", fibra: "-" };
}

// Nombres que usa TrackedLink hoy. Se aceptan otros para no romper llamadas nuevas, pero conviene no inventar más.
export type EventoCta = "calendly_click" | "whatsapp_click" | "instagram_click";

// Clic en un botón de contacto. `datos` es el eventData de la llamada (hoy solo { location }).
export function medirCta(evento: EventoCta | (string & {}), location: string, prenda: string, datos: Record<string, string> = {}) {
  track(evento, { ...datos, location, prenda });
  clarity("event", evento);
  clarity("set", evento, location); // etiqueta, por ejemplo whatsapp_click = prenda_khulan
  if (prenda !== "-") clarity("set", "prenda_cta", prenda);
  clarity("upgrade", evento); // si algún día hay muestreo, estas grabaciones se guardan primero
}

// Pasos del recorrido que no son enlaces (talla, correo, foto, menú). Usar 2 propiedades como máximo.
export function medirPaso(evento: string, datos: Record<string, string> = {}) {
  track(evento, datos);
  clarity("event", evento);
}

// UTM para Calendly: Landa Brands ve en sus reservas cuáles vinieron de nirun.cl y de qué botón.
// Solo cambia los enlaces de calendly.com; los demás quedan iguales.
export function conUtm(href: string, location: string, prenda: string) {
  if (!href.includes("calendly.com")) return href;
  const u = new URL(href);
  u.searchParams.set("utm_source", "nirun.cl");
  u.searchParams.set("utm_medium", "web");
  u.searchParams.set("utm_campaign", prenda === "-" ? "general" : prenda);
  u.searchParams.set("utm_content", location);
  return u.toString();
}
