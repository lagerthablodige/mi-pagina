import type { MetadataRoute } from "next";
import { productos, SITE } from "./products";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://www.nirun.cl",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    // Una página por prenda.
    ...productos.map((p) => ({
      url: `${SITE}/prenda/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
