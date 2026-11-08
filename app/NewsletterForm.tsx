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
      <p className="newsletter__gracias" role="status">
        Gracias — te vamos a escribir pronto.
      </p>
    );
  }

  return (
    <form action="https://api.web3forms.com/submit" method="POST" className="newsletter">
      <input type="hidden" name="access_key" value="9b26d8d9-fbb3-4aa4-b057-bd759bde0537" />
      <input type="hidden" name="subject" value="Nuevo correo desde nirun.cl" />
      <input type="hidden" name="redirect" value="https://www.nirun.cl/?gracias=1" />
      <input
        type="email"
        name="email"
        required
        aria-label="Tu correo"
        autoComplete="email"
        inputMode="email"
        className="newsletter__campo"
        placeholder="Tu correo"
      />
      <button type="submit" className="boton boton--marfil newsletter__boton">
        Enviar
      </button>
    </form>
  );
}
