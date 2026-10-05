export type FiberImage = { src: string; garment: string };
export type Fiber = { key: string; label: string; anchor: string; images: FiberImage[] };

const g = (fiber: string, garment: string, slug: string, ids: number[]): FiberImage[] =>
  ids.map((id) => ({ src: `/fibers/${fiber}/${slug}/_84A${id}.jpg`, garment }));

export const fibers: Fiber[] = [
  {
    key: "yak",
    label: "YAK",
    anchor: "detalle-yak",
    images: [
      ...g("yak", "Khulán", "khulan", [5137, 5147, 5164, 5228]),
      ...g("yak", "Nomín Azul Oscuro", "nomin-azul", [4556, 4609, 4773, 4828]),
      ...g("yak", "Nomín Negro", "nomin-negro", [6342, 6395, 6480, 6582]),
    ],
  },
  {
    key: "cashmere",
    label: "CASHMERE",
    anchor: "detalle-cashmere",
    images: [...g("cashmere", "Záya", "zaya", [4890, 4954, 5015, 5104])],
  },
  {
    key: "baby-camel",
    label: "BABY CAMEL",
    anchor: "detalle-baby-camel",
    images: [
      ...g("baby-camel", "Bolomaa", "bolomaa", [5497, 5651, 5572, 5765]),
      ...g("baby-camel", "Erdene", "erdene", [5968, 6153, 6178, 6318]),
      ...g("baby-camel", "Sernaí", "sernai", [5826, 5841, 5860, 5877]),
      ...g("baby-camel", "Sernaí Silk", "sernai-silk", [5995, 6029, 6032, 6248]),
    ],
  },
];
