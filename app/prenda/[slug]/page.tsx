import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Cormorant_Garamond } from "next/font/google";
import TrackedLink from "../../TrackedLink";
import ZoomableImage from "../../ZoomableImage";
import { WhatsAppIcon, InstagramIcon } from "../../Iconos";
import { GOLD_TEXT } from "../../marca";
import { CALENDLY_HREF, whatsappConMensaje } from "../../links";
import {
  SITE,
  fibraDe,
  fotosDe,
  masEnLaFibra,
  mensajeWhatsApp,
  precioCLP,
  productoPorSlug,
  productos,
  type Pieza,
  type Producto,
} from "../../products";

const elegant = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500", "600"] });

type Props = { params: Promise<{ slug: string }> };

// Las 8 páginas se generan al construir el sitio.
export function generateStaticParams() {
  return productos.map((p) => ({ slug: p.slug }));
}

const FRASE_SHOWROOM = "Disponible para probar en el showroom de Landa Brands, Vitacura · solo con cita";

// "BABY CAMEL" -> "Baby Camel"
function titulo(texto: string) {
  return texto
    .toLowerCase()
    .split(" ")
    .map((palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1))
    .join(" ");
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

function Tallas({ tallas }: { tallas: string[] }) {
  return (
    <ul aria-label="Tallas" style={{ listStyle: "none", display: "flex", flexWrap: "wrap", gap: "0.5rem", margin: 0, padding: 0 }}>
      {tallas.map((talla) => (
        <li
          key={talla}
          style={{
            minWidth: "2.9rem",
            height: "2.6rem",
            padding: "0 0.9rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid rgba(26,26,26,0.4)",
            color: "#1a1a1a",
            fontSize: "0.88rem",
            letterSpacing: "0.08em",
          }}
        >
          {talla}
        </li>
      ))}
    </ul>
  );
}

function Dato({ etiqueta, children }: { etiqueta: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", gap: "1rem", alignItems: "baseline", padding: "0.85rem 0", borderTop: "1px solid rgba(184,148,95,0.35)" }}>
      <dt style={{ flex: "0 0 5.2rem", fontSize: "0.72rem", letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD_TEXT }}>
        {etiqueta}
      </dt>
      <dd style={{ margin: 0, flex: 1, fontSize: "1rem", color: "#1a1a1a", lineHeight: 1.5 }}>{children}</dd>
    </div>
  );
}

function Precio({ pieza, grande = true }: { pieza: Pieza; grande?: boolean }) {
  return (
    <p style={{ margin: 0, display: "flex", alignItems: "baseline", flexWrap: "wrap", gap: "0.6rem" }}>
      <span className={elegant.className} style={{ fontSize: grande ? "2.6rem" : "2rem", fontWeight: 500, color: "#1a1a1a", lineHeight: 1.1 }}>
        {precioCLP(pieza.precio)}
      </span>
      <span style={{ fontSize: "0.85rem", letterSpacing: "0.06em", color: "#555" }}>IVA incluido</span>
    </p>
  );
}

export default async function PaginaPrenda({ params }: Props) {
  const { slug } = await params;
  const producto = productoPorSlug(slug);
  if (!producto) notFound();

  const fibra = fibraDe(producto);
  const fotos = fotosDe(producto);
  const otras = masEnLaFibra(producto);
  const unaPieza = producto.piezas.length === 1;
  const waHref = whatsappConMensaje(mensajeWhatsApp(producto));
  const volverHref = `/#${fibra.anchor}`;
  const jsonLd = datosEstructurados(producto, fotos);

  return (
    <main style={{ backgroundColor: "#fafaf8", fontFamily: "Georgia, serif", color: "#1a1a1a" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <header
        style={{ backgroundColor: "#1a1a1a", textAlign: "center", padding: "1.1rem 1rem", borderBottom: "1px solid rgba(184,148,95,0.25)" }}
      >
        <Link
          href="/"
          aria-label="Nirün, ir al inicio"
          className={elegant.className}
          style={{ color: "#f5f0e8", fontSize: "1.5rem", fontWeight: 500, letterSpacing: "0.3em", paddingLeft: "0.3em", textDecoration: "none" }}
        >
          NIRÜN
        </Link>
      </header>

      <div className="prenda-volver">
        <Link
          href={volverHref}
          style={{
            display: "inline-block",
            padding: "1rem 0",
            color: "#1a1a1a",
            fontSize: "0.78rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            textDecoration: "none",
          }}
        >
          ← Volver a la colección
        </Link>
      </div>

      <div className="prenda-contenido">
        <div>
          <div className="prenda-galeria">
            {fotos.map((src, n) => (
              <div key={src} className="prenda-foto">
                <ZoomableImage
                  src={src}
                  alt={`${producto.nombre}, foto ${n + 1} de ${fotos.length}`}
                  sizes="(max-width: 768px) 80vw, 340px"
                  priority={n === 0}
                />
              </div>
            ))}
          </div>
          <p
            className="only-mobile"
            style={{ margin: "0.7rem 0 0", textAlign: "center", fontSize: "0.7rem", letterSpacing: "0.18em", textTransform: "uppercase", color: GOLD_TEXT }}
          >
            Desliza para ver más · toca para ampliar
          </p>
        </div>

        <div className="prenda-info">
          <p style={{ margin: "0 0 0.7rem", fontSize: "0.8rem", letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD_TEXT }}>
            {fibra.label}
          </p>
          <h1
            className={elegant.className}
            style={{ margin: "0 0 1.2rem", fontSize: "clamp(2rem, 6vw, 2.7rem)", fontWeight: 500, lineHeight: 1.15, color: "#1a1a1a", textWrap: "balance" }}
          >
            {producto.nombre}
          </h1>

          {unaPieza ? (
            <>
              <Precio pieza={producto.piezas[0]} />
              <dl style={{ margin: "1.6rem 0 0", borderBottom: "1px solid rgba(184,148,95,0.35)" }}>
                <Dato etiqueta="Material">{producto.piezas[0].material}</Dato>
                <Dato etiqueta="Color">
                  {producto.piezas[0].color}
                  {producto.otroColor && (
                    <>
                      <br />
                      <Link
                        href={`/prenda/${producto.otroColor.slug}`}
                        style={{ display: "inline-block", padding: "0.5rem 0 0.1rem", color: GOLD_TEXT, fontSize: "0.9rem", textDecoration: "underline", textUnderlineOffset: "4px" }}
                      >
                        También en {producto.otroColor.color} →
                      </Link>
                    </>
                  )}
                </Dato>
                <Dato etiqueta="Tallas">
                  <Tallas tallas={producto.piezas[0].tallas} />
                </Dato>
              </dl>
            </>
          ) : (
            <>
              <p style={{ margin: "0 0 1.4rem", fontSize: "1rem", lineHeight: 1.6, color: "#444" }}>
                Dos piezas que se venden por separado. Cada una tiene su precio.
              </p>
              {producto.piezas.map((pz, i) => (
                <section
                  key={pz.nombre}
                  aria-labelledby={`pieza-${i}`}
                  style={{ backgroundColor: "#f1efe9", border: "1px solid rgba(184,148,95,0.4)", padding: "1.3rem 1.2rem 0.6rem", marginBottom: "1rem" }}
                >
                  <h2
                    id={`pieza-${i}`}
                    className={elegant.className}
                    style={{ margin: "0 0 0.5rem", fontSize: "1.6rem", fontWeight: 500, color: "#1a1a1a" }}
                  >
                    {pz.nombre}
                  </h2>
                  <Precio pieza={pz} grande={false} />
                  <dl style={{ margin: "1.1rem 0 0" }}>
                    <Dato etiqueta="Material">{pz.material}</Dato>
                    <Dato etiqueta="Color">{pz.color}</Dato>
                    <Dato etiqueta="Tallas">
                      <Tallas tallas={pz.tallas} />
                    </Dato>
                  </dl>
                </section>
              ))}
            </>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem", margin: "2rem 0 1.2rem" }}>
            <TrackedLink
              href={CALENDLY_HREF}
              eventName="calendly_click"
              eventData={{ location: `prenda_${producto.slug}` }}
              target="_blank"
              rel="noopener noreferrer"
              className="prenda-btn prenda-btn-principal"
            >
              Agenda tu visita para probártela
            </TrackedLink>
            <TrackedLink
              href={waHref}
              eventName="whatsapp_click"
              eventData={{ location: `prenda_${producto.slug}` }}
              target="_blank"
              rel="noopener noreferrer"
              className="prenda-btn prenda-btn-secundario"
            >
              <WhatsAppIcon color="currentColor" size={20} />
              Consultar por WhatsApp
            </TrackedLink>
          </div>

          <p style={{ margin: "0 0 2rem", fontSize: "0.92rem", lineHeight: 1.6, color: "#444" }}>{FRASE_SHOWROOM}</p>

          <p style={{ margin: "0 0 0.6rem", fontSize: "0.72rem", letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD_TEXT }}>
            Sobre el {titulo(fibra.label)}
          </p>
          <p style={{ margin: 0, fontSize: "0.95rem", lineHeight: 1.75, color: "#444" }}>{fibra.intro}</p>
        </div>
      </div>

      {otras.length > 0 && (
        <section
          aria-labelledby="mas-en-fibra"
          style={{ backgroundColor: "#f1efe9", padding: "3rem 1.5rem 3.2rem", borderTop: "1px solid rgba(184,148,95,0.35)" }}
        >
          <h2
            id="mas-en-fibra"
            style={{ margin: "0 0 1.8rem", textAlign: "center", fontSize: "0.9rem", fontWeight: 400, letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD_TEXT }}
          >
            Más en {fibra.label}
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "1rem", maxWidth: "1000px", margin: "0 auto" }}>
            {otras.map((o) => (
              <Link key={o.slug} href={`/prenda/${o.slug}`} className="mas-card">
                <div style={{ position: "relative", aspectRatio: "2 / 3", backgroundColor: "#ece9e1", marginBottom: "0.8rem" }}>
                  <Image
                    src={fotosDe(o)[0]}
                    alt={o.nombre}
                    fill
                    sizes="(max-width: 768px) 45vw, 220px"
                    style={{ objectFit: "cover", objectPosition: "center 12%" }}
                  />
                </div>
                <p className={elegant.className} style={{ margin: "0 0 0.25rem", fontSize: "1.2rem", fontWeight: 500, lineHeight: 1.25 }}>
                  {o.nombre}
                </p>
                {o.piezas.map((pz) => (
                  <p key={pz.nombre} style={{ margin: 0, fontSize: "0.88rem", color: "#444" }}>
                    {o.piezas.length > 1 ? `${pz.nombre} · ` : ""}
                    {precioCLP(pz.precio)}
                  </p>
                ))}
                <p style={{ margin: "0.1rem 0 0", fontSize: "0.75rem", color: "#555" }}>IVA incluido</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div style={{ textAlign: "center", padding: "1.2rem 1rem 1.6rem", backgroundColor: otras.length > 0 ? "#f1efe9" : "#fafaf8" }}>
        <Link
          href={volverHref}
          style={{ display: "inline-block", padding: "0.9rem 0.5rem", color: "#1a1a1a", fontSize: "0.78rem", letterSpacing: "0.18em", textTransform: "uppercase", textDecoration: "none" }}
        >
          ← Volver a la colección
        </Link>
      </div>

      <footer className="nirun-footer" style={{ textAlign: "center", padding: "3rem 2rem", backgroundColor: "#1a1a1a" }}>
        <p className={elegant.className} style={{ margin: 0, fontSize: "1.3rem", letterSpacing: "0.1em", color: "#f5f0e8", lineHeight: 1.8 }}>
          Mongolia como origen. El lujo como visión.
        </p>
      </footer>

      <div
        className="only-mobile"
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 90,
          backgroundColor: "rgba(26,26,26,0.96)",
          borderTop: "1px solid rgba(184,148,95,0.35)",
          padding: "0.6rem 1rem calc(0.6rem + env(safe-area-inset-bottom))",
        }}
      >
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "stretch" }}>
          <TrackedLink
            href={CALENDLY_HREF}
            eventName="calendly_click"
            eventData={{ location: `prenda_${producto.slug}_sticky` }}
            target="_blank"
            rel="noopener noreferrer"
            className="sticky-agenda"
          >
            Agenda tu visita
          </TrackedLink>
          <TrackedLink
            href={waHref}
            eventName="whatsapp_click"
            eventData={{ location: `prenda_${producto.slug}_sticky` }}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Consultar esta prenda por WhatsApp"
            className="sticky-wa"
          >
            <WhatsAppIcon color="#1a1a1a" />
            <span>WhatsApp</span>
          </TrackedLink>
          <a
            href="https://www.instagram.com/nirun.cl/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram de Nirün"
            className="sticky-ig"
          >
            <InstagramIcon />
          </a>
        </div>
      </div>
    </main>
  );
}
