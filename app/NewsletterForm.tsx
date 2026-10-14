"use client";

import { useState } from "react";

export default function NewsletterForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = e.currentTarget;
    const data = new FormData(form);
    data.append("access_key", "9b26d8d9-fbb3-4aa4-b057-bd759bde0537");
    data.append("subject", "Nuevo correo desde nirun.cl");

    try {
      // Web3Forms no siempre devuelve encabezados CORS legibles desde el navegador,
      // así que se envía en modo "no-cors": no podemos leer la respuesta, pero
      // si fetch no lanza un error, la solicitud sí llegó al servidor.
      await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        mode: "no-cors",
        body: data,
      });
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <p style={{ color: "#f5f0e8", fontSize: "1rem", letterSpacing: "0.05em" }}>
        Gracias — te vamos a escribir pronto.
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "0.8rem",
        maxWidth: "480px",
        margin: "0 auto",
      }}
    >
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
        disabled={status === "sending"}
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
        {status === "sending" ? "Enviando..." : "Enviar"}
      </button>
      {status === "error" && (
        <p style={{ width: "100%", color: "#e8a0a0", fontSize: "0.85rem" }}>
          Algo falló, inténtalo de nuevo.
        </p>
      )}
    </form>
  );
}
