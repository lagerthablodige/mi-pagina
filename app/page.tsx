import Image from "next/image";
import { Cormorant_Garamond } from "next/font/google";
import Vitrina from "./Vitrina";
import TrackedLink from "./TrackedLink";
import NewsletterForm from "./NewsletterForm";
import ZoomableImage from "./ZoomableImage";
import { fibers } from "./fibersData";

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

const FlameOrnament = () => (
  <svg width="44" height="30" viewBox="0 0 44 30" fill="none" aria-hidden="true" style={{ marginBottom: "1rem", opacity: 0.9 }}>
    <path d="M10 28 Q 5 17 10 6 Q 15 17 10 28 Z" stroke="#b8945f" strokeWidth="0.9" fill="#b8945f" fillOpacity="0.1"/>
    <path d="M22 30 Q 14 16 22 2 Q 30 16 22 30 Z" stroke="#b8945f" strokeWidth="1.2" fill="#b8945f" fillOpacity="0.15"/>
    <path d="M34 28 Q 29 17 34 6 Q 39 17 34 28 Z" stroke="#b8945f" strokeWidth="0.9" fill="#b8945f" fillOpacity="0.1"/>
  </svg>
);

const WHATSAPP_HREF =
  "https://wa.me/56990911592?text=Hola%2C%20me%20gustar%C3%ADa%20recibir%20atenci%C3%B3n%20personalizada%20para%20resolver%20algunas%20dudas.";
const CALENDLY_HREF = "https://calendly.com/ventas-landabrands/visita-al-showroom-de-landa-brands-cl";

export default function Home() {
  return (
    <div style={{ backgroundColor: "#fafaf8", fontFamily: "Georgia, serif" }}>
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
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="2.5" y="2.5" width="19" height="19" rx="5" stroke="#f5f0e8" strokeWidth="1.2" />
            <circle cx="12" cy="12" r="5" stroke="#f5f0e8" strokeWidth="1.2" />
            <circle cx="17.6" cy="6.4" r="1.1" fill="#f5f0e8" />
          </svg>
        </a>

        <a
          href={WHATSAPP_HREF}
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
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M12 2.5c-5.25 0-9.5 4.25-9.5 9.5 0 1.68.44 3.26 1.21 4.63L2.5 21.5l5.02-1.19a9.46 9.46 0 0 0 4.48 1.14c5.25 0 9.5-4.25 9.5-9.5s-4.25-9.45-9.5-9.45Z"
              stroke="#f5f0e8"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            <path
              d="M8.3 7.6c.2-.45.4-.46.6-.47.16-.01.35-.01.5.01.17.02.4-.02.62.5.24.58.82 2 .89 2.14.07.15.12.32.02.51-.1.19-.15.31-.3.47-.14.16-.3.36-.43.48-.14.14-.28.28-.13.56.16.29.7 1.2 1.53 1.95 1.06.96 1.94 1.26 2.23 1.4.29.15.46.13.63-.07.17-.2.72-.82.91-1.1.19-.28.38-.23.63-.14.26.1 1.65.79 1.93.94.28.14.47.21.53.34.06.13.06.75-.19 1.47-.25.72-1.42 1.38-1.96 1.44-.5.06-1.13.09-1.83-.11-.42-.12-.96-.31-1.65-.6-2.91-1.24-4.81-4.08-4.96-4.28-.14-.2-1.18-1.56-1.18-2.98 0-1.42.75-2.12 1.02-2.41Z"
              fill="#f5f0e8"
            />
          </svg>
        </a>
      </div>

      <div className="only-mobile" style={{ backgroundColor: "#1a1a1a", textAlign: "center" }}>
        <a
          href="#landa"
          style={{
            display: "block",
            backgroundColor: "#111",
            color: "#b8945f",
            fontSize: "0.62rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            textDecoration: "none",
            padding: "0.6rem 1rem",
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
            Cashmere · Yak · Baby Camel de Mongolia
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
          padding: "2.2rem 1.5rem 2.4rem",
          borderTop: "1px solid rgba(184,148,95,0.35)",
        }}
      >
        <p
          style={{
            fontSize: "0.7rem",
            letterSpacing: "0.3em",
            color: "#b8945f",
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
      </div>

      {fibers.map((fiber) => (
        <div key={fiber.key} id={fiber.anchor} className="fiber-section" style={{ padding: "3.5rem 2rem", backgroundColor: "#fafaf8" }}>
          <p
            style={{
              fontSize: "0.85rem",
              letterSpacing: "0.3em",
              color: "#b8945f",
              textTransform: "uppercase",
              textAlign: "center",
              marginBottom: "2rem",
            }}
          >
            {fiber.label}
          </p>
          {Array.from(new Set(fiber.images.map((img) => img.garment))).map((garment) => (
            <div key={garment} style={{ marginBottom: "2rem" }}>
              <h3
                style={{
                  fontSize: "1rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  fontWeight: 400,
                  color: "#1a1a1a",
                  textAlign: "center",
                  marginBottom: "1rem",
                }}
              >
                {garment}
              </h3>
              <div className="garment-row">
                {fiber.images
                  .filter((img) => img.garment === garment)
                  .map((img) => (
                    <div key={img.src} className="garment-item">
                      <ZoomableImage
                        src={img.src}
                        alt={`${garment} — ${fiber.label}`}
                        sizes="(max-width: 768px) 80vw, 280px"
                      />
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      ))}

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

      <div
        className="nirun-footer"
        style={{
          textAlign: "center",
          padding: "4rem 2rem",
          backgroundColor: "#1a1a1a",
        }}
      >
        <svg width="36" height="24" viewBox="0 0 44 30" fill="none" aria-hidden="true" style={{ marginBottom: "1.5rem", opacity: 0.35 }}>
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
      </div>

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
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#b8945f",
              color: "#1a1a1a",
              padding: "0.85rem 0.5rem",
              fontSize: "0.8rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Agenda tu visita
          </TrackedLink>
          <a
            href={WHATSAPP_HREF}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Escríbenos por WhatsApp"
            style={{
              width: "48px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid rgba(245,240,232,0.35)",
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M12 2.5c-5.25 0-9.5 4.25-9.5 9.5 0 1.68.44 3.26 1.21 4.63L2.5 21.5l5.02-1.19a9.46 9.46 0 0 0 4.48 1.14c5.25 0 9.5-4.25 9.5-9.5s-4.25-9.45-9.5-9.45Z"
                stroke="#f5f0e8"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
              <path
                d="M8.3 7.6c.2-.45.4-.46.6-.47.16-.01.35-.01.5.01.17.02.4-.02.62.5.24.58.82 2 .89 2.14.07.15.12.32.02.51-.1.19-.15.31-.3.47-.14.16-.3.36-.43.48-.14.14-.28.28-.13.56.16.29.7 1.2 1.53 1.95 1.06.96 1.94 1.26 2.23 1.4.29.15.46.13.63-.07.17-.2.72-.82.91-1.1.19-.28.38-.23.63-.14.26.1 1.65.79 1.93.94.28.14.47.21.53.34.06.13.06.75-.19 1.47-.25.72-1.42 1.38-1.96 1.44-.5.06-1.13.09-1.83-.11-.42-.12-.96-.31-1.65-.6-2.91-1.24-4.81-4.08-4.96-4.28-.14-.2-1.18-1.56-1.18-2.98 0-1.42.75-2.12 1.02-2.41Z"
                fill="#f5f0e8"
              />
            </svg>
          </a>
          <a
            href="https://www.instagram.com/nirun.cl/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram de Nirün"
            style={{
              width: "48px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid rgba(245,240,232,0.35)",
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="2.5" y="2.5" width="19" height="19" rx="5" stroke="#f5f0e8" strokeWidth="1.2" />
              <circle cx="12" cy="12" r="5" stroke="#f5f0e8" strokeWidth="1.2" />
              <circle cx="17.6" cy="6.4" r="1.1" fill="#f5f0e8" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
