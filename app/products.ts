import { fibers, type Fiber } from "./fibersData";

// CATÁLOGO DE NIRÜN: la única fuente de los datos de cada prenda.
// Guía paso a paso (cambiar un precio, marcar una talla vendida, agregar una prenda): docs/COMO-EDITAR-PRENDAS.md
//
// - Precios en pesos chilenos CON IVA incluido (vienen de la planilla de Benjamín). No se muestra el precio neto ni el stock.
// - Cada producto se enlaza con sus fotos de fibersData por el nombre exacto (campo "garment"); de ahí salen las fotos y la fibra.
// - Los campos con "?" son opcionales. Si no se escriben, el sitio usa un respaldo automático (ver las funciones "...De" más abajo).
// - Nunca escribir datos que el dueño no haya confirmado (materiales, medidas, calce, cuidado, país de confección).

export type Pieza = {
  nombre: string;
  material: string;
  color: string;
  tallas: string[]; // tallas disponibles: cuando se vende una, se borra de aquí ese mismo día
  precio: number;
  // Opcionales: solo copiados de la etiqueta o confirmados por el dueño. Si no están, la fila no aparece.
  largo?: string; // por ejemplo "110 cm en talla M"
  hechoEn?: string; // país de confección
  cuidado?: string; // instrucciones de la etiqueta
};

// Para "probártelo", "pruébatela", "pruébatelos" o "pruébatelas" según la prenda.
export type Pronombre = "lo" | "la" | "los" | "las";

export type Producto = {
  slug: string; // la dirección de la ficha: nirun.cl/prenda/<slug>
  garment: string; // nombre de la prenda en fibersData (de ahí salen las fotos y la fibra)
  nombre: string; // nombre completo (datos para Google, textos alternativos y títulos)
  nombreCorto: string; // nombre de la tarjeta, del índice y del título de la ficha ("Nomín negro")
  tipo: string; // qué prenda es, en pocas palabras ("Abrigo envolvente reversible")
  lo: Pronombre; // en las prendas de una pieza se puede omitir: vale "lo"
  portada: number; // número de la foto de portada (contando desde 0, en el orden de fibersData)
  segunda: number; // número de la foto que aparece al pasar el mouse en PC
  // Casi todas las prendas son una sola pieza. Sernaí Silk son dos que se venden por separado (sin precio de conjunto).
  piezas: Pieza[];
  // Nomín existe en dos colores: enlaza al otro color.
  otroColor?: { slug: string; color: string };

  // ---------- Opcionales, con respaldo automático ----------
  // Tipo corto para la tarjeta de la colección. Respaldo: tipo. Usar tipoTarjetaDe(producto).
  tipoTarjeta?: string;
  // Título para Google, sin "| Nirün". Respaldo: nombre (y color) + "de" + fibra. Usar tituloSeoDe(producto).
  tituloSeo?: string;
  // Imagen para compartir en WhatsApp o Instagram. Respaldo: /og/prenda/<slug>.jpg. Usar imagenCompartirDe(producto).
  imagenCompartir?: string;
  // Texto alternativo de cada foto. Clave: nombre del archivo ("_84A5137.jpg"), así no importa el orden ni la carpeta.
  // "{prenda}" se cambia por el tipo y el nombre ("abrigo Khulán"), así el tipo sale siempre de este archivo.
  // Respaldo: "<nombre>, foto N de M". Usar altDeFoto(producto, src).
  alts?: Record<string, string>;
  // Dos o tres líneas propias de la prenda. Solo con texto aprobado por el dueño.
  descripcion?: string;
  // "La modelo mide 1,__ m y usa talla __." Solo con datos reales de la modelo.
  calce?: string;
};

// Campos que se escriben en una prenda de una sola pieza (los de la pieza van sueltos, junto a los del producto).
type DatosSimples = Pieza &
  Pick<
    Producto,
    | "slug"
    | "garment"
    | "nombreCorto"
    | "tipo"
    | "portada"
    | "segunda"
    | "otroColor"
    | "tipoTarjeta"
    | "tituloSeo"
    | "imagenCompartir"
    | "alts"
    | "descripcion"
    | "calce"
  > & { lo?: Pronombre };

// Prenda de una sola pieza.
function simple(datos: DatosSimples): Producto {
  const {
    slug,
    garment,
    nombreCorto,
    tipo,
    lo = "lo",
    portada,
    segunda,
    otroColor,
    tipoTarjeta,
    tituloSeo,
    imagenCompartir,
    alts,
    descripcion,
    calce,
    ...pieza
  } = datos;
  return {
    slug,
    garment,
    nombre: pieza.nombre,
    nombreCorto,
    tipo,
    lo,
    portada,
    segunda,
    piezas: [pieza],
    otroColor,
    tipoTarjeta,
    tituloSeo,
    imagenCompartir,
    alts,
    descripcion,
    calce,
  };
}

export const productos: Producto[] = [
  simple({
    slug: "khulan",
    garment: "Khulán",
    nombreCorto: "Khulán",
    tipo: "Abrigo envolvente reversible",
    tipoTarjeta: "Abrigo reversible",
    tituloSeo: "Abrigo Khulán de yak, envolvente y reversible",
    portada: 0,
    segunda: 1,
    nombre: "Abrigo envolvente Khulán reversible",
    material: "100% Yak",
    color: "Gris espiga",
    tallas: ["S", "M", "L"],
    precio: 980000,
    alts: {
      "_84A5137.jpg": "{prenda} gris espiga de cuerpo entero, cruzado y con el cinturón anudado",
      "_84A5147.jpg": "{prenda} de cerca, con la solapa ancha y el cinturón anudado a la cintura",
      "_84A5164.jpg": "Detalle del tejido espiga del {prenda}, a la altura de la cadera",
      "_84A5228.jpg": "{prenda} con cinturón, de cuerpo entero, en una calle con árboles",
    },
  }),
  simple({
    slug: "nomin-azul-oscuro",
    garment: "Nomín Azul Oscuro",
    nombreCorto: "Nomín azul oscuro",
    tipo: "Abrigo corte evasé oversize",
    tipoTarjeta: "Abrigo evasé",
    tituloSeo: "Abrigo Nomín azul oscuro de yak, corte evasé",
    portada: 0,
    segunda: 2,
    nombre: "Abrigo Nomín corte evasé oversize",
    material: "100% Yak",
    color: "Azul oscuro",
    tallas: ["S", "M", "L"],
    precio: 980000,
    otroColor: { slug: "nomin-negro", color: "negro" },
    alts: {
      "playa-portada.jpg": "{prenda}, abierto, sobre una blusa celeste con lazo al cuello",
      "_84A4609.jpg": "{prenda} de cerca, con la solapa ancha",
      "_84A4773.jpg": "{prenda} hasta bajo la rodilla, sobre un vestido celeste estampado",
      "_84A4828.jpg": "{prenda} de cuerpo entero, caminando por una vereda",
    },
  }),
  simple({
    slug: "nomin-negro",
    garment: "Nomín Negro",
    nombreCorto: "Nomín negro",
    tipo: "Abrigo corte evasé oversize",
    tipoTarjeta: "Abrigo evasé",
    tituloSeo: "Abrigo Nomín negro de yak, corte evasé",
    portada: 1,
    segunda: 2,
    nombre: "Abrigo Nomín corte evasé oversize",
    material: "100% Yak",
    color: "Negro",
    tallas: ["S", "M", "L"],
    precio: 980000,
    otroColor: { slug: "nomin-azul-oscuro", color: "azul oscuro" },
    alts: {
      "_84A6342.jpg": "{prenda} de cuerpo entero, con cinturón, frente a un muro claro",
      "_84A6395.jpg": "{prenda} con cinturón, más de cerca, con botas altas",
      "_84A6480.jpg": "{prenda} abierto y en movimiento, en la calle",
      "_84A6582.jpg": "{prenda} largo y abierto, en la calle",
    },
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
    alts: {
      "_84A4890.jpg": "{prenda} blanco de cuerpo entero, abierto sobre ropa negra",
      "_84A4954.jpg": "{prenda} de cerca, con el tejido en relieve de formas curvas",
      "_84A5015.jpg": "Detalle del largo del {prenda}, visto de lado",
      "_84A5104.jpg": "{prenda} blanco de cuerpo entero, en la calle",
    },
  }),
  simple({
    slug: "bolomaa",
    garment: "Bolomaa",
    nombreCorto: "Bolomaa",
    tipo: "Vest",
    tituloSeo: "Vest Bolomaa de baby camel, rosa",
    portada: 1,
    segunda: 3,
    nombre: "Vest Bolomaa",
    material: "100% Baby Camel",
    color: "Rosa",
    tallas: ["S", "M", "L"],
    precio: 350000,
    alts: {
      "_84A5497.jpg": "{prenda} rosa, cruzado y con botones, sobre una blusa roja de manga larga",
      "_84A5651.jpg": "{prenda} rosa de cuerpo entero, frente a un muro claro",
      "_84A5572.jpg": "{prenda} de cerca, con la solapa y los botones cruzados",
      "_84A5765.jpg": "{prenda} rosa de perfil, caminando",
    },
  }),
  simple({
    slug: "erdene",
    garment: "Erdene",
    nombreCorto: "Erdene",
    tipo: "Abrigo envolvente reversible",
    tipoTarjeta: "Abrigo reversible",
    tituloSeo: "Abrigo Erdene de baby camel, envolvente y reversible",
    portada: 0,
    segunda: 2,
    nombre: "Abrigo envolvente Erdene reversible",
    material: "100% Baby Camel",
    color: "Beige",
    tallas: ["M", "L"],
    precio: 980000,
    alts: {
      "_84A5968.jpg": "{prenda} beige cruzado, con el cinturón anudado y bolsillos de parche",
      "_84A6153.jpg": "{prenda} beige abierto y en movimiento, en una escalera exterior",
      "_84A6178.jpg": "{prenda} beige abierto, con la modelo apoyada en un muro",
      "_84A6318.jpg": "{prenda} beige visto de espalda, con el cinturón atrás",
    },
  }),
  simple({
    slug: "sernai",
    garment: "Sernaí",
    nombreCorto: "Sernaí",
    tipo: "Pantalón",
    tituloSeo: "Pantalón Sernaí de baby camel, beige",
    portada: 3,
    segunda: 1,
    nombre: "Pantalón Sernaí",
    material: "100% Baby Camel",
    color: "Beige",
    tallas: ["XS", "S", "M"],
    precio: 200000,
    alts: {
      "_84A5826.jpg": "Modelo sentada en una escalera con el {prenda} beige de pierna ancha",
      "_84A5841.jpg": "Detalle del {prenda} beige, de la rodilla al botín",
      "_84A5860.jpg": "Modelo sentada con el {prenda} beige y una chaqueta burdeo",
      "_84A5877.jpg": "Modelo sentada en una escalera con el {prenda} beige, de cuerpo entero",
    },
  }),
  {
    slug: "sernai-silk",
    garment: "Sernaí Silk",
    nombre: "Chaqueta y falda Sernaí Silk",
    nombreCorto: "Sernaí Silk",
    tipo: "Chaqueta y falda",
    lo: "las",
    portada: 0,
    segunda: 2,
    piezas: [
      { nombre: "Chaqueta Sernaí", material: "Baby Camel y seda", color: "Rosa", tallas: ["S", "M", "L"], precio: 450000 },
      { nombre: "Falda Sernaí", material: "Baby Camel", color: "Rosa", tallas: ["S", "M", "L"], precio: 250000 },
    ],
    alts: {
      "_84A5995.jpg": "Chaqueta y falda Sernaí Silk rosa, con botones perlados, frente a un muro claro",
      "_84A6029.jpg": "Chaqueta Sernaí Silk de cerca, con la solapa y la fila de botones perlados",
      "_84A6032.jpg": "Chaqueta Sernaí Silk con un pañuelo estampado al cuello",
      "_84A6248.jpg": "Chaqueta y falda Sernaí Silk rosa de cuerpo entero, caminando",
    },
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

// ---------- Respaldos automáticos de los campos opcionales ----------

// Tipo corto de la tarjeta de la colección ("Abrigo reversible").
export function tipoTarjetaDe(producto: Producto): string {
  return producto.tipoTarjeta ?? producto.tipo;
}

// Título para Google, sin "| Nirün". Respaldo: "Cárdigan largo tejido Záya de cashmere".
export function tituloSeoDe(producto: Producto): string {
  if (producto.tituloSeo) return producto.tituloSeo;
  const color = producto.otroColor ? ` ${producto.piezas[0].color.toLowerCase()}` : "";
  return `${producto.nombre}${color} de ${nombreFibra(fibraDe(producto)).toLowerCase()}`;
}

// Ruta de la imagen para compartir (1200x630). Si el archivo no existe, la ficha usa la imagen general del sitio.
export function imagenCompartirDe(producto: Producto): string {
  return producto.imagenCompartir ?? `/og/prenda/${producto.slug}.jpg`;
}

// Tipo y nombre para una frase: "abrigo Khulán", "abrigo Nomín negro", "vest Bolomaa".
export function nombreEnFrase(producto: Producto): string {
  return `${producto.tipo.split(" ")[0].toLowerCase()} ${producto.nombreCorto}`;
}

// Artículo que va con la prenda: "el abrigo", "la chaqueta", "las piezas".
export function articuloDe(producto: Producto): string {
  return { lo: "el", la: "la", los: "los", las: "las" }[producto.lo];
}

// Texto alternativo de una foto. Se busca por la ruta de la foto (así sirve aunque la galería cambie el orden).
// También acepta el número de la foto, como antes: altDeFoto(producto, n, total).
export function altDeFoto(producto: Producto, src: string, n?: number, total?: number): string;
export function altDeFoto(producto: Producto, n: number, total?: number): string;
export function altDeFoto(producto: Producto, foto: string | number, b?: number, c?: number): string {
  const fotos = fotosDe(producto);
  const src = typeof foto === "string" ? foto : fotos[foto];
  const n = typeof foto === "string" ? (b ?? fotos.indexOf(foto)) : foto;
  const total = (typeof foto === "string" ? c : b) ?? fotos.length;
  const archivo = src?.split("/").pop() ?? "";
  const propio = producto.alts?.[archivo];
  if (propio) {
    const texto = propio.replace(/\{prenda\}/g, nombreEnFrase(producto));
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  }
  // Respaldo. Nomín lleva el color para que no se repita entre las dos fichas.
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

// "Chaqueta Sernaí" -> "Chaqueta" (para mostrar el precio de cada pieza).
export function etiquetaPieza(pieza: Pieza): string {
  return pieza.nombre.split(" ")[0];
}

// Precio en una sola línea: "$980.000" o, si son varias piezas, "Chaqueta $450.000 · Falda $250.000".
// Sin "Desde": la foto muestra el conjunto completo y un "Desde" se leería como su precio.
export function precioEnLinea(producto: Producto): string {
  if (producto.piezas.length === 1) return precioCLP(producto.piezas[0].precio);
  return producto.piezas.map((p) => `${etiquetaPieza(p)} ${precioCLP(p.precio)}`).join(" · ");
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

// Texto del mensaje de WhatsApp de la ficha, con la talla si ya la eligió.
// `tallas` guarda la talla elegida de cada pieza (clave: nombre de la pieza).
export function textoWhatsApp(producto: Producto, tallas: Record<string, string> = {}): string {
  if (producto.piezas.length > 1) {
    const conjunto = producto.nombreCorto;
    const pieza = (p: Pieza) => etiquetaPieza(p).toLowerCase();
    const elegidas = producto.piezas.filter((p) => tallas[p.nombre]);
    if (elegidas.length === 0) {
      return `Hola, me interesa ${conjunto} (${producto.piezas.map(pieza).join(" y ")}). ¿Qué tallas tienen disponibles?`;
    }
    if (elegidas.length === 1) {
      const [p] = elegidas;
      return `Hola, me interesa la ${pieza(p)} de ${conjunto}, talla ${tallas[p.nombre]}. ¿Está disponible?`;
    }
    const lista = elegidas
      .map((p, i) => `la ${pieza(p)}${i === 0 ? ` de ${conjunto}` : ""}, talla ${tallas[p.nombre]}`)
      .join(", y ");
    return `Hola, me interesan ${lista}. ¿Están disponibles?`;
  }
  const [pieza] = producto.piezas;
  const plural = producto.lo === "los" || producto.lo === "las";
  const prenda = `${articuloDe(producto)} ${nombreEnFrase(producto)}`;
  const talla = tallas[pieza.nombre] ?? (pieza.tallas.length === 1 ? pieza.tallas[0] : "");
  if (talla) {
    const textoTalla = talla === "Talla única" ? "talla única" : `talla ${talla}`;
    return `Hola, me ${plural ? "interesan" : "interesa"} ${prenda}, ${textoTalla}. ${plural ? "¿Están disponibles?" : "¿Está disponible?"}`;
  }
  return `Hola, me ${plural ? "interesan" : "interesa"} ${prenda}. ¿Qué tallas tienen disponibles?`;
}

// Mensaje completo de WhatsApp: el texto y, en otra línea, el enlace a la ficha (WhatsApp muestra la foto de la prenda).
export function mensajeWhatsApp(producto: Producto, tallas: Record<string, string> = {}): string {
  return `${textoWhatsApp(producto, tallas)}\n${SITE}/prenda/${producto.slug}`;
}
