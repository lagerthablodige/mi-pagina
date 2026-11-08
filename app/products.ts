import { fibers, type Fiber } from "./fibersData";

// Precios en pesos chilenos CON IVA incluido (vienen de la planilla de Benjamín). No se muestra el precio neto ni el stock.
// Cada producto se enlaza con su prenda de fibersData por el nombre exacto (campo "garment"); de ahí salen las fotos y la fibra.

export type Pieza = {
  nombre: string;
  material: string;
  color: string;
  tallas: string[];
  precio: number;
};

export type Producto = {
  slug: string;
  garment: string; // nombre de la prenda en fibersData
  nombre: string; // nombre completo para mostrar
  // Casi todas las prendas son una sola pieza. Sernaí Silk son dos que se venden por separado (sin precio de conjunto).
  piezas: Pieza[];
  // Nomín existe en dos colores: enlaza al otro color.
  otroColor?: { slug: string; color: string };
};

// Prenda de una sola pieza.
function simple(datos: Pieza & { slug: string; garment: string; otroColor?: Producto["otroColor"] }): Producto {
  const { slug, garment, otroColor, ...pieza } = datos;
  return { slug, garment, nombre: pieza.nombre, piezas: [pieza], otroColor };
}

export const productos: Producto[] = [
  simple({
    slug: "khulan",
    garment: "Khulán",
    nombre: "Abrigo envolvente Khulán reversible",
    material: "100% Yak",
    color: "Gris espiga",
    tallas: ["S", "M", "L"],
    precio: 980000,
  }),
  simple({
    slug: "nomin-azul-oscuro",
    garment: "Nomín Azul Oscuro",
    nombre: "Abrigo Nomín corte evasé oversize",
    material: "100% Yak",
    color: "Azul oscuro",
    tallas: ["S", "M", "L"],
    precio: 980000,
    otroColor: { slug: "nomin-negro", color: "negro" },
  }),
  simple({
    slug: "nomin-negro",
    garment: "Nomín Negro",
    nombre: "Abrigo Nomín corte evasé oversize",
    material: "100% Yak",
    color: "Negro",
    tallas: ["S", "M", "L"],
    precio: 980000,
    otroColor: { slug: "nomin-azul-oscuro", color: "azul oscuro" },
  }),
  simple({
    slug: "zaya",
    garment: "Záya",
    nombre: "Cárdigan largo tejido Záya",
    material: "100% Cashmere",
    color: "Blanco",
    tallas: ["Talla única"],
    precio: 980000,
  }),
  simple({
    slug: "bolomaa",
    garment: "Bolomaa",
    nombre: "Vest Bolomaa",
    material: "100% Baby Camel",
    color: "Rosa",
    tallas: ["S", "M", "L"],
    precio: 350000,
  }),
  simple({
    slug: "erdene",
    garment: "Erdene",
    nombre: "Abrigo envolvente Erdene reversible",
    material: "100% Baby Camel",
    color: "Beige",
    tallas: ["M", "L"],
    precio: 980000,
  }),
  simple({
    slug: "sernai",
    garment: "Sernaí",
    nombre: "Pantalón Sernaí",
    material: "100% Baby Camel",
    color: "Beige",
    tallas: ["XS", "S", "M"],
    precio: 200000,
  }),
  {
    slug: "sernai-silk",
    garment: "Sernaí Silk",
    nombre: "Chaqueta y falda Sernaí Silk",
    piezas: [
      { nombre: "Chaqueta Sernaí", material: "Baby Camel y seda", color: "Rosa", tallas: ["S", "M", "L"], precio: 450000 },
      { nombre: "Falda Sernaí", material: "Baby Camel", color: "Rosa", tallas: ["S", "M", "L"], precio: 250000 },
    ],
  },
];

export const SITE = "https://www.nirun.cl";

// 980000 -> "$980.000" (punto de miles, sin depender del idioma del servidor).
export function precioCLP(valor: number): string {
  return "$" + String(valor).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function productoPorSlug(slug: string): Producto | undefined {
  return productos.find((p) => p.slug === slug);
}

export function productoDePrenda(garment: string): Producto | undefined {
  return productos.find((p) => p.garment === garment);
}

// Fibra a la que pertenece la prenda (según fibersData).
export function fibraDe(producto: Producto): Fiber {
  const fibra = fibers.find((f) => f.images.some((img) => img.garment === producto.garment));
  if (!fibra) throw new Error(`La prenda "${producto.garment}" no está en fibersData`);
  return fibra;
}

export function fotosDe(producto: Producto): string[] {
  return fibraDe(producto)
    .images.filter((img) => img.garment === producto.garment)
    .map((img) => img.src);
}

// Prendas de la misma fibra, sin la actual ni su otro color (ese ya sale como "También en ...").
export function masEnLaFibra(producto: Producto): Producto[] {
  const fibra = fibraDe(producto);
  return productos.filter(
    (p) => p.slug !== producto.slug && p.slug !== producto.otroColor?.slug && fibraDe(p).key === fibra.key
  );
}

// Mensaje precargado de WhatsApp con el nombre de la prenda.
export function mensajeWhatsApp(producto: Producto): string {
  if (producto.piezas.length > 1) {
    const piezas = producto.piezas.map((p) => p.nombre).join(" y la ");
    return `Hola, me interesan la ${piezas} (Sernaí Silk). ¿Qué tallas tienen disponibles?`;
  }
  return `Hola, me interesa el ${producto.nombre}. ¿Qué tallas tienen disponibles?`;
}
