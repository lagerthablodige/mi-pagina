"use client";

import { useEffect, useState } from "react";
import TrackedLink from "./TrackedLink";
import { CALENDLY_HREF } from "./links";

type Props = {
  // Inicio y ficha usan la misma barra; solo cambian los bloques que, si se ven, la esconden.
  modo: "inicio" | "ficha";
  whatsappHref: string;
  ubicacionAgenda: string; // eventData.location de Calendly
  ubicacionWhatsapp: string; // eventData.location de WhatsApp
  // Ficha: nombre y precio en una línea sobre los botones (M03). Solo se ve; el lector de pantalla ya tiene el h1.
  resumen?: { nombre: string; precio: string };
};

// Bloques de la página que ya tienen los mismos botones: mientras alguno se ve, la barra no se muestra.
// .pie está aquí a propósito: su espacio de abajo ya no reserva lugar para la barra (M33). Si se saca, la barra tapa el ©.
const BLOQUES_CON_BOTONES = [".hero__botones", ".showroom__botones", ".ficha__botones", ".pie"];
// Estos solo cuentan si se ven enteros. Con los botones del hero cortados (iPhone chico dentro de Instagram)
// no habría ningún botón usable: la barra aparece.
const ENTEROS = ".hero__botones";
// "Entero" = al menos el 99 % a la vista. El umbral del observador es el mismo, así nunca queda un estado a medias.
const CASI_ENTERO = 0.99;
// Lo que queda bajo el encabezado fijo del celular (56 px) no se cuenta como visto.
const BAJO_ENCABEZADO = "-56px 0px 0px 0px";
// El pie se cuenta desde 240 px antes de entrar: así la barra no aparece y desaparece en el tramo corto
// entre los botones de la ficha y el pie (y no tapa «Más en…»).
const ANTES_DEL_PIE = "0px 0px 240px 0px";

// Barra fija inferior del celular: Agenda tu visita + WhatsApp. En PC no existe.
export default function BarraFija({ modo, whatsappHref, ubicacionAgenda, ubicacionWhatsapp, resumen }: Props) {
  // Antes de saber qué se ve, en la ficha ya se muestra (sus botones quedan bajo la primera pantalla)
  // y en el inicio no (el hero trae sus botones).
  const [visible, setVisible] = useState(modo === "ficha");
  // El resumen solo aparece cuando el título de la ficha no se ve entero: nunca repite la cartela.
  const [conResumen, setConResumen] = useState(false);
  const hayResumen = Boolean(resumen);

  useEffect(() => {
    const bloques = BLOQUES_CON_BOTONES.flatMap((sel) => Array.from(document.querySelectorAll(sel)));
    if (bloques.length === 0) {
      setVisible(true);
      return;
    }
    const viendose = new Set<Element>();
    const alCambiar: IntersectionObserverCallback = (entradas) => {
      for (const entrada of entradas) {
        const aLaVista = entrada.target.matches(ENTEROS)
          ? entrada.intersectionRatio >= CASI_ENTERO
          : entrada.isIntersecting;
        if (aLaVista) viendose.add(entrada.target);
        else viendose.delete(entrada.target);
      }
      setVisible(viendose.size === 0);
    };
    const general = new IntersectionObserver(alCambiar, { threshold: [0, CASI_ENTERO], rootMargin: BAJO_ENCABEZADO });
    const pie = new IntersectionObserver(alCambiar, { threshold: 0, rootMargin: ANTES_DEL_PIE });
    bloques.forEach((el) => (el.matches(".pie") ? pie : general).observe(el));
    return () => {
      general.disconnect();
      pie.disconnect();
    };
  }, [modo]);

  // Ficha: el título no esconde la barra (los botones de la ficha quedan bajo la primera pantalla); solo decide
  // si la barra lleva el nombre y el precio.
  useEffect(() => {
    if (!hayResumen) return;
    const titulo = document.querySelector(".ficha__titulo");
    if (!titulo) {
      setConResumen(true);
      return;
    }
    const observador = new IntersectionObserver(
      ([entrada]) => setConResumen(entrada.intersectionRatio < CASI_ENTERO),
      { threshold: [0, CASI_ENTERO], rootMargin: BAJO_ENCABEZADO }
    );
    observador.observe(titulo);
    return () => observador.disconnect();
  }, [hayResumen]);

  const clases = `barra-fija${visible ? " barra-fija--visible" : ""}${conResumen ? " barra-fija--con-resumen" : ""}`;

  return (
    <div className={clases} data-modo={modo} inert={!visible}>
      {resumen && (
        <p className="barra-fija__resumen" aria-hidden="true">
          <span className="barra-fija__resumen-nombre">{resumen.nombre}</span>
          <span className="barra-fija__resumen-precio">{resumen.precio}</span>
        </p>
      )}
      <TrackedLink
        href={CALENDLY_HREF}
        eventName="calendly_click"
        eventData={{ location: ubicacionAgenda }}
        target="_blank"
        rel="noopener noreferrer"
        className="boton boton--tinta barra-fija__agenda"
      >
        Agenda tu visita
      </TrackedLink>
      <TrackedLink
        href={whatsappHref}
        eventName="whatsapp_click"
        eventData={{ location: ubicacionWhatsapp }}
        target="_blank"
        rel="noopener noreferrer"
        className="boton boton--contorno barra-fija__whatsapp"
      >
        WhatsApp
      </TrackedLink>
    </div>
  );
}
