import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import BarraFija from "./BarraFija";
import Encabezado from "./Encabezado";
import Pie from "./Pie";
import PrecioPiezas from "./PrecioPiezas";
import TarjetaPrenda from "./TarjetaPrenda";
import TrackedLink from "./TrackedLink";
import ZoomableImage from "./ZoomableImage";
import { fibers } from "./fibersData";
import { CALENDLY_HREF, INSTAGRAM_LANDA_HREF, WHATSAPP_HREF } from "./links";
import { articuloDe, fibraDe, nombreFibra, prendasDeFibra, productoPorSlug, productosEnOrden } from "./products";

// El canonical va en cada página (el layout no lo hereda): así una página nueva no apunta al inicio por error.
// Sin openGraph aquí, para no reemplazar el del layout.
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

// Foto de ambiente de cada fibra (Pexels/Unsplash, ver docs/LICENCIAS-FOTOS.md). Solo ambiente: no son fotos de Nirün.
const FOTO_FIBRA: Record<string, { src: string; alt: string }> = {
  yak: { src: "/origen/yak.jpg", alt: "Dos yaks negros pastando junto a un río, en un valle" },
  cashmere: { src: "/origen/cabras.jpg", alt: "Rebaño de cabras en la estepa" },
  "baby-camel": { src: "/origen/camellos.jpg", alt: "Manada de camellos bactrianos de pelaje claro y oscuro" },
};

// Alt del detalle de Záya: "Záya de cerca: el punto en relieve del <tipo> de <fibra>".
// El tipo y la fibra salen de products.ts (el nombre de la prenda sigue pendiente del dueño).
function altDetalleZaya(): string {
  const zaya = productoPorSlug("zaya");
  if (!zaya) return "Detalle de cerca del punto en relieve"; // respaldo si algún día cambia el slug
  const tipo = zaya.tipo.split(" ")[0].toLowerCase();
  const articulo = articuloDe(zaya);
  const de = articulo === "el" ? "del" : `de ${articulo}`;
  return `${zaya.nombreCorto} de cerca: el punto en relieve ${de} ${tipo} de ${nombreFibra(fibraDe(zaya)).toLowerCase()}`;
}

// Detalles del collage del showroom (con zoom). La posición enfoca lo importante al recortar en cuadrado.
const COLLAGE = [
  { src: "/fibers/collage/khulan_detail.jpg", alt: "Detalle del abrigo Khulán en yak, con el cinturón anudado", pos: "35% center" },
  { src: "/fibers/collage/zaya_detail.jpg", alt: altDetalleZaya(), pos: "62% center" },
  { src: "/fibers/collage/sernai_silk_detail.jpg", alt: "Chaqueta Sernaí de cerca, con cuello chal y botones perlados", pos: "35% center" },
  { src: "/fibers/collage/nomin_negro_detail.jpg", alt: "Detalle del abrigo Nomín negro en yak, con el cinturón", pos: "55% center" },
];

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
            {/* Una sola bajada para todos los anchos. Si no cabe en una línea, se corta entre las dos frases. */}
            <p className="hero__bajada">
              <span className="hero__frase">Yak, cashmere y baby&nbsp;camel.</span>{" "}
              <span className="hero__frase">Solo con&nbsp;cita.</span>
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
              <p className="cabecera__nota">Precios en pesos chilenos.</p>
            </header>
            <div className="grilla-prendas">
              {/* Las tarjetas siempre se ven (sin aparición). El id permite volver desde la ficha a /#slug. */}
              {productosEnOrden.map((producto) => (
                <div key={producto.slug} id={producto.slug}>
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
              {/* Ancla del sitio anterior (/#lujo-silencioso), sin efecto visual */}
              <span id="lujo-silencioso" aria-hidden="true" />
              <h2 id="titulo-origen" className="eyebrow eyebrow--dorado">
                Lujo silencioso
              </h2>
              <p className="origen__frase-texto">
                En las estepas de Mongolia, donde&nbsp;el clima alcanza extremos y la naturaleza define el ritmo de la vida,
                nacen&nbsp;algunas de las fibras más nobles del mundo.
              </p>
              <p className="origen__parrafo">
                Detrás de cada prenda hay manos expertas, principalmente mujeres, cuyo trabajo no solo da forma a la
                fibra, sino que sostiene comunidades y tradiciones.
              </p>
              <p className="origen__frase-texto origen__remate">Una suavidad que no se impone, se percibe.</p>
              <p className="origen__cursiva">
                En mongol antiguo, Nirün significa «linaje puro» o «de sangre noble». Así se conocía a la aristocracia
                mongola.
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
                    {fibra.caracter && <p className="capitulo__caracter">{fibra.caracter}.</p>}
                    <p className="parrafo">{fibra.intro}</p>
                  </div>
                  <figure className="capitulo__foto aparece">
                    <div className="capitulo__marco">
                      <Image
                        src={foto.src}
                        alt={foto.alt}
                        fill
                        sizes="(min-width: 1024px) 54vw, calc(100vw - 40px)"
                        quality={75}
                      />
                    </div>
                  </figure>
                  <div className="capitulo__indice aparece">
                    <ul className="indice" aria-label={`Prendas en ${nombre}`}>
                      {prendasDeFibra(fibra).map((p) => (
                        <li key={p.slug}>
                          <Link href={`/prenda/${p.slug}`} className="indice__fila">
                            <span className="indice__nombre">{p.nombreCorto}</span>
                            <span className="precio indice__precio">
                              <PrecioPiezas producto={p} />
                            </span>
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
          {/* Ancla del sitio anterior (/#landa), sin efecto visual */}
          <span id="landa" aria-hidden="true" />
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
                <TrackedLink
                  href={INSTAGRAM_LANDA_HREF}
                  eventName="instagram_click"
                  eventData={{ location: "showroom" }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  @landa_brands
                </TrackedLink>
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
                  WhatsApp
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
