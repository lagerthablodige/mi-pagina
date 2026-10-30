import Link from "next/link";
import { Cormorant_Garamond } from "next/font/google";
import { WHATSAPP_HREF } from "./links";

const elegant = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500"] });

// Página 404 con el estilo de la marca (fondo oscuro, dorado).
export default function NotFound() {
  return (
    <main
      className={elegant.className}
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "2rem 1.5rem",
        backgroundColor: "#1a1a1a",
        background:
          "radial-gradient(ellipse 70% 60% at 50% 35%, rgba(184,148,95,0.14) 0%, rgba(184,148,95,0) 70%), #1a1a1a",
        color: "#f5f0e8",
      }}
    >
      <p style={{ fontSize: "0.8rem", letterSpacing: "0.3em", color: "#b8945f", textTransform: "uppercase", margin: "0 0 1rem" }}>
        Error 404
      </p>
      <h1 style={{ fontSize: "2.4rem", letterSpacing: "0.25em", fontWeight: 500, margin: "0 0 1rem", paddingLeft: "0.25em" }}>
        NIRÜN
      </h1>
      <p style={{ fontSize: "1.25rem", lineHeight: 1.6, maxWidth: "420px", margin: "0 0 2rem", color: "#e8e0d4" }}>
        No encontramos esta página. Puede que el enlace haya cambiado.
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.8rem", justifyContent: "center" }}>
        <Link
          href="/"
          style={{
            padding: "0.85rem 2rem",
            backgroundColor: "#b8945f",
            color: "#1a1a1a",
            fontSize: "0.85rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          Volver al inicio
        </Link>
        <a
          href={WHATSAPP_HREF}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: "0.85rem 2rem",
            border: "1px solid rgba(245,240,232,0.5)",
            color: "#f5f0e8",
            fontSize: "0.85rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            textDecoration: "none",
          }}
        >
          Escríbenos por WhatsApp
        </a>
      </div>
    </main>
  );
}
