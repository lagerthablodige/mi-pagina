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
  nombreCorto: string; // nombre para tarjetas e índices ("Nomín · Negro")
  tipo: string; // qué prenda es, en pocas palabras
  portada: number; // índice de la foto de portada (en el orden de fotosDe)
  segunda: number; // índice de la foto que aparece al pasar el mouse
  // Casi todas las prendas son una sola pieza. Sernaí Silk son dos que se venden por separado (sin precio de conjunto).
  piezas: Pieza[];
  // Nomín existe en dos colores: enlaza al otro color.
  otroColor?: { slug: string; color: string };
};

// Prenda de una sola pieza.
type DatosSimples = Pieza & Pick<Producto, "slug" | "garment" | "nombreCorto" | "tipo" | "portada" | "segunda" | "otroColor">;

function simple(datos: DatosSimples): Producto {
  const { slug, garment, nombreCorto, tipo, portada, segunda, otroColor, ...pieza } = datos;
  return { slug, garment, nombreCorto, tipo, portada, segunda, nombre: pieza.nombre, piezas: [pieza], otroColor };
}

export const productos: Producto[] = [
  simple({
    slug: "khulan",
    garment: "Khulán",
    nombreCorto: "Khulán",
    tipo: "Abrigo envolvente reversible",
    portada: 0,
    segunda: 1,
    nombre: "Abrigo envolvente Khulán reversible",
    material: "100% Yak",
    color: "Gris espiga",
    tallas: ["S", "M", "L"],
    precio: 980000,
  }),
  simple({
    slug: "nomin-azul-oscuro",
    garment: "Nomín Azul Oscuro",
    nombreCorto: "Nomín · Azul oscuro",
    tipo: "Abrigo corte evasé oversize",
    portada: 0,
    segunda: 3,
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
    nombreCorto: "Nomín · Negro",
    tipo: "Abrigo corte evasé oversize",
    portada: 1,
    segunda: 3,
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
    nombreCorto: "Záya",
    tipo: "Cárdigan largo tejido",
    portada: 0,
    segunda: 1,
    nombre: "Cárdigan largo tejido Záya",
    material: "100% Cashmere",
    color: "Blanco",
    tallas: ["Talla única"],
    precio: 980000,
  }),
  simple({
    slug: "bolomaa",
    garment: "Bolomaa",
    nombreCorto: "Bolomaa",
    tipo: "Vest",
    portada: 1,
    segunda: 3,
    nombre: "Vest Bolomaa",
    material: "100% Baby Camel",
    color: "Rosa",
    tallas: ["S", "M", "L"],
    precio: 350000,
  }),
  simple({
    slug: "erdene",
    garment: "Erdene",
    nombreCorto: "Erdene",
    tipo: "Abrigo envolvente reversible",
    portada: 2,
    segunda: 0,
    nombre: "Abrigo envolvente Erdene reversible",
    material: "100% Baby Camel",
    color: "Beige",
    tallas: ["M", "L"],
    precio: 980000,
  }),
  simple({
    slug: "sernai",
    garment: "Sernaí",
    nombreCorto: "Sernaí",
    tipo: "Pantalón",
    portada: 3,
    segunda: 1,
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
    nombreCorto: "Sernaí Silk",
    tipo: "Chaqueta y falda",
    portada: 0,
    segunda: 2,
    piezas: [
      { nombre: "Chaqueta Sernaí", material: "Baby Camel y seda", color: "Rosa", tallas: ["S", "M", "L"], precio: 450000 },
      { nombre: "Falda Sernaí", material: "Baby Camel", color: "Rosa", tallas: ["S", "M", "L"], precio: 250000 },
    ],
  },
];

// Orden de la grilla de la colección (pensado para que cada fila tenga una escala de encuadre parecida).
const ORDEN_COLECCION = ["khulan", "nomin-negro", "zaya", "bolomaa", "nomin-azul-oscuro", "erdene", "sernai-silk", "sernai"];
// Orden dentro de cada fibra (índices del inicio y "Más en ...").
const ORDEN_FIBRAS = ["khulan", "nomin-negro", "nomin-azul-oscuro", "zaya", "erdene", "bolomaa", "sernai-silk", "sernai"];

function enOrden(slugs: string[]): Producto[] {
  return slugs.map((slug) => {
    const p = productos.find((x) => x.slug === slug);
    if (!p) throw new Error(`Falta el producto "${slug}"`);
    return p;
  });
}

export const productosEnOrden: Producto[] = enOrden(ORDEN_COLECCION);
const productosPorFibra: Producto[] = enOrden(ORDEN_FIBRAS);

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

// "BABY CAMEL" -> "Baby Camel"
export function nombreFibra(fibra: Fiber): string {
  return fibra.label
    .toLowerCase()
    .split(" ")
    .map((palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1))
    .join(" ");
}

// Prendas de una fibra, en el orden de la colección.
export function prendasDeFibra(fibra: Fiber): Producto[] {
  return productosPorFibra.filter((p) => fibraDe(p).key === fibra.key);
}

export function fotosDe(producto: Producto): string[] {
  return fibraDe(producto)
    .images.filter((img) => img.garment === producto.garment)
    .map((img) => img.src);
}

// Texto alternativo de una foto de la prenda. Nomín lleva el color para que no se repita entre las dos fichas.
export function altDeFoto(producto: Producto, n: number, total: number): string {
  const color = producto.otroColor ? ` ${producto.piezas[0].color.toLowerCase()}` : "";
  return `${producto.nombre}${color}, foto ${n + 1} de ${total}`;
}

// Prendas de la misma fibra, sin la actual ni su otro color (ese ya sale como "También en ...").
export function masEnLaFibra(producto: Producto): Producto[] {
  const fibra = fibraDe(producto);
  return productosPorFibra.filter(
    (p) => p.slug !== producto.slug && p.slug !== producto.otroColor?.slug && fibraDe(p).key === fibra.key
  );
}

// Nombre con el color cuando la prenda existe en dos colores (Nomín), para que el mensaje no sea ambiguo.
function nombreConColor(producto: Producto): string {
  return producto.otroColor ? `${producto.nombre} (${producto.piezas[0].color.toLowerCase()})` : producto.nombre;
}

// "Chaqueta Sernaí" -> "Chaqueta" (para mostrar el precio de cada pieza en dos líneas).
export function etiquetaPieza(pieza: Pieza): string {
  return pieza.nombre.split(" ")[0];
}

// Respaldo cuando una prenda no tiene otras de su fibra (Záya): una prenda de cada una de las otras fibras.
export function otrasPrendas(producto: Producto, cantidad = 2): Producto[] {
  const fibra = fibraDe(producto);
  const vistas = new Set<string>([fibra.key]);
  const elegidas: Producto[] = [];
  for (const p of productosEnOrden) {
    const clave = fibraDe(p).key;
    if (vistas.has(clave)) continue;
    vistas.add(clave);
    elegidas.push(p);
    if (elegidas.length === cantidad) break;
  }
  return elegidas;
}

// Mensaje precargado de WhatsApp con el nombre de la prenda y, si ya la eligió, la talla.
// `tallas` guarda la talla elegida de cada pieza (clave: nombre de la pieza).
export function mensajeWhatsApp(producto: Producto, tallas: Record<string, string> = {}): string {
  if (producto.piezas.length > 1) {
    const elegidas = producto.piezas.filter((p) => tallas[p.nombre]);
    const lista = producto.piezas
      .map((p) => (tallas[p.nombre] ? `${p.nombre} (talla ${tallas[p.nombre]})` : p.nombre))
      .join(" y la ");
    const cierre = elegidas.length === producto.piezas.length ? "¿Están disponibles?" : "¿Qué tallas tienen disponibles?";
    return `Hola, me interesan la ${lista} (Sernaí Silk). ${cierre}`;
  }
  const [pieza] = producto.piezas;
  const talla = tallas[pieza.nombre] ?? (pieza.tallas.length === 1 ? pieza.tallas[0] : "");
  if (talla) {
    return `Hola, me interesa el ${nombreConColor(producto)}, ${talla === "Talla única" ? "talla única" : `talla ${talla}`}. ¿Está disponible?`;
  }
  return `Hola, me interesa el ${nombreConColor(producto)}. ¿Qué tallas tienen disponibles?`;
}
