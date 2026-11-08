import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Encabezado from "../../Encabezado";
import FichaCompra from "../../FichaCompra";
import GaleriaPrenda from "../../GaleriaPrenda";
import Pie from "../../Pie";
import TarjetaPrenda from "../../TarjetaPrenda";
import { whatsappConMensaje } from "../../links";
import {
  SITE,
  altDeFoto,
  fibraDe,
  fotosDe,
  masEnLaFibra,
  mensajeWhatsApp,
  nombreFibra,
  otrasPrendas,
  precioCLP,
  productoPorSlug,
  productos,
  type Producto,
} from "../../products";

type Props = { params: Promise<{ slug: string }> };

// Las 8 páginas se generan al construir el sitio.
export function generateStaticParams() {
  return productos.map((p) => ({ slug: p.slug }));
}

// Nomín tiene el mismo nombre en dos colores: el color va en el título para que no se repitan.
function tituloSeo(p: Producto) {
  return p.otroColor ? `${p.nombre} ${p.piezas[0].color.toLowerCase()}` : p.nombre;
}

function descripcionSeo(p: Producto) {
  const cierre = "Para probar con cita en el showroom de Landa Brands, Vitacura.";
  if (p.piezas.length === 1) {
    const [pz] = p.piezas;
    return `${p.nombre}: ${pz.material}, color ${pz.color.toLowerCase()}. ${precioCLP(pz.precio)} (IVA incluido). ${cierre}`;
  }
  const lista = p.piezas.map((pz) => `${pz.nombre} en ${pz.material} (${precioCLP(pz.precio)})`).join(" y ");
  return `${lista}, color ${p.piezas[0].color.toLowerCase()}. Se venden por separado; precios con IVA incluido. ${cierre}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = productoPorSlug(slug);
  if (!p) return {};
  const title = `${tituloSeo(p)} | Nirün`;
  const description = descripcionSeo(p);
  return {
    title,
    description,
    alternates: { canonical: `/prenda/${p.slug}` },
    openGraph: {
      title,
      description,
      url: `/prenda/${p.slug}`,
      siteName: "Nirün",
      locale: "es_CL",
      type: "website",
      // Foto ligera de la marca (las fotos de las prendas pesan ~1 MB y WhatsApp/Instagram descartan imágenes pesadas).
      images: [{ url: "/og/nirun-og.jpg", width: 1200, height: 630, alt: "Abrigo cruzado Nirün en lana y yak, detalle del tejido", type: "image/jpeg" }],
    },
    twitter: { card: "summary_large_image", title, description, images: ["/og/nirun-og.jpg"] },
  };
}

// Datos estructurados Product (uno por pieza). Sin reseñas ni ratings.
function datosEstructurados(p: Producto, fotos: string[]) {
  const url = `${SITE}/prenda/${p.slug}`;
  return p.piezas.map((pz) => ({
    "@context": "https://schema.org",
    "@type": "Product",
    name: pz.nombre,
    description:
      p.piezas.length === 1
        ? descripcionSeo(p)
        : `${pz.nombre} en ${pz.material}, color ${pz.color.toLowerCase()}. Pieza de Sernaí Silk, se vende por separado.`,
    image: fotos.map((f) => `${SITE}${f}`),
    brand: { "@type": "Brand", name: "Nirün" },
    material: pz.material,
    color: pz.color,
    url,
    offers: {
      "@type": "Offer",
      url,
      price: String(pz.precio),
      priceCurrency: "CLP",
      availability: "https://schema.org/InStock",
    },
  }));
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
  // WhatsApp del encabezado, del menú y del pie: el mensaje de esta prenda, con el enlace a la ficha.
  const waFicha = whatsappConMensaje(mensajeWhatsApp(producto));

  return (
    <>
      {/* "Colección" vuelve a la tarjeta de esta prenda en la grilla del inicio (id por tarjeta de M10). */}
      <Encabezado volver={{ href: `/#${producto.slug}`, texto: "Colección" }} whatsappHref={waFicha} />
      <main id="contenido" tabIndex={-1}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />

        <div className="ficha__volver">
          <Link href={`/#${producto.slug}`}>
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
            fibraCaracter={fibra.caracter}
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
                  <div key={o.slug}>
                    <TarjetaPrenda producto={o} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Pie whatsappHref={waFicha} />
    </>
  );
}
