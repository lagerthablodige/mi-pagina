import Image from "next/image";
import { Cormorant_Garamond } from "next/font/google";
import Vitrina from "./Vitrina";
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
  borderTop: top !== undefined && drawHorizontal ? `${thickness}px solid #a36b3f` : undefined,
  borderBottom: bottom !== undefined && drawHorizontal ? `${thickness}px solid #a36b3f` : undefined,
  borderLeft: left !== undefined ? `${thickness}px solid #a36b3f` : undefined,
  borderRight: right !== undefined ? `${thickness}px solid #a36b3f` : undefined,
  opacity,
  pointerEvents: "none" as const,
  zIndex: 50,
});

const FlameOrnament = () => (
  <svg width="44" height="30" viewBox="0 0 44 30" fill="none" aria-hidden="true" style={{ marginBottom: "1rem", opacity: 0.9 }}>
    <path d="M10 28 Q 5 17 10 6 Q 15 17 10 28 Z" stroke="#a36b3f" strokeWidth="0.9" fill="#a36b3f" fillOpacity="0.1"/>
    <path d="M22 30 Q 14 16 22 2 Q 30 16 22 30 Z" stroke="#a36b3f" strokeWidth="1.2" fill="#a36b3f" fillOpacity="0.15"/>
    <path d="M34 28 Q 29 17 34 6 Q 39 17 34 28 Z" stroke="#a36b3f" strokeWidth="0.9" fill="#a36b3f" fillOpacity="0.1"/>
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
      <div
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
            "radial-gradient(ellipse 60% 55% at 50% 38%, rgba(163,107,63,0.16) 0%, rgba(163,107,63,0) 60%), radial-gradient(ellipse 90% 70% at 50% 100%, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 60%), #1a1a1a",
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
        <a
          href={CALENDLY_HREF}
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
        </a>

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

      {fibers.map((fiber) => (
        <div key={fiber.key} id={fiber.anchor} style={{ padding: "3.5rem 2rem", backgroundColor: "#fafaf8" }}>
          <p
            style={{
              fontSize: "0.85rem",
              letterSpacing: "0.3em",
              color: "#a36b3f",
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
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                  gap: "4px",
                  maxWidth: "1100px",
                  margin: "0 auto",
                }}
              >
                {fiber.images
                  .filter((img) => img.garment === garment)
                  .map((img) => (
                    <div key={img.src} style={{ position: "relative", height: "460px" }}>
                      <Image src={img.src} alt={`${garment} — ${fiber.label}`} fill style={{ objectFit: "cover" }} />
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      ))}

      <div
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
            margin: "0 auto 2rem",
          }}
        >
          Mongolia como origen. El lujo como visión.
        </p>
        <a
          href={CALENDLY_HREF}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: "0.85rem 2.5rem",
            border: "1px solid #f5f0e8",
            color: "#f5f0e8",
            backgroundColor: "transparent",
            fontSize: "0.85rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          Agenda tu visita
        </a>
      </div>
    </div>
  );
}
