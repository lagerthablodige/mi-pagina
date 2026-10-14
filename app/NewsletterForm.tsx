"use client";

import { useEffect, useState } from "react";

export default function NewsletterForm() {
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("gracias") === "1") {
      setSent(true);
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  if (sent) {
    return (
      <p style={{ color: "#f5f0e8", fontSize: "1rem", letterSpacing: "0.05em" }}>
        Gracias — te vamos a escribir pronto.
      </p>
    );
  }

  return (
    <form
      action="https://api.web3forms.com/submit"
      method="POST"
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "0.8rem",
        maxWidth: "480px",
        margin: "0 auto",
      }}
    >
      <input type="hidden" name="access_key" value="9b26d8d9-fbb3-4aa4-b057-bd759bde0537" />
      <input type="hidden" name="subject" value="Nuevo correo desde nirun.cl" />
      <input type="hidden" name="redirect" value="https://www.nirun.cl/?gracias=1" />
      <input
        type="email"
        name="email"
        required
        placeholder="Tu correo"
        style={{
          flex: "1 1 240px",
          padding: "0.85rem 1.2rem",
          backgroundColor: "transparent",
          border: "1px solid #f5f0e8",
          color: "#f5f0e8",
          fontSize: "0.9rem",
          outline: "none",
        }}
      />
      <button
        type="submit"
        style={{
          padding: "0.85rem 2rem",
          border: "1px solid #f5f0e8",
          color: "#1a1a1a",
          backgroundColor: "#f5f0e8",
          fontSize: "0.85rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          cursor: "pointer",
        }}
      >
        Enviar
      </button>
    </form>
  );
}
