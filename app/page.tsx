import Image from "next/image";
import Link from "next/link";
import BarraFija from "./BarraFija";
import Encabezado from "./Encabezado";
import Pie from "./Pie";
import TarjetaPrenda from "./TarjetaPrenda";
import TrackedLink from "./TrackedLink";
import ZoomableImage from "./ZoomableImage";
import { fibers } from "./fibersData";
import { WhatsAppIcon } from "./Iconos";
import { CALENDLY_HREF, INSTAGRAM_LANDA_HREF, WHATSAPP_HREF } from "./links";
import { nombreFibra, precioCLP, prendasDeFibra, productosEnOrden, type Producto } from "./products";

// Foto de ambiente de cada fibra (Pexels/Unsplash, ver docs/LICENCIAS-FOTOS.md). Solo ambiente: no son fotos de Nirün.
const FOTO_FIBRA: Record<string, { src: string; alt: string; pie: string }> = {
  yak: { src: "/origen/yak.jpg", alt: "Un yak negro pastando junto a un río, en un valle verde", pie: "Yak" },
  cashmere: { src: "/origen/cabras.jpg", alt: "Rebaño de cabras de cachemira en la estepa", pie: "Cabras de cachemira" },
  "baby-camel": { src: "/origen/camellos.jpg", alt: "Manada de camellos bactrianos de pelaje claro y oscuro", pie: "Camellos bactrianos" },
};

// Detalles del collage del showroom (con zoom). La posición enfoca lo importante al recortar en cuadrado.
const COLLAGE = [
  { src: "/fibers/collage/khulan_detail.jpg", alt: "Detalle del abrigo Khulán en yak, con el cinturón anudado", pos: "35% center" },
  { src: "/fibers/collage/zaya_detail.jpg", alt: "Detalle del cárdigan Záya en cashmere, de largo completo", pos: "62% center" },
  { src: "/fibers/collage/sernai_silk_detail.jpg", alt: "Detalle de la chaqueta Sernaí Silk, con botones de perla", pos: "35% center" },
  { src: "/fibers/collage/nomin_negro_detail.jpg", alt: "Detalle del abrigo Nomín negro en yak, con el cinturón", pos: "55% center" },
];

// Precio de una prenda en el índice de las fibras ("Sernaí Silk" son dos piezas: se muestra el precio más bajo).
function precioIndice(p: Producto): string {
  if (p.piezas.length === 1) return precioCLP(p.piezas[0].precio);
  return `Desde ${precioCLP(Math.min(...p.piezas.map((pz) => pz.precio)))}`;
}

export default function Home() {
  return (
    <>
      <Encabezado />
      <main id="contenido" tabIndex={-1}>
        {/* 1. Hero: la foto manda; solo el bloque de abajo lleva texto */}
        <section id="inicio" className="hero fondo-oscuro" aria-labelledby="titulo-hero">
          <div className="hero__fotos">
            <div className="hero__foto hero__foto--lateral">
              <Image
                src="/hero/cardigan.jpg"
                alt="Modelo con un cárdigan largo blanco y un bolso beige, de pie en una esquina de muros claros"
                fill
                sizes="44vw"
                quality={70}
                style={{ objectPosition: "center 12%" }}
              />
            </div>
            <div className="hero__foto hero__foto--centro">
              <Image
                src="/hero/columnas.jpg"
                alt="Modelo con un abrigo largo negro con cinturón, frente a un muro claro"
                fill
                priority
                fetchPriority="high"
                sizes="(min-width: 1024px) 44vw, 100vw"
                quality={75}
                className="hero__img-centro"
              />
            </div>
            <div className="hero__foto hero__foto--lateral">
              <Image
                src="/hero/rocas.jpg"
                alt="Modelo con un abrigo gris con cinturón y botines, frente a un muro claro"
                fill
                sizes="44vw"
                quality={70}
                style={{ objectPosition: "center 12%" }}
              />
            </div>
          </div>
          <div className="hero__velo" aria-hidden="true" />
          <div className="hero__texto">
            <p className="eyebrow">Showroom Landa Brands · Vitacura</p>
            <h1 id="titulo-hero" className="titulo-hero">
              Fibras nobles de Mongolia
            </h1>
            <p className="hero__bajada">
              Abrigos y prendas en Yak, Cashmere y Baby Camel. Pruébalas en persona, con cita.
            </p>
            <div className="hero__botones">
              <TrackedLink
                href={CALENDLY_HREF}
                eventName="calendly_click"
                eventData={{ location: "hero" }}
                target="_blank"
                rel="noopener noreferrer"
                className="boton boton--marfil"
              >
                Agenda tu visita
              </TrackedLink>
              <TrackedLink
                href={WHATSAPP_HREF}
                eventName="whatsapp_click"
                eventData={{ location: "hero" }}
                target="_blank"
                rel="noopener noreferrer"
                className="boton boton--contorno-marfil"
              >
                <WhatsAppIcon color="currentColor" size={20} />
                WhatsApp
              </TrackedLink>
            </div>
          </div>
        </section>

        {/* 2. Colección */}
        <section id="coleccion" className="seccion" aria-labelledby="titulo-coleccion">
          <div className="contenedor">
            <header className="cabecera aparece">
              <h2 id="titulo-coleccion" className="titulo-seccion">
                La colección
              </h2>
              <p className="cabecera__nota">Precios en pesos chilenos, IVA incluido.</p>
            </header>
            <div className="grilla-prendas">
              {productosEnOrden.map((producto) => (
                <div key={producto.slug} className="aparece">
                  <TarjetaPrenda producto={producto} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. Origen: el momento de impacto (la foto va limpia; la frase, debajo) */}
        <section id="origen" aria-labelledby="titulo-origen">
          <figure className="origen__foto fondo-oscuro">
            <Image
              src="/origen/ger-amanecer.jpg"
              alt="Una ger solitaria en la estepa de Mongolia, bajo nubes rosadas al amanecer"
              fill
              sizes="(min-width: 1024px) 100vw, 250vw"
              quality={75}
              className="origen__img"
            />
            <figcaption className="origen__pie">Mongolia</figcaption>
          </figure>
          <div className="seccion seccion--crema">
            <div className="contenedor contenedor--texto aparece">
              <h2 id="titulo-origen" className="eyebrow eyebrow--dorado">
                Lujo silencioso
              </h2>
              <p className="origen__frase-texto">
                En las estepas de Mongolia, donde el clima alcanza extremos y la naturaleza define el ritmo de la vida, nace
                una de las fibras más nobles del mundo.
              </p>
              <p className="origen__parrafo">
                Detrás de cada prenda hay manos expertas, principalmente mujeres, cuyo trabajo no solo da forma a la
                fibra, sino que sostiene comunidades y tradiciones. Cada pieza es ligera, cálida y duradera: una suavidad
                que no se impone, se percibe.
              </p>
              <p className="origen__cursiva">
                Nirün, en el antiguo idioma mongol, significa «linaje puro». En la cultura mongol, los Nirün eran la
                aristocracia.
              </p>
            </div>
          </div>
        </section>

        {/* 4. Las fibras: tres capítulos con su índice de prendas */}
        <section id="fibras" className="seccion" aria-labelledby="titulo-fibras">
          <div className="contenedor">
            <header className="cabecera aparece">
              <p className="eyebrow cabecera__eyebrow">Las fibras</p>
              <h2 id="titulo-fibras" className="titulo-seccion">
                Tres fibras de Mongolia
              </h2>
            </header>

            {fibers.map((fibra, i) => {
              const foto = FOTO_FIBRA[fibra.key];
              const nombre = nombreFibra(fibra);
              return (
                <article
                  key={fibra.key}
                  id={fibra.anchor}
                  className={`capitulo${i % 2 === 1 ? " capitulo--invertido" : ""}`}
                  aria-label={nombre}
                >
                  <div className="capitulo__texto aparece">
                    <p className="eyebrow eyebrow--dorado capitulo__numero" aria-hidden="true">
                      {String(i + 1).padStart(2, "0")} / {String(fibers.length).padStart(2, "0")}
                    </p>
                    <h3 className="capitulo__nombre">{nombre}</h3>
                    <p className="parrafo">{fibra.intro}</p>
                  </div>
                  <figure className="capitulo__foto aparece">
                    <div className="capitulo__marco">
                      <Image src={foto.src} alt={foto.alt} fill sizes="(min-width: 1024px) 46vw, 100vw" quality={75} />
                    </div>
                    <figcaption>{foto.pie}</figcaption>
                  </figure>
                  <div className="capitulo__indice aparece">
                    <ul className="indice" aria-label={`Prendas en ${nombre}`}>
                      {prendasDeFibra(fibra).map((p) => (
                        <li key={p.slug}>
                          <Link href={`/prenda/${p.slug}`} className="indice__fila">
                            <span className="indice__nombre">{p.nombreCorto}</span>
                            <span className="precio">{precioIndice(p)}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* 5. Showroom */}
        <section id="showroom" className="seccion seccion--crema" aria-labelledby="titulo-showroom">
          <div className="contenedor showroom">
            <div className="showroom__texto aparece">
              <p className="eyebrow eyebrow--dorado">Nirün × Landa Brands</p>
              <h2 id="titulo-showroom" className="titulo-seccion">
                Descubre Nirün en persona
              </h2>
              <p className="parrafo">
                Te invitamos a descubrir y probar nuestras prendas en el showroom de Landa Brands, en Vitacura. La caída
                de una fibra como esta se entiende de verdad al tocarla.
              </p>
              <p className="showroom__datos" data-clarity-unmask="true">
                <span className="showroom__cita">Solo con cita</span>
                <a href={INSTAGRAM_LANDA_HREF} target="_blank" rel="noopener noreferrer">
                  @landa_brands
                </a>
              </p>
              <div className="showroom__botones">
                <TrackedLink
                  href={CALENDLY_HREF}
                  eventName="calendly_click"
                  eventData={{ location: "showroom" }}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="boton boton--tinta"
                >
                  Agenda tu visita
                </TrackedLink>
                <TrackedLink
                  href={WHATSAPP_HREF}
                  eventName="whatsapp_click"
                  eventData={{ location: "showroom" }}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="boton boton--contorno"
                >
                  <WhatsAppIcon color="currentColor" size={20} />
                  Escríbenos por WhatsApp
                </TrackedLink>
              </div>
            </div>
            <div className="showroom__collage aparece">
              {COLLAGE.map((img) => (
                <div key={img.src} className="showroom__detalle">
                  <ZoomableImage src={img.src} alt={img.alt} sizes="(min-width: 1024px) 31vw, 70vw" objectPosition={img.pos} />
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Pie />
      <BarraFija modo="inicio" whatsappHref={WHATSAPP_HREF} ubicacionAgenda="sticky_mobile" ubicacionWhatsapp="sticky_mobile" />
    </>
  );
}
