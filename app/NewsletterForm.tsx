"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { usePathname } from "next/navigation";
import { medirPaso, paginaDe } from "./medicion";

type Estado = "listo" | "enviando" | "ok" | "error";

// Formulario de correo del pie (M24). Con JS se envía sin salir del sitio y el «Gracias» aparece donde se escribió.
// Sin JS, Web3Forms vuelve a la misma página, al pie (#correo), con ?gracias=1.
export default function NewsletterForm() {
  const ruta = usePathname();
  const [estado, setEstado] = useState<Estado>("listo");
  const formulario = useRef<HTMLFormElement>(null);
  const redirect = useRef<HTMLInputElement>(null);
  const gracias = useRef<HTMLParagraphElement>(null);
  const campo = useRef<HTMLInputElement>(null);
  // Alto del formulario al cambiar al «Gracias»: el mensaje ocupa lo mismo y el pie no salta (CLS).
  const [alto, setAlto] = useState<number>();

  useEffect(() => {
    // Respaldo sin JS: volver a esta misma página (también en un preview o en localhost), al pie.
    if (redirect.current) redirect.current.value = `${location.origin}${location.pathname}?gracias=1#correo`;

    // Vuelta desde Web3Forms (envío sin JS o antes de que cargara la página).
    if (new URLSearchParams(location.search).get("gracias") === "1") {
      setAlto(formulario.current?.offsetHeight || undefined);
      setEstado("ok");
      // Un tick después: la analítica de Vercel se arma en un efecto que corre después de este.
      const pagina = paginaDe(location.pathname).pagina;
      setTimeout(() => medirPaso("newsletter_enviado", { pagina }), 0);
      history.replaceState(history.state, "", `${location.pathname}#correo`);
    }
  }, []);

  useEffect(() => {
    if (estado !== "ok") return;
    gracias.current?.scrollIntoView({ block: "center" });
    gracias.current?.focus({ preventScroll: true });
  }, [estado]);

  // Si falla, el foco vuelve al campo (el botón enfocado estaba deshabilitado y el foco caía en <body>).
  // El mensaje se anuncia igual (role="alert").
  function mostrarError() {
    setEstado("error");
    requestAnimationFrame(() => campo.current?.focus({ preventScroll: true }));
  }

  async function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (estado === "enviando") return;
    setEstado("enviando");
    const datos = new FormData(e.currentTarget);
    // Sin redirect, Web3Forms responde JSON. Con él podría redirigir: r.json() fallaría y se mostraría un error
    // aunque el correo quedó guardado.
    datos.delete("redirect");
    try {
      const r = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: datos,
      });
      const respuesta = (await r.json()) as { success?: boolean };
      if (respuesta.success) {
        setAlto(formulario.current?.offsetHeight || undefined);
        setEstado("ok");
        medirPaso("newsletter_enviado", { pagina: paginaDe(location.pathname).pagina }); // nunca el correo
      } else {
        mostrarError();
      }
    } catch {
      mostrarError();
    }
  }

  if (estado === "ok") {
    return (
      <p ref={gracias} tabIndex={-1} className="newsletter__gracias" role="status" style={alto ? { minHeight: alto } : undefined}>
        Gracias. Ya estás en la lista.
      </p>
    );
  }

  const enviando = estado === "enviando";

  return (
    <>
      <form
        ref={formulario}
        action="https://api.web3forms.com/submit"
        method="POST"
        onSubmit={enviar}
        className="newsletter"
        data-clarity-mask="true"
      >
        <input type="hidden" name="access_key" value="9b26d8d9-fbb3-4aa4-b057-bd759bde0537" />
        <input type="hidden" name="subject" value="Nuevo correo desde nirun.cl" />
        <input ref={redirect} type="hidden" name="redirect" defaultValue={`https://www.nirun.cl${ruta ?? "/"}?gracias=1#correo`} />
        {/* Campo anti-bots de Web3Forms: una persona nunca lo ve ni lo marca. */}
        <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" style={{ display: "none" }} />
        <input
          ref={campo}
          type="email"
          name="email"
          required
          aria-label="Tu correo"
          autoComplete="email"
          inputMode="email"
          className="newsletter__campo"
          placeholder="Tu correo"
        />
        <button type="submit" className="boton boton--contorno-marfil newsletter__boton" disabled={enviando}>
          {enviando ? "Enviando…" : "Suscribirme"}
        </button>
      </form>
      {estado === "error" && (
        <p role="alert" className="newsletter__error">
          No pudimos guardar tu correo. Inténtalo de nuevo o escríbenos por WhatsApp.
        </p>
      )}
    </>
  );
}
