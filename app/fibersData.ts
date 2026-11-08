export type FiberImage = { src: string; garment: string };
export type Fiber = {
  key: string;
  label: string;
  anchor: string;
  // Texto corto de la fibra: sale del documento "Descripción Fibras Nirün" (sin datos nuevos).
  intro: string;
  // Carácter de la fibra, con las palabras del dueño en el mismo documento. Opcional: hoy no se muestra.
  caracter?: string;
  images: FiberImage[];
};

// Carpeta de las fotos de las prendas dentro de public/. Si algún día se renombra, se cambia solo aquí.
const CARPETA_FOTOS = "/fibers";

const g = (fiber: string, garment: string, slug: string, ids: number[]): FiberImage[] =>
  ids.map((id) => ({ src: `${CARPETA_FOTOS}/${fiber}/${slug}/_84A${id}.jpg`, garment }));

export const fibers: Fiber[] = [
  {
    key: "yak",
    label: "YAK",
    anchor: "detalle-yak",
    intro:
      "Subpelo del yak, animal adaptado a la altura y al frío extremo de Mongolia. Gran calidez con ligereza, y mucha durabilidad.",
    caracter: "El lujo funcional",
    images: [
      ...g("yak", "Khulán", "khulan", [5137, 5147, 5164, 5228]),
      // La primera es playa.jpg recortada a 2:3 (sin el letrero del fondo): misma sesión y mismo abrigo que las demás; reemplaza a _84A4556.
      { src: `${CARPETA_FOTOS}/yak/nomin-azul/playa-portada.jpg`, garment: "Nomín Azul Oscuro" },
      ...g("yak", "Nomín Azul Oscuro", "nomin-azul", [4609, 4773, 4828]),
      ...g("yak", "Nomín Negro", "nomin-negro", [6342, 6395, 6480, 6582]),
    ],
  },
  {
    key: "cashmere",
    label: "CASHMERE",
    anchor: "detalle-cashmere",
    intro:
      "Subpelo de la cabra de cachemira, de Mongolia. Extraordinaria suavidad y tacto sedoso, muy liviano y con excelente aislamiento frente al frío.",
    caracter: "La elegancia clásica",
    images: [...g("cashmere", "Záya", "zaya", [4890, 4954, 5015, 5104])],
  },
  {
    key: "baby-camel",
    label: "BABY CAMEL",
    anchor: "detalle-baby-camel",
    intro:
      "Subpelo del primer cambio de pelaje de camellos jóvenes, de Mongolia. Suavidad superior a la lana tradicional, elegancia natural y gran durabilidad.",
    caracter: "La sofisticación discreta",
    images: [
      ...g("baby-camel", "Bolomaa", "bolomaa", [5497, 5651, 5572, 5765]),
      ...g("baby-camel", "Erdene", "erdene", [5968, 6153, 6178, 6318]),
      ...g("baby-camel", "Sernaí", "sernai", [5826, 5841, 5860, 5877]),
      ...g("baby-camel", "Sernaí Silk", "sernai-silk", [5995, 6029, 6032, 6248]),
    ],
  },
];
