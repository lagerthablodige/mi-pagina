import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Encabezado from "../../Encabezado";
import FichaCompra from "../../FichaCompra";
import GaleriaPrenda from "../../GaleriaPrenda";
import Pie from "../../Pie";
import TarjetaPrenda from "../../TarjetaPrenda";
import { imagenCompartir } from "../../compartir";
import {
  SITE,
  altDeFoto,
  etiquetaPieza,
  fibraDe,
  fotosDe,
  masEnLaFibra,
  nombreFibra,
  otrasPrendas,
  precioCLP,
  productoPorSlug,
  productos,
  tituloSeoDe,
  type Producto,
} from "../../products";

type Props = { params: Promise<{ slug: string }> };

// Las 8 páginas se generan al construir el sitio.
export function generateStaticParams() {
  return productos.map((p) => ({ slug: p.slug }));
}

const CIERRE = "Para probar con cita en el showroom de Landa Brands, Vitacura.";

// Descripción para Google (meta description).
function descripcionSeo(p: Producto) {
  if (p.piezas.length === 1) {
    const [pz] = p.piezas;
    return `${p.nombre}: ${pz.material}, color ${pz.color.toLowerCase()}. ${precioCLP(pz.precio)} (IVA incluido). ${CIERRE}`;
  }
  const lista = p.piezas.map((pz) => `${pz.nombre} en ${pz.material} (${precioCLP(pz.precio)})`).join(" y ");
  return `${lista}, color ${p.piezas[0].color.toLowerCase()}. Se venden por separado; precios con IVA incluido. ${CIERRE}`;
}

// Texto de la vista previa al compartir (WhatsApp, Instagram, iMessage). No repite el nombre, que ya va en el título,
// así el precio no queda cortado. En las prendas de varias piezas, la fibra sale de fibersData (sin «y seda»
// hasta que la etiqueta de la chaqueta lo confirme).
function descripcionCompartir(p: Producto) {
  if (p.piezas.length === 1) {
    const [pz] = p.piezas;
    return `${pz.material}, color ${pz.color.toLowerCase()}. ${precioCLP(pz.precio)} (IVA incluido). ${CIERRE}`;
  }
  const fibra = nombreFibra(fibraDe(p)).toLowerCase();
  const lista = p.piezas
    .map((pz, i) => {
      const pieza = etiquetaPieza(pz);
      return `${i === 0 ? pieza : pieza.toLowerCase()} en ${fibra} (${precioCLP(pz.precio)})`;
    })
    .join(" y ");
  return `${lista}, color ${p.piezas[0].color.toLowerCase()}. Se venden por separado, IVA incluido. ${CIERRE}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = productoPorSlug(slug);
  if (!p) return {};
  // El título nombra la prenda y su fibra; sale de products.ts (campo tituloSeo, o el nombre y la fibra).
  const title = `${tituloSeoDe(p)} | Nirün`;
  const description = descripcionSeo(p);
  const compartir = descripcionCompartir(p);
  const imagen = imagenCompartir(p);
  return {
    title,
    description,
    alternates: { canonical: `/prenda/${p.slug}` },
    openGraph: {
      title,
      description: compartir,
      url: `/prenda/${p.slug}`,
      siteName: "Nirün",
      locale: "es_CL",
      type: "website",
      images: [imagen],
    },
    twitter: { card: "summary_large_image", title, description: compartir, images: [imagen] },
  };
}

// ---------- Datos estructurados para Google ----------
// Sin reseñas ni ratings. Sin disponibilidad: el stock no se conoce (hay 1 unidad por talla y la clienta pregunta por WhatsApp).
// Sin vendedor (seller) hasta que el dueño confirme quién vende y entrega la boleta (M19).
const MARCA = { "@type": "Brand", name: "Nirün" };
const SHOWROOM = { "@type": "ClothingStore", "@id": `${SITE}/#showroom`, name: "Nirün en el showroom de Landa Brands" };

function oferta(url: string, precio: number) {
  return {
    "@type": "Offer",
    url,
    price: precio,
    priceCurrency: "CLP",
    itemCondition: "https://schema.org/NewCondition",
    availableAtOrFrom: SHOWROOM,
  };
}

const urlDe = (p: Producto) => `${SITE}/prenda/${p.slug}`;
const absolutas = (fotos: string[]) => fotos.map((f) => `${SITE}${f}`);
// "Chaqueta Sernaí" -> "chaqueta" (para el @id y el sku de cada pieza).
const claveDePieza = (nombre: string) =>
  nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

// Fotos en el orden de su ficha, con la portada primero (igual que la galería, M07).
function fotosEnOrden(p: Producto) {
  const fotos = fotosDe(p);
  return fotos.map((_, i) => fotos[(i + p.portada) % fotos.length]);
}

// `fotos`: las fotos de la ficha actual, en el orden de su galería.
function datosEstructurados(p: Producto, fotos: string[]) {
  // Nomín: las dos fichas publican el mismo grupo, con un color por variante.
  const otro = p.otroColor ? productoPorSlug(p.otroColor.slug) : undefined;
  if (otro) {
    // Orden fijo (el del catálogo), para que las dos fichas publiquen el grupo idéntico.
    const variantes = productos.filter((x) => x.slug === p.slug || x.slug === otro.slug);
    return [
      {
        "@context": "https://schema.org",
        "@type": "ProductGroup",
        "@id": `${urlDe(variantes[0])}#grupo`,
        productGroupID: p.slug.split("-")[0], // "nomin"
        name: p.nombre,
        brand: MARCA,
        material: p.piezas[0].material,
        variesBy: ["https://schema.org/color"],
        hasVariant: variantes.map((x) => {
          const [pz] = x.piezas;
          const url = urlDe(x);
          return {
            "@type": "Product",
            "@id": `${url}#producto`,
            sku: x.slug,
            name: `${x.nombre} ${pz.color.toLowerCase()}`,
            description: descripcionSeo(x),
            image: absolutas(x.slug === p.slug ? fotos : fotosEnOrden(x)),
            color: pz.color,
            url,
            offers: oferta(url, pz.precio),
          };
        }),
      },
    ];
  }

  // Un Product por pieza. Sernaí Silk son dos piezas que se venden por separado: #chaqueta y #falda.
  const url = urlDe(p);
  const varias = p.piezas.length > 1;
  return p.piezas.map((pz) => {
    const clave = claveDePieza(etiquetaPieza(pz));
    return {
      "@context": "https://schema.org",
      "@type": "Product",
      "@id": `${url}#${varias ? clave : "producto"}`,
      sku: varias ? `${p.slug}-${clave}` : p.slug,
      name: pz.nombre,
      description: varias
        ? `${pz.nombre} en ${pz.material}, color ${pz.color.toLowerCase()}. Pieza de ${p.nombreCorto}, se vende por separado.`
        : descripcionSeo(p),
      image: absolutas(fotos),
      brand: MARCA,
      material: pz.material,
      color: pz.color,
      url,
      offers: oferta(url, pz.precio),
    };
  });
}

export default async function PaginaPrenda({ params }: Props) {
  const { slug } = await params;
  const producto = productoPorSlug(slug);
  if (!producto) notFound();

  const fibra = fibraDe(producto);
  const fotos = fotosDe(producto);
  // Si la fibra no tiene más prendas (Záya), se muestran prendas de otras fibras.
  const masDeLaFibra = masEnLaFibra(producto);
  const otras = masDeLaFibra.length > 0 ? masDeLaFibra : otrasPrendas(producto);
  const tituloOtras = masDeLaFibra.length > 0 ? `Más en ${nombreFibra(fibra)}` : "Otras prendas";
  const jsonLd = datosEstructurados(producto, fotos);

  return (
    <>
      <Encabezado volver={{ href: "/#coleccion", texto: "Colección" }} />
      <main id="contenido" tabIndex={-1}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />

        <div className="ficha__volver">
          <Link href="/#coleccion">
            <svg width="18" height="12" viewBox="0 0 18 12" fill="none" aria-hidden="true">
              <path d="M17 6H1M5.5 1.5 1 6l4.5 4.5" stroke="currentColor" strokeWidth="1.2" />
            </svg>
            Colección
          </Link>
        </div>

        <div className="ficha">
          <GaleriaPrenda fotos={fotos.map((src, n) => ({ src, alt: altDeFoto(producto, n, fotos.length) }))} />
          <FichaCompra
            producto={producto}
            fibraLabel={fibra.label}
            fibraNombre={nombreFibra(fibra)}
            fibraIntro={fibra.intro}
          />
        </div>

        {otras.length > 0 && (
          <section className="seccion seccion--crema seccion--mas" aria-labelledby="mas-en-fibra">
            <div className="contenedor">
              <header className="cabecera aparece">
                <h2 id="mas-en-fibra" className="titulo-seccion titulo-seccion--chico">
                  {tituloOtras}
                </h2>
              </header>
              <div className="grilla-prendas grilla-prendas--mas">
                {otras.map((o) => (
                  <div key={o.slug} className="aparece">
                    <TarjetaPrenda producto={o} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Pie />
    </>
  );
}
