import Image from "next/image";
import Link from "next/link";
import { Cormorant_Garamond } from "next/font/google";
import Vitrina from "./Vitrina";
import TrackedLink from "./TrackedLink";
import NewsletterForm from "./NewsletterForm";
import ZoomableImage from "./ZoomableImage";
import { fibers } from "./fibersData";
import { WHATSAPP_HREF, CALENDLY_HREF } from "./links";
import { WhatsAppIcon, InstagramIcon } from "./Iconos";
import { GOLD_TEXT } from "./marca";
import { precioCLP, productoDePrenda } from "./products";

const elegant = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500", "600"] });

const cornerStyle = (
  top?: number,
  bottom?: number,
  left?: number,
  right?: number,
  size = 48,
  thickness = 1,
  opacity = 0.5,
  drawHorizontal = true
) => ({
  position: "absolute" as const,
  top,
  bottom,
  left,
  right,
  width: `${size}px`,
  height: `${size}px`,
  borderTop: top !== undefined && drawHorizontal ? `${thickness}px solid #b8945f` : undefined,
  borderBottom: bottom !== undefined && drawHorizontal ? `${thickness}px solid #b8945f` : undefined,
  borderLeft: left !== undefined ? `${thickness}px solid #b8945f` : undefined,
  borderRight: right !== undefined ? `${thickness}px solid #b8945f` : undefined,
  opacity,
  pointerEvents: "none" as const,
  zIndex: 50,
});

export default function Home() {
  return (
    <main style={{ backgroundColor: "#fafaf8", fontFamily: "Georgia, serif" }}>
      <style>{`
        .nirun-float-btn {
          transition: transform 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease;
        }
        .nirun-float-btn:hover {
          transform: scale(1.08);
          background-color: #2a2422;
          box-shadow: 0 6px 20px rgba(0,0,0,0.35);
        }
      `}</style>
      <div
        className="float-icons"
        style={{
          position: "fixed",
          right: "1.5rem",
          bottom: "1.5rem",
          zIndex: 100,
          display: "flex",
          flexDirection: "column",
          gap: "0.9rem",
        }}
      >
        <a
          href="https://www.instagram.com/nirun.cl/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram de Nirün"
          className="nirun-float-btn"
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            backgroundColor: "#1a1a1a",
            border: "1px solid rgba(245,240,232,0.3)",
            boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#f5f0e8",
          }}
        >
          <InstagramIcon />
        </a>

        <TrackedLink
          href={WHATSAPP_HREF}
          eventName="whatsapp_click"
          eventData={{ location: "desktop_float" }}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Escríbenos por WhatsApp"
          className="nirun-float-btn"
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            backgroundColor: "#1a1a1a",
            border: "1px solid rgba(245,240,232,0.3)",
            boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#f5f0e8",
          }}
        >
          <WhatsAppIcon />
        </TrackedLink>
      </div>

      <div className="only-mobile" style={{ backgroundColor: "#1a1a1a", textAlign: "center" }}>
        <a
          href="#landa"
          style={{
            display: "block",
            backgroundColor: "#111",
            color: "#b8945f",
            fontSize: "clamp(0.62rem, 2.85vw, 0.72rem)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            textDecoration: "none",
            padding: "0.6rem 0.75rem",
            borderBottom: "1px solid rgba(184,148,95,0.25)",
          }}
        >
          Showroom Landa Brands · Vitacura · Con cita
        </a>
        <div
          className={elegant.className}
          style={{
            padding: "1.4rem 1rem 1.2rem",
            background:
              "radial-gradient(ellipse 70% 80% at 50% 30%, rgba(184,148,95,0.14) 0%, rgba(184,148,95,0) 70%), #1a1a1a",
          }}
        >
          <Image src="/logo-mark.png" alt="Logo Nirün" width={54} height={36} style={{ opacity: 0.95, margin: "0 auto" }} />
          <h1
            style={{
              fontSize: "2.3rem",
              letterSpacing: "0.3em",
              fontWeight: 500,
              color: "#f5f0e8",
              margin: "0.4rem 0 0.3rem",
              paddingLeft: "0.3em",
            }}
          >
            NIRÜN
          </h1>
          <p
            style={{
              fontSize: "0.82rem",
              letterSpacing: "0.18em",
              color: "#d8cdbd",
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            Prendas de lujo en Cashmere, Yak y Baby Camel de Mongolia
          </p>
        </div>
      </div>

      <div
        className="only-desktop"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "70vh",
          padding: "3rem 2rem",
          textAlign: "center",
          position: "relative",
          background:
            "radial-gradient(ellipse 60% 55% at 50% 38%, rgba(184,148,95,0.16) 0%, rgba(184,148,95,0) 60%), radial-gradient(ellipse 90% 70% at 50% 100%, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 60%), #1a1a1a",
        }}
      >
        <div style={cornerStyle(24, undefined, 24, undefined)} />
        <div style={cornerStyle(24, undefined, undefined, 24)} />
        <div style={cornerStyle(undefined, 24, 24, undefined, 48, 1, 0.5, false)} />
        <div style={cornerStyle(undefined, 24, undefined, 24, 48, 1, 0.5, false)} />

        <div style={cornerStyle(10, undefined, 10, undefined, 80, 1.5, 0.7)} />
        <div style={cornerStyle(10, undefined, undefined, 10, 80, 1.5, 0.7)} />
        <div style={cornerStyle(undefined, 10, 10, undefined, 80, 1.5, 0.7, false)} />
        <div style={cornerStyle(undefined, 10, undefined, 10, 80, 1.5, 0.7, false)} />

        <div className={elegant.className} style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Image
            src="/logo-mark.png"
            alt="Logo Nirün"
            width={90}
            height={60}
            style={{ marginBottom: "1rem", opacity: 0.95 }}
          />
          <h1
            style={{
              fontSize: "3.6rem",
              letterSpacing: "0.3em",
              fontWeight: 500,
              color: "#f5f0e8",
              marginBottom: "0.5rem",
              textShadow: "0 2px 10px rgba(0,0,0,0.35)",
            }}
          >
            NIRÜN
          </h1>
        </div>
        <p
          className={elegant.className}
          style={{
            position: "relative",
            zIndex: 10,
            fontSize: "1rem",
            letterSpacing: "0.25em",
            color: "#e8e0d4",
            textTransform: "uppercase",
            marginBottom: "2.5rem",
            textShadow: "0 1px 6px rgba(0,0,0,0.35)",
          }}
        >
          Fibras Naturales. Texturas sedosas. Diseño Atemporal.
        </p>
        <p
          className={elegant.className}
          style={{
            position: "relative",
            zIndex: 10,
            fontSize: "1.3rem",
            fontWeight: 500,
            color: "#f0ece4",
            maxWidth: "500px",
            lineHeight: "1.7",
            marginBottom: "2.5rem",
            textShadow: "0 1px 6px rgba(0,0,0,0.35)",
          }}
        >
          Prendas elaboradas a partir de Baby Camel, Cashmere, Yak y Seda.
          Seleccionadas para una audiencia que conoce la diferencia.
        </p>
        <TrackedLink
          href={CALENDLY_HREF}
          eventName="calendly_click"
          eventData={{ location: "hero" }}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            position: "relative",
            zIndex: 10,
            padding: "0.85rem 2.5rem",
            border: "1px solid #f5f0e8",
            color: "#f5f0e8",
            backgroundColor: "transparent",
            fontSize: "0.85rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            textDecoration: "none",
            transition: "all 0.2s",
            marginBottom: "4rem",
          }}
        >
          Agenda tu visita
        </TrackedLink>

        <a
          href="#detalle-yak"
          aria-label="Bajar para ver las fotos de todas las prendas"
          style={{
            position: "absolute",
            zIndex: 10,
            bottom: "2.5rem",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.6rem",
            textDecoration: "none",
            color: "#f5f0e8",
          }}
        >
          <span
            style={{
              fontSize: "0.7rem",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              textShadow: "0 1px 6px rgba(0,0,0,0.35)",
            }}
          >
            Descubre
          </span>
          <svg
            className="scroll-cue"
            aria-hidden="true"
            width="20"
            height="28"
            viewBox="0 0 20 28"
            fill="none"
          >
            <path
              d="M2 8 L10 16 L18 8"
              stroke="#f5f0e8"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2 18 L10 26 L18 18"
              stroke="#f5f0e8"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.5"
            />
          </svg>
        </a>
      </div>

      <Vitrina />

      <div
        id="landa"
        className="only-mobile"
        style={{
          backgroundColor: "#f1efe9",
          textAlign: "center",
          padding: "1.9rem 1.5rem 2.1rem",
          borderTop: "1px solid rgba(184,148,95,0.35)",
        }}
      >
        <p
          style={{
            fontSize: "0.72rem",
            letterSpacing: "0.3em",
            color: GOLD_TEXT,
            textTransform: "uppercase",
            margin: "0 0 0.8rem",
          }}
        >
          Nirün × Landa Brands
        </p>
        <p
          data-clarity-unmask="true"
          style={{ fontSize: "1.05rem", color: "#1a1a1a", lineHeight: 1.6, margin: "0 0 0.4rem" }}
        >
          Pruébalas en persona en el showroom de{" "}
          <a
            href="https://www.instagram.com/landa_brands/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#1a1a1a", fontWeight: 600 }}
          >
            @landa_brands
          </a>
        </p>
        <p style={{ fontSize: "0.9rem", color: "#555", margin: "0 0 1.4rem" }}>
          Vitacura, Santiago · Solo con cita
        </p>
        <TrackedLink
          href={CALENDLY_HREF}
          eventName="calendly_click"
          eventData={{ location: "mobile_landa" }}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-block",
            padding: "0.85rem 2rem",
            border: "1px solid #1a1a1a",
            color: "#1a1a1a",
            fontSize: "0.8rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            textDecoration: "none",
          }}
        >
          Agenda tu visita
        </TrackedLink>
        <p style={{ fontSize: "0.9rem", color: "#555", margin: "1.1rem 0 0" }}>
          ¿Prefieres escribirnos?{" "}
          <TrackedLink
            href={WHATSAPP_HREF}
            eventName="whatsapp_click"
            eventData={{ location: "mobile_landa" }}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#1a1a1a", fontWeight: 600, textDecoration: "underline", textUnderlineOffset: "3px", padding: "0.5rem 0" }}
          >
            Escríbenos por WhatsApp
          </TrackedLink>
        </p>
      </div>

      {fibers.map((fiber) => (
        <div key={fiber.key} id={fiber.anchor} className="fiber-section" style={{ padding: "3.5rem 2rem", backgroundColor: "#fafaf8" }}>
          <h2
            style={{
              fontSize: "0.9rem",
              letterSpacing: "0.3em",
              color: GOLD_TEXT,
              textTransform: "uppercase",
              textAlign: "center",
              marginBottom: "0.9rem",
            }}
          >
            {fiber.label}
          </h2>
          <p
            style={{
              maxWidth: "34rem",
              margin: "0 auto 2.2rem",
              padding: "0 1.5rem",
              textAlign: "center",
              fontSize: "0.95rem",
              lineHeight: 1.7,
              color: "#444",
            }}
          >
            {fiber.intro}
          </p>
          {Array.from(new Set(fiber.images.map((img) => img.garment))).map((garment) => {
            const producto = productoDePrenda(garment);
            return (
            <div key={garment} style={{ marginBottom: "2rem" }}>
              <h3
                style={{
                  fontSize: "1rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  fontWeight: 400,
                  color: "#1a1a1a",
                  textAlign: "center",
                  marginBottom: "0.3rem",
                }}
              >
                {producto ? (
                  <Link href={`/prenda/${producto.slug}`} style={{ color: "inherit", textDecoration: "none" }}>
                    {garment}
                  </Link>
                ) : (
                  garment
                )}
              </h3>
              {fiber.details[garment] && (
                <p
                  style={{
                    fontSize: "0.85rem",
                    letterSpacing: "0.04em",
                    color: "#555",
                    textAlign: "center",
                    margin: "0 0 1rem",
                    padding: "0 1rem",
                  }}
                >
                  {fiber.details[garment]}
                </p>
              )}
              {producto && (
                <div style={{ textAlign: "center", margin: "0 0 1rem", padding: "0 1rem" }}>
                  {producto.piezas.length === 1 ? (
                    <p style={{ margin: "0 0 0.1rem", fontSize: "1.1rem", color: "#1a1a1a" }}>
                      {precioCLP(producto.piezas[0].precio)}
                      <span style={{ fontSize: "0.8rem", color: "#555" }}> · IVA incluido</span>
                    </p>
                  ) : (
                    <>
                      {producto.piezas.map((pieza) => (
                        <p key={pieza.nombre} style={{ margin: "0 0 0.15rem", fontSize: "1rem", color: "#1a1a1a" }}>
                          {pieza.nombre} · {precioCLP(pieza.precio)}
                        </p>
                      ))}
                      <p style={{ margin: "0 0 0.1rem", fontSize: "0.8rem", color: "#555" }}>
                        IVA incluido · se venden por separado
                      </p>
                    </>
                  )}
                  <Link href={`/prenda/${producto.slug}`} className="ver-prenda">
                    Ver prenda →
                  </Link>
                </div>
              )}
              <div className="garment-row">
                {fiber.images
                  .filter((img) => img.garment === garment)
                  .map((img, n, fotos) => (
                    <div key={img.src} className="garment-item">
                      <ZoomableImage
                        src={img.src}
                        alt={`${garment} — ${fiber.label}, foto ${n + 1} de ${fotos.length}`}
                        sizes="(max-width: 768px) 80vw, 280px"
                      />
                    </div>
                  ))}
              </div>
            </div>
            );
          })}
        </div>
      ))}

      <section
        aria-labelledby="lujo-silencioso"
        style={{
          backgroundColor: "#fafaf8",
          padding: "3.5rem 1.5rem 4rem",
          textAlign: "center",
          borderTop: "1px solid rgba(184,148,95,0.35)",
        }}
      >
        <div style={{ maxWidth: "36rem", margin: "0 auto" }}>
          <h2
            id="lujo-silencioso"
            style={{
              fontSize: "0.9rem",
              letterSpacing: "0.3em",
              color: GOLD_TEXT,
              textTransform: "uppercase",
              margin: "0 0 1.4rem",
              fontWeight: 400,
            }}
          >
            Lujo silencioso
          </h2>
          <p className={elegant.className} style={{ fontSize: "1.4rem", lineHeight: 1.55, color: "#1a1a1a", margin: "0 0 1.3rem" }}>
            En las estepas de Mongolia, donde el clima alcanza extremos y la naturaleza define el ritmo de la vida,
            nace una de las fibras más nobles del mundo.
          </p>
          <p style={{ fontSize: "1rem", lineHeight: 1.85, color: "#444", margin: "0 0 1rem" }}>
            Detrás de cada prenda hay manos expertas, principalmente mujeres, cuyo trabajo no solo da forma a la fibra,
            sino que sostiene comunidades y tradiciones. Cada pieza es ligera, cálida y duradera: una suavidad que no se
            impone, se percibe.
          </p>
          <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "#555", fontStyle: "italic", margin: "1.6rem 0 0" }}>
            Nirün, en el antiguo idioma mongol, significa «linaje puro». En la cultura mongol, los Nirün eran la
            aristocracia.
          </p>
        </div>
      </section>

      <div style={{ display: "flex", flexWrap: "wrap", backgroundColor: "#f1efe9" }}>
        <div
          style={{
            flex: "1 1 420px",
            height: "520px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gridTemplateRows: "1fr 1fr",
            gap: "3px",
          }}
        >
          {[
            { src: "/fibers/collage/khulan_detail.jpg", alt: "Abrigo cruzado Nirün en lana y yak, detalle", pos: "center" },
            { src: "/fibers/collage/zaya_detail.jpg", alt: "Cárdigan Nirün en cashmere, detalle", pos: "center" },
            { src: "/fibers/collage/sernai_silk_detail.jpg", alt: "Conjunto sastre Nirün en baby camel, detalle", pos: "center" },
            { src: "/fibers/collage/nomin_negro_detail.jpg", alt: "Abrigo largo Nirün en yak negro, detalle", pos: "center" },
          ].map((img) => (
            <div key={img.src} style={{ position: "relative" }}>
              <ZoomableImage
                src={img.src}
                alt={img.alt}
                sizes="(max-width: 768px) 50vw, 360px"
                objectPosition={img.pos}
              />
            </div>
          ))}
        </div>
        <div
          style={{
            flex: "1 1 420px",
            padding: "3.5rem 3.5rem",
            maxWidth: "560px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.7rem", marginBottom: "1.2rem" }}>
            <span style={{ color: "#b8945f", fontSize: "0.55rem", opacity: 0.7, transform: "rotate(45deg)", display: "inline-block" }}>■</span>
            <h2
              style={{
                fontSize: "1.4rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                fontWeight: 400,
                color: "#1a1a1a",
                margin: 0,
              }}
            >
              Visítanos
            </h2>
          </div>
          <p style={{ fontSize: "1rem", color: "#444", lineHeight: "1.9", marginBottom: "1.8rem" }}>
            Nuestras prendas están disponibles para probar en persona dentro del showroom de{" "}
            <strong>Landa Brands</strong>, en Vitacura. La caída de una fibra como esta se entiende
            de verdad al tocarla — agenda tu cita y ven a conocerla.
          </p>
          <TrackedLink
            href={CALENDLY_HREF}
            eventName="calendly_click"
            eventData={{ location: "visitanos" }}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: "0.85rem 2.5rem",
              border: "1px solid #1a1a1a",
              color: "#1a1a1a",
              backgroundColor: "transparent",
              fontSize: "0.85rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              textDecoration: "none",
              display: "inline-block",
              width: "fit-content",
            }}
          >
            Agenda tu visita
          </TrackedLink>
        </div>
      </div>

      <footer
        className="nirun-footer"
        style={{
          textAlign: "center",
          padding: "4rem 2rem",
          backgroundColor: "#1a1a1a",
        }}
      >
        <svg width="36" height="24" viewBox="0 0 44 30" fill="none" aria-hidden="true" style={{ display: "block", margin: "0 auto 1.5rem", opacity: 0.35 }}>
          <path d="M10 28 Q 5 17 10 6 Q 15 17 10 28 Z" stroke="#f5f0e8" strokeWidth="0.9" fill="#f5f0e8" fillOpacity="0.1"/>
          <path d="M22 30 Q 14 16 22 2 Q 30 16 22 30 Z" stroke="#f5f0e8" strokeWidth="1.2" fill="#f5f0e8" fillOpacity="0.15"/>
          <path d="M34 28 Q 29 17 34 6 Q 39 17 34 28 Z" stroke="#f5f0e8" strokeWidth="0.9" fill="#f5f0e8" fillOpacity="0.1"/>
        </svg>
        <p
          style={{
            fontSize: "1.3rem",
            letterSpacing: "0.1em",
            color: "#f5f0e8",
            lineHeight: "1.8",
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          Mongolia como origen. El lujo como visión.
        </p>

        <div style={{ marginTop: "3rem", maxWidth: "480px", marginLeft: "auto", marginRight: "auto" }}>
          <p
            style={{
              fontSize: "0.8rem",
              letterSpacing: "0.2em",
              color: "#b8945f",
              textTransform: "uppercase",
              marginBottom: "1.2rem",
            }}
          >
            Déjanos tu correo
          </p>
          <NewsletterForm />
        </div>
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
            eventData={{ location: "mobile_sticky" }}
            target="_blank"
            rel="noopener noreferrer"
            className="sticky-agenda"
          >
            Agenda tu visita
          </TrackedLink>
          <TrackedLink
            href={WHATSAPP_HREF}
            eventName="whatsapp_click"
            eventData={{ location: "mobile_sticky" }}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Escríbenos por WhatsApp"
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
