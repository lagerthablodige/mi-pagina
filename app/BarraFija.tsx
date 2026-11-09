"use client";

import { useEffect, useRef, useState } from "react";
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
// .seccion--mas («Más en …», al final de la ficha, justo antes del pie) cuenta como el pie: así la barra no reaparece
// entre los botones de la ficha y el pie.
const BLOQUES_CON_BOTONES = [".hero__botones", ".showroom__botones", ".ficha__botones", ".seccion--mas", ".pie"];
// Se cuentan con el margen de antes del pie.
const COMO_EL_PIE = ".pie, .seccion--mas";
// Estos solo cuentan si se ven enteros. Con los botones del hero cortados (iPhone chico dentro de Instagram)
// no habría ningún botón usable: la barra aparece. Se miden contra la pantalla entera (sin descontar el encabezado,
// que al bajar se esconde): así la barra no aparece mientras los botones del hero se ven enteros.
const ENTEROS = ".hero__botones";
// "Entero" = al menos el 99 % a la vista. El umbral del observador es el mismo, así nunca queda un estado a medias.
const CASI_ENTERO = 0.99;
// Lo que queda bajo el encabezado fijo del celular (56 px) no se cuenta como visto.
const BAJO_ENCABEZADO = "-56px 0px 0px 0px";
// El pie se cuenta desde 240 px antes de entrar. En la ficha, «Más en …» ya se cuenta antes de que salgan sus botones,
// así que la barra no reaparece al final (240 px no alcanzaban en pantallas de menos de unos 870 px de alto).
const ANTES_DEL_PIE = "0px 0px 240px 0px";

// Barra fija inferior del celular: Agenda tu visita + WhatsApp. En PC no existe.
export default function BarraFija({ modo, whatsappHref, ubicacionAgenda, ubicacionWhatsapp, resumen }: Props) {
  // Antes de saber qué se ve, en la ficha ya se muestra (sus botones quedan bajo la primera pantalla)
  // y en el inicio no (el hero trae sus botones).
  const [visible, setVisible] = useState(modo === "ficha");
  // El resumen solo aparece cuando el título de la ficha no se ve entero: nunca repite la cartela.
  const [conResumen, setConResumen] = useState(false);
  const hayResumen = Boolean(resumen);
  const barra = useRef<HTMLDivElement>(null);

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
    const enteros = new IntersectionObserver(alCambiar, { threshold: [0, CASI_ENTERO] });
    const pie = new IntersectionObserver(alCambiar, { threshold: 0, rootMargin: ANTES_DEL_PIE });
    bloques.forEach((el) => (el.matches(ENTEROS) ? enteros : el.matches(COMO_EL_PIE) ? pie : general).observe(el));
    return () => {
      general.disconnect();
      enteros.disconnect();
      pie.disconnect();
    };
  }, [modo]);

  // Ficha: el precio no esconde la barra (los botones de la ficha quedan bajo la primera pantalla); solo decide
  // si la barra lleva el nombre y el precio. Se mira el precio de la cartela (en Sernaí Silk, el de la primera pieza)
  // y no el título: con el título a la vista y el precio tapado por la barra, la clienta no veía ningún precio.
  // .ficha__precio no sirve: en el celular es display: contents (sin caja) y nunca se vería.
  useEffect(() => {
    if (!hayResumen) return;
    const objetivo = document.querySelector(".ficha__info .precio--grande") ?? document.querySelector(".ficha__titulo");
    if (!objetivo) {
      setConResumen(true);
      return;
    }
    // Lo que queda bajo la barra tampoco se cuenta como visto. Alto de la barra sin el resumen (al montar no se ve;
    // si se viera, se descuenta): el margen no depende del resumen, así que no oscila. En PC la barra no existe (0).
    let altoBarra = 0;
    const el = barra.current;
    if (el) {
      altoBarra = el.offsetHeight;
      const fila = el.querySelector<HTMLElement>(".barra-fija__resumen");
      if (fila && fila.offsetHeight > 0) {
        altoBarra -= fila.offsetHeight + (parseFloat(getComputedStyle(el).rowGap) || 0);
      }
    }
    const observador = new IntersectionObserver(
      ([entrada]) => setConResumen(entrada.intersectionRatio < CASI_ENTERO),
      { threshold: [0, CASI_ENTERO], rootMargin: `-56px 0px ${-Math.max(0, Math.round(altoBarra))}px 0px` }
    );
    observador.observe(objetivo);
    return () => observador.disconnect();
  }, [hayResumen]);

  const clases = `barra-fija${visible ? " barra-fija--visible" : ""}${conResumen ? " barra-fija--con-resumen" : ""}`;

  return (
    <div ref={barra} className={clases} data-modo={modo} inert={!visible}>
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
